document.addEventListener("DOMContentLoaded", () => {
  // Initialize Telegram WebApp
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.expand()

    // Store init data if available
    if (tg.initData) {
      localStorage.setItem("telegramInitData", tg.initData)
    }
  }

  // Get current page
  const isOnSplashScreen = window.location.pathname.includes("splash-screen.html")
  const isOnDashboard =
    window.location.pathname.includes("index.html") ||
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/")

  // Check if user is authenticated
  const isAuthenticated = window.TelegramAuth.isAuthenticated()

  // Set a flag to prevent redirect loops
  const redirectInProgress = sessionStorage.getItem("redirectInProgress")

  if (redirectInProgress) {
    // Clear the flag
    sessionStorage.removeItem("redirectInProgress")
    // Don't perform any redirects this time
    return
  }

  // Redirect logic
  if (isAuthenticated) {
    // User is authenticated
    if (isOnSplashScreen) {
      // If on splash screen, redirect to dashboard
      sessionStorage.setItem("redirectInProgress", "true")
      window.location.href = "index.html"
    }
  } else {
    // User is not authenticated
    if (isOnDashboard) {
      // If on dashboard, redirect to splash screen
      sessionStorage.setItem("redirectInProgress", "true")
      window.location.href = "splash-screen.html"
    }
  }
})
