// Initialize the application
async function initializeApp() {
    // Check if Telegram WebApp is available
    const tg = window.Telegram?.WebApp
    if (!tg) {
      console.warn("Telegram WebApp is not available. Running in standalone mode.")
    }
  
    // Load user data
    await loadUserData()
  
    // Set up theme toggle
    setupThemeToggle()
  
    // Apply global settings
    applyGlobalSettings()
  
    // Initialize other components
    initializeComponents()
  
    console.log("Application initialized successfully")
  }
  
  // Load user data from storage or API
  async function loadUserData() {
    try {
      // Try to get user data from Telegram Auth
      const telegramUser = window.TelegramAuth.getUser()
  
      if (telegramUser) {
        console.log("User authenticated:", telegramUser.first_name)
  
        // You can fetch additional user data from your API here
        const userData = await window.TelegramAuth.getProtectedData("/api/telegram/user-data")
  
        if (userData && userData.success) {
          // Update UI with user data
          updateUserInterface(userData.data)
        }
      } else {
        console.log("User not authenticated")
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }
  
  // Update UI with user data
  function updateUserInterface(userData) {
    // Update balance display
    const balanceDisplay = document.getElementById("balanceDisplay")
    if (balanceDisplay && userData.balance) {
      balanceDisplay.textContent = userData.balance.toLocaleString()
    }
  
    // Update verification badge
    const verifiedBadge = document.getElementById("verifiedBadge")
    if (verifiedBadge) {
      verifiedBadge.textContent = userData.verified ? "✅" : "❌"
    }
  
    // Update other UI elements as needed
  }
  
  // Setup theme toggle functionality
  function setupThemeToggle() {
    const themeToggle = document.getElementById("themeToggle")
    if (!themeToggle) return
  
    const themeIcon = document.getElementById("themeIcon")
    const themeText = document.getElementById("themeText")
  
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  
    // Set initial theme
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme)
    } else if (prefersDark) {
      document.documentElement.setAttribute("data-theme", "dark")
    }
  
    // Update toggle button based on current theme
    updateThemeToggle()
  
    // Add event listener for theme toggle
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme")
      const newTheme = currentTheme === "dark" ? "light" : "dark"
  
      // Set the new theme
      document.documentElement.setAttribute("data-theme", newTheme)
      localStorage.setItem("theme", newTheme)
  
      // Update toggle button
      updateThemeToggle()
    })
  
    function updateThemeToggle() {
      const currentTheme = document.documentElement.getAttribute("data-theme")
      if (themeIcon && themeText) {
        if (currentTheme === "dark") {
          themeIcon.textContent = "☀️"
          themeText.textContent = "Light Mode"
        } else {
          themeIcon.textContent = "🌙"
          themeText.textContent = "Dark Mode"
        }
      }
    }
  }
  
  // Apply global settings (theme, language, etc.)
  function applyGlobalSettings() {
    // Apply theme
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const themeToApply = savedTheme || (prefersDark ? "dark" : "light")
    document.documentElement.setAttribute("data-theme", themeToApply)
  
    // Apply language
    const savedLanguage = localStorage.getItem("selectedLanguage") || "en"
    const languageDropdown = document.getElementById("languageDropdown")
    if (languageDropdown) {
      languageDropdown.value = savedLanguage
    }
  
    // Declare updateLanguage before using it (assuming it's defined elsewhere or will be)
    let updateLanguage
  
    // Call updateLanguage if it exists
    if (typeof updateLanguage === "function") {
      updateLanguage(savedLanguage)
    }
  }
  
  // Initialize components (testimonials, referral system, etc.)
  function initializeComponents() {
    // Declare testimonial functions before using them (assuming they're defined elsewhere or will be)
    let showTestimonial
    let startTestimonialRotation
    let setupTestimonialDots
    let rotateReferralText
  
    // Initialize testimonial rotation if functions exist
    if (typeof showTestimonial === "function") {
      showTestimonial(1)
    }
  
    if (typeof startTestimonialRotation === "function") {
      startTestimonialRotation()
    }
  
    if (typeof setupTestimonialDots === "function") {
      setupTestimonialDots()
    }
  
    // Start rotating referral texts if function exists
    if (typeof rotateReferralText === "function") {
      rotateReferralText()
    }
  
    // Set up event listeners
    setupEventListeners()
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Add event listeners for buttons and other interactive elements
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", function () {
        document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"))
        this.classList.add("active")
  
        document.querySelectorAll(".tab-content").forEach((content) => {
          content.classList.remove("active")
        })
  
        const tabName = this.dataset.tab
        const tabContent = document.getElementById(tabName + "Tab")
        if (tabContent) {
          tabContent.classList.add("active")
        }
      })
    })
  
    // Add logout functionality if needed
    const logoutBtn = document.getElementById("logoutBtn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        window.TelegramAuth.logout()
        window.location.href = "splash-screen.html"
      })
    }
  }
  
  // Initialize the app when the DOM is loaded
  document.addEventListener('DOMContentLoaded', async function () {
    // Check if Telegram WebApp is available
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();

        // Verify authentication
        try {
            const isAuthenticated = await TelegramAuth.verifyAuth();
            if (!isAuthenticated) {
                console.error('User not authenticated. Redirecting to splash screen.');
                window.location.href = 'splash-screen.html';
            } else {
                console.log('User authenticated. Proceeding to app.');
                // Initialize app components
                initializeApp();
            }
        } catch (error) {
            console.error('Error during authentication check:', error);
            window.location.href = 'splash-screen.html';
        }
    } else {
        console.error('Telegram WebApp not available. Redirecting to splash screen.');
        window.location.href = 'splash-screen.html';
    }
});
