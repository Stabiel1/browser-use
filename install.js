module.exports = {
  run: [
    {
      // Clone repository if it doesn't exist
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/browser-use/web-ui app",
        ],
        when: "{{!exists('app')}}"
      }
    },
    {
      // Update repository if it already exists
      method: "shell.run",
      params: {
        path: "app",
        message: [
          "git pull"
        ],
        when: "{{exists('app')}}"
      }
    },
    {
      // Create F: drive directories for Windows
      method: "shell.run",
      params: {
        message: [
          "{{platform === 'win32' ? 'if not exist F:\\caddy mkdir F:\\caddy && if not exist F:\\browser-use-env mkdir F:\\browser-use-env && if not exist F:\\playwright-browsers mkdir F:\\playwright-browsers' : 'mkdir -p /opt/caddy'}}"
        ]
      }
    },
    {
      // Install Caddy to F: drive on Windows
      method: "shell.run",
      params: {
        message: [
          "{{platform === 'win32' ? 'powershell -Command \"if (-not (Test-Path F:\\caddy\\caddy.exe)) { Invoke-WebRequest -Uri \\\"https://caddyserver.com/api/download?os=windows&arch=amd64\\\" -OutFile \\\"F:\\caddy\\caddy.exe\\\" }\"' : 'conda install -y -c conda-forge caddy || (curl -L https://caddyserver.com/api/download?os=linux&arch=amd64 -o /opt/caddy/caddy && chmod +x /opt/caddy/caddy)'}}"
        ],
        when: "{{platform === 'win32' ? !exists('F:/caddy/caddy.exe') : true}}"
      }
    },
    {
      // Deactivate conda three times to ensure clean environment
      method: "shell.run",
      params: {
        path: "app",
        message: [
          "{{platform === 'win32' ? 'conda deactivate 2>nul & conda deactivate 2>nul & conda deactivate 2>nul' : 'conda deactivate 2>/dev/null; conda deactivate 2>/dev/null; conda deactivate 2>/dev/null'}}"
        ]
      }
    },
    {
      // Install Python dependencies in virtual environment on F: drive
      method: "shell.run",
      params: {
        venv: "{{envs.BROWSER_USE_VENV_PATH || (platform === 'win32' ? 'F:/browser-use-env' : 'env')}}",  // Use BROWSER_USE_VENV_PATH env var if set, F drive on Windows, else relative path 'env'
        venv_python: "3.11",
        path: "app",
        message: [
          "uv pip install -r requirements.txt"
        ]
      }
    },
    {
      // Deactivate conda three times before Playwright install
      method: "shell.run",
      params: {
        path: "app",
        message: [
          "{{platform === 'win32' ? 'conda deactivate 2>nul & conda deactivate 2>nul & conda deactivate 2>nul' : 'conda deactivate 2>/dev/null; conda deactivate 2>/dev/null; conda deactivate 2>/dev/null'}}"
        ]
      }
    },
    {
      // Install Playwright browsers to F: drive on Windows
      method: "shell.run",
      params: {
        venv: "{{envs.BROWSER_USE_VENV_PATH || (platform === 'win32' ? 'F:/browser-use-env' : 'env')}}",
        path: "app",
        env: {
          PLAYWRIGHT_BROWSERS_PATH: "{{platform === 'win32' ? 'F:/playwright-browsers' : envs.PLAYWRIGHT_BROWSERS_PATH || ''}}"
        },
        message: [
          "playwright install --with-deps chromium"
        ]
      }
    },
    {
      // Pull Ollama model (optional, can be skipped if not needed)
      method: "shell.run",
      params: {
        venv: "{{envs.BROWSER_USE_VENV_PATH || (platform === 'win32' ? 'F:/browser-use-env' : 'env')}}",
        path: "app",
        message: [
          "ollama pull qwen2.5:7b"
        ],
        when: "{{which('ollama')}}"
      }
    },
    {
      // Copy .env.example to .env if it doesn't exist
      method: "fs.copy",
      params: {
        src: "app/.env.example",
        dest: "app/.env",
        when: "{{!exists('app/.env')}}"
      }
    }
  ]
}
