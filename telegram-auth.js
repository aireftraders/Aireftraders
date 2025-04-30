// Telegram Authentication Helper Functions
const TelegramAuth = {
    // Get stored Telegram init data
    getInitData: () => localStorage.getItem("telegramInitData") || "",
  
    // Get stored Telegram user data
    getUser: () => {
      const userData = localStorage.getItem("telegramUser")
      return userData ? JSON.parse(userData) : null
    },
  
    // Check if user is authenticated
    isAuthenticated: function () {
      return !!this.getUser()
    },
  
    // Verify authentication with backend
    verifyAuth: async function () {
      const initData = this.getInitData()
      if (!initData) return false
  
      try {
        const response = await fetch("/api/telegram/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            initData: initData,
          }),
        })
  
        const data = await response.json()
  
        if (data.success) {
          localStorage.setItem("telegramUser", JSON.stringify(data.user))
          return true
        } else {
          console.error("Telegram authentication failed:", data.message)
          return false
        }
      } catch (error) {
        console.error("Error verifying Telegram authentication:", error)
        return false
      }
    },
  
    // Get protected API data
    getProtectedData: async function (endpoint) {
      const initData = this.getInitData()
      if (!initData) return null
  
      try {
        const response = await fetch(endpoint, {
          headers: {
            "x-telegram-init-data": initData,
          },
        })
  
        return await response.json()
      } catch (error) {
        console.error(`Error fetching protected data from ${endpoint}:`, error)
        return null
      }
    },
  
    // Redirect to splash screen if not authenticated
    requireAuth: function () {
      if (!this.isAuthenticated()) {
        window.location.href = "splash-screen.html"
        return false
      }
      return true
    },
  }
  
  // Export for use in other scripts
  window.TelegramAuth = TelegramAuth