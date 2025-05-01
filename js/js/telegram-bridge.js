// Telegram Bridge for AI REF-TRADERS
// This file handles Telegram WebApp specific functionality and ensures data consistency

class TelegramBridge {
  constructor() {
    this.tg = window.Telegram?.WebApp
    this.dataService = window.SharedDataService
    this.initBridge()
  }

  initBridge() {
    if (!this.tg) {
      console.log("Telegram WebApp not available")
      return
    }

    console.log("Initializing Telegram Bridge")

    // Expand the WebApp
    this.tg.expand()

    // Set up event listeners for Telegram WebApp events
    this.tg.onEvent("viewportChanged", this.handleViewportChanged.bind(this))

    // Handle back button if available
    if (this.tg.BackButton) {
      this.tg.BackButton.onClick(this.handleBackButton.bind(this))

      // Show back button if we're not on the main page
      if (
        window.location.pathname !== "/index.html" &&
        window.location.pathname !== "/" &&
        !window.location.pathname.endsWith("/")
      ) {
        this.tg.BackButton.show()
      } else {
        this.tg.BackButton.hide()
      }
    }

    // Handle main button if available
    if (this.tg.MainButton) {
      // Configure based on current page
      this.configureMainButton()
    }

    // Set up haptic feedback for buttons
    this.setupHapticFeedback()
  }

  handleViewportChanged(event) {
    console.log("Telegram viewport changed", event)
  }

  handleBackButton() {
    // Get the previous page from sync data
    const previousPage = this.dataService.getSyncData("previousPage") || "/index.html"
    console.log("Navigating back to:", previousPage)

    // Navigate back
    window.location.href = previousPage
  }

  configureMainButton() {
    // Configure main button based on current page
    const currentPath = window.location.pathname

    if (currentPath.includes("trading.html")) {
      this.tg.MainButton.setText("Start Trading")
      this.tg.MainButton.show()
      this.tg.MainButton.onClick(() => {
        // Handle trading button click
        console.log("Main button clicked on trading page")
        // Your trading logic here
      })
    } else if (currentPath.includes("game.html")) {
      this.tg.MainButton.setText("Play Game")
      this.tg.MainButton.show()
      this.tg.MainButton.onClick(() => {
        // Handle game button click
        console.log("Main button clicked on game page")
        // Your game logic here
      })
    } else if (currentPath.includes("ads.html")) {
      this.tg.MainButton.setText("Watch Ads")
      this.tg.MainButton.show()
      this.tg.MainButton.onClick(() => {
        // Handle ads button click
        console.log("Main button clicked on ads page")
        // Your ads logic here
      })
    } else {
      // Hide on main page
      this.tg.MainButton.hide()
    }
  }

  setupHapticFeedback() {
    // Add haptic feedback to buttons for better mobile experience
    if (this.tg.HapticFeedback) {
      document.querySelectorAll("button").forEach((button) => {
        button.addEventListener("click", () => {
          this.tg.HapticFeedback.impactOccurred("light")
        })
      })
    }
  }

  // Send data to Telegram WebApp
  sendData(data) {
    if (this.tg) {
      this.tg.sendData(JSON.stringify(data))
    }
  }

  // Show popup in Telegram WebApp
  showPopup(title, message, buttons = []) {
    if (this.tg && this.tg.showPopup) {
      this.tg.showPopup({
        title: title,
        message: message,
        buttons: buttons,
      })
    } else {
      alert(`${title}\n\n${message}`)
    }
  }

  // Show alert in Telegram WebApp
  showAlert(message) {
    if (this.tg && this.tg.showAlert) {
      this.tg.showAlert(message)
    } else {
      alert(message)
    }
  }
}

// Create and export a singleton instance
window.TelegramBridge = new TelegramBridge()
