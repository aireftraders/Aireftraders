document.addEventListener("DOMContentLoaded", () => {
  console.log("Auth check running...")

  // Initialize Telegram WebApp
  const tg = window.Telegram?.WebApp
  if (tg) {
    console.log("Telegram WebApp found, expanding...")
    tg.expand()

    // Store init data if available
    if (tg.initData) {
      console.log("Storing Telegram initData")
      localStorage.setItem("telegramInitData", tg.initData)
    } else {
      console.log("No Telegram initData available")
    }
  } else {
    console.log("Telegram WebApp not found, running in standalone mode")
  }

  // Get current page
  const currentPath = window.location.pathname
  const isOnSplashScreen = currentPath.includes("splash-screen.html")
  const isOnDashboard = currentPath.includes("index.html") || currentPath === "/" || currentPath.endsWith("/")

  console.log("Current path:", currentPath)
  console.log("isOnSplashScreen:", isOnSplashScreen)
  console.log("isOnDashboard:", isOnDashboard)

  // Check if user is authenticated
  const isAuthenticated = window.TelegramAuth.isAuthenticated()
  console.log("isAuthenticated:", isAuthenticated)

  // Check if we're in the middle of authentication
  const isAuthenticating = sessionStorage.getItem("authenticating") === "true"
  console.log("isAuthenticating:", isAuthenticating)

  // Clear authenticating flag if we've been redirected
  if (isAuthenticating && sessionStorage.getItem("redirectTarget") === currentPath) {
    console.log("Authentication process completed, clearing flags")
    sessionStorage.removeItem("authenticating")
    sessionStorage.removeItem("redirectTarget")
    return
  }

  // Prevent redirect loops
  const redirectCount = Number.parseInt(sessionStorage.getItem("redirectCount") || "0")
  console.log("Current redirect count:", redirectCount)

  if (redirectCount > 3) {
    console.error("Too many redirects detected, stopping redirect chain")
    sessionStorage.removeItem("redirectCount")
    return
  }

  // Redirect logic
  if (isAuthenticated) {
    // User is authenticated
    console.log("User is authenticated")
    if (isOnSplashScreen) {
      // If on splash screen, redirect to dashboard
      console.log("Redirecting from splash to dashboard")
      sessionStorage.setItem("authenticating", "true")
      sessionStorage.setItem("redirectTarget", "/index.html")
      sessionStorage.setItem("redirectCount", (redirectCount + 1).toString())
      window.location.href = "index.html"
    }
  } else {
    // User is not authenticated
    console.log("User is NOT authenticated")
    if (isOnDashboard) {
      // If on dashboard, redirect to splash screen
      console.log("Redirecting from dashboard to splash")
      sessionStorage.setItem("authenticating", "true")
      sessionStorage.setItem("redirectTarget", "/splash-screen.html")
      sessionStorage.setItem("redirectCount", (redirectCount + 1).toString())
      window.location.href = "splash-screen.html"
    }
  }
})
