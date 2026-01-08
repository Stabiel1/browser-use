module.exports = {
  run: [
    {
      // Stop the current server if it's running
      method: "script.stop",
      params: {
        uri: "start.js"
      },
      when: "{{running('start.js')}}"
    },
    {
      // Wait a moment for the server to fully stop
      method: "shell.run",
      params: {
        message: "{{platform === 'win32' ? 'timeout /t 2 /nobreak >nul' : 'sleep 2'}}"
      }
    },
    {
      // Start the server again
      method: "script.start",
      params: {
        uri: "start.js"
      }
    }
  ]
}
