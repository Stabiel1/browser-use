module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        venv: "{{envs.BROWSER_USE_VENV_PATH || (platform === 'win32' ? 'F:/browser-use-env' : 'env')}}",  // Use BROWSER_USE_VENV_PATH env var if set, F drive on Windows, else relative path 'env'
        env: {
          // Use F: drive for Playwright browsers on Windows to save space
          PLAYWRIGHT_BROWSERS_PATH: "{{platform === 'win32' ? (envs.PLAYWRIGHT_BROWSERS_PATH || 'F:/playwright-browsers') : envs.PLAYWRIGHT_BROWSERS_PATH || ''}}"
        },
        path: "app",                // Edit this to customize the path to start the shell from
        message: [
          "python webui.py --ip 0.0.0.0 --port {{port}}"
        ],
        on: [{
          // The regular expression pattern to monitor.
          // Whenever each "event" pattern occurs in the shell terminal, the shell will return,
          // and the script will go onto the next step.
          // The regular expression match object will be passed on to the next step as `input.event`
          // Useful for capturing the URL at which the server is running (in case the server prints some message about where the server is running)
          // This pattern captures http:// URLs including IP addresses, ports, and query parameters
          // Matches: http://127.0.0.1:42000, http://192.168.178.21:42000, http://localhost:42000/?session=...
          "event": "/(http:\\/\\/[^\\s\\n\\r]+)/", 

          // Use "done": true to move to the next step while keeping the shell alive.
          // Use "kill": true to move to the next step after killing the shell.
          "done": true
        }]
      }
    },
    {
      // This step sets the local variable 'url'.
      // This local variable will be used in pinokio.js to display the "Open WebUI" tab when the value is set.
      method: "local.set",
      params: {
        // the input.event is the regular expression match object from the previous step
        // In this example, since the pattern was "/(http:\\/\\/[^\\s\\n\\r]+)/", input.event[1] will include the exact http url match captured by the parenthesis (supports both IP addresses, hostnames, and query parameters).
        // Therefore setting the local variable 'url'
        url: "{{input.event[1]}}"
      }
    }
  ]
}
