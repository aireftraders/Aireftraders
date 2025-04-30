// Telegram authentication utilities
window.TelegramAuth = {
  // Check if user is authenticated
  isAuthenticated: () => {
    // Check if we have Telegram initData in localStorage
    const initData = localStorage.getItem("telegramInitData")

    // For demo purposes, also check if we have a demo auth flag
    const demoAuth = localStorage.getItem("demoAuthenticated")

    return !!initData || !!demoAuth
  },

  // Get user data
  getUser: () => {
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
    // In a real app, you would verify the initData with your backend
    // For demo, just return true if authenticated
    return Promise.resolve(this.isAuthenticated())
  },

  // Login function for demo purposes
  login: () => {
    // In a real app, this would be handled by Telegram
    // For demo, just set a flag in localStorage
    localStorage.setItem("demoAuthenticated", "true")
    return true
  },

  // Logout function
  logout: () => {
    localStorage.removeItem("telegramInitData")
    localStorage.removeItem("demoAuthenticated")
  },

  // Get protected data from API
  getProtectedData: async (endpoint) => {
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
  verifyUser: async (initData) => {
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
