// Telegram authentication utilities
window.TelegramAuth = {
  // Debug logger
  log: (message) => {
    console.log(`[TelegramAuth] ${message}`)
  },

  // Check if user is authenticated
  isAuthenticated: function () {
    // Check if we have Telegram initData in localStorage
    const initData = localStorage.getItem("telegramInitData")

    // For demo purposes, also check if we have a demo auth flag
    const demoAuth = localStorage.getItem("demoAuthenticated")

    const isAuth = !!initData || !!demoAuth
    this.log(`isAuthenticated check: ${isAuth} (initData: ${!!initData}, demoAuth: ${!!demoAuth})`)

    return isAuth
  },

  // Get user data
  getUser: function () {
    this.log("getUser called")
    // In a real app, you would parse the initData to get user info
    // For demo, return a placeholder user
    return {
      id: "12345",
      first_name: "Demo",
      username: "demo_user",
    }
  },

  // Verify authentication with backend
  verifyAuth: async function () {
    this.log("verifyAuth called")
    // In a real app, you would verify the initData with your backend
    // For demo, just return true if authenticated
    return Promise.resolve(this.isAuthenticated())
  },

  // Login function for demo purposes
  login: function () {
    this.log("login called")
    // In a real app, this would be handled by Telegram
    // For demo, just set a flag in localStorage
    localStorage.setItem("demoAuthenticated", "true")
    this.log("User logged in (demo mode)")
    return true
  },

  // Logout function
  logout: function () {
    this.log("logout called")
    localStorage.removeItem("telegramInitData")
    localStorage.removeItem("demoAuthenticated")

    // Clear any session storage flags
    sessionStorage.removeItem("authenticating")
    sessionStorage.removeItem("redirectTarget")
    sessionStorage.removeItem("redirectCount")

    this.log("User logged out")
  },

  // Get protected data from API
  getProtectedData: async function (endpoint) {
    this.log(`getProtectedData called for ${endpoint}`)
    // In a real app, you would make an authenticated request to your API
    // For demo, return mock data
    return Promise.resolve({
      success: true,
      data: {
        balance: 5000,
        verified: false,
      },
    })
  },

  // Verify user with backend - mock implementation
  verifyUser: async function (initData) {
    this.log("verifyUser called")
    // In a real app, you would verify with your backend
    // For demo, just return success
    return Promise.resolve({
      success: true,
      user: {
        id: "12345",
        first_name: "Demo",
        username: "demo_user",
      },
    })
  },
}
