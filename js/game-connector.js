// Game Page Connector for AI REF-TRADERS
// This script handles game page specific functionality

class GameConnector {
  constructor() {
    this.dataService = window.SharedDataService
    this.userData = null
    this.init()
  }

  async init() {
    console.log("Initializing Game Connector")

    // Load user data
    this.userData = await this.dataService.loadUserData()

    // Update UI
    this.updateUI()

    // Set up event listeners
    this.setupEventListeners()
  }

  updateUI() {
    if (!this.userData) return

    // Update balance display
    const balanceElement = document.getElementById("balanceDisplay")
    if (balanceElement) {
      balanceElement.textContent = this.userData.balance.toLocaleString()
    }

    // Update game earnings if exists
    const gameEarningsElement = document.getElementById("gameEarnings")
    if (gameEarningsElement) {
      gameEarningsElement.textContent = this.userData.gameEarnings.toLocaleString()
    }
  }

  setupEventListeners() {
    // Listen for game completion
    document.addEventListener("gameCompleted", async (event) => {
      const earnings = event.detail?.earnings || 0
      if (earnings > 0) {
        await this.addGameEarnings(earnings)
      }
    })

    // Listen for back button
    const backButton = document.getElementById("backButton")
    if (backButton) {
      backButton.addEventListener("click", () => {
        this.dataService.navigateTo("index.html")
      })
    }
  }

  async addGameEarnings(amount) {
    if (!this.userData) return

    // Add game earnings
    this.userData.balance += amount
    this.userData.gameEarnings = (this.userData.gameEarnings || 0) + amount

    // Save to database
    await this.dataService.saveUserData(this.userData)

    // Update UI
    this.updateUI()

    // Broadcast the update to other pages
    this.dataService.broadcastUpdate("gameEarningsUpdate", {
      amount: amount,
    })

    // Show success message
    this.showSuccessMessage(amount)
  }

  showSuccessMessage(amount) {
    alert(`Congratulations! You earned ₦${amount.toLocaleString()} from the game!`)
  }
}

// Initialize the game connector when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Wait for SharedDataService to be available
  const checkDependencies = () => {
    if (window.SharedDataService) {
      window.GameConnector = new GameConnector()
    } else {
      setTimeout(checkDependencies, 50)
    }
  }

  checkDependencies()
})
