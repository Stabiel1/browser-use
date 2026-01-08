module.exports = {
  run: [
    {
      // Open all social media platforms in browser
      method: "web.open",
      params: {
        uri: "https://accounts.google.com"
      }
    },
    {
      method: "web.open",
      params: {
        uri: "https://www.tiktok.com"
      }
    },
    {
      method: "web.open",
      params: {
        uri: "https://twitter.com"
      }
    },
    {
      method: "web.open",
      params: {
        uri: "https://x.com"
      }
    },
    {
      method: "web.open",
      params: {
        uri: "https://www.instagram.com"
      }
    }
  ]
}
