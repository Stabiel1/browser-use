module.exports = {
  run: [{
    method: "fs.rm",
    params: {
      path: "app"
    }
  }, {
    method: "fs.rm",
    params: {
      path: "{{envs.BROWSER_USE_VENV_PATH || (platform === 'win32' ? 'F:/browser-use-env' : 'env')}}"
    }
  }, {
    // Clean up Playwright browsers from F: drive on Windows
    method: "fs.rm",
    params: {
      path: "{{platform === 'win32' ? (envs.PLAYWRIGHT_BROWSERS_PATH || 'F:/playwright-browsers') : ''}}",
      when: "{{platform === 'win32'}}"
    }
  }]
}
