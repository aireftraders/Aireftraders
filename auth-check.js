document.addEventListener("DOMContentLoaded", () => {
    // Initialize Telegram WebApp
    const tg = window.Telegram.WebApp
    if (tg) {
      tg.expand()
  
      // Store init data if available
      if (tg.initData) {
        localStorage.setItem("telegramInitData", tg.initData)
      }
    }
  
    // Check if user is coming from splash screen
    const fromSplash = sessionStorage.getItem("fromSplash")
  
    // If not from splash and not authenticated, redirect to splash screen
    if (!fromSplash && !window.TelegramAuth.isAuthenticated()) {
      sessionStorage.setItem("fromSplash", "true")
      window.location.href = "splash-screen.html"
      return
    }
  
    // Clear the fromSplash flag
    sessionStorage.removeItem("fromSplash")
  
    // Verify authentication with backend
    window.TelegramAuth.verifyAuth().then((isAuthenticated) => {
      if (!isAuthenticated) {
        console.warn("Authentication verification failed, redirecting to splash screen")
        window.location.href = "splash-screen.html"
      } else {
        // Update UI with user data
        const user = window.TelegramAuth.getUser()
        if (user) {
          // Update user display if elements exist
          const userChip = document.querySelector(".user-chip")
          if (userChip) {
            userChip.innerHTML = `
                          <span>👤 ${user.first_name || "User"}</span>
                          <span id="verifiedBadge">✅</span>
                      `
          }
        }
      }
    })
  })