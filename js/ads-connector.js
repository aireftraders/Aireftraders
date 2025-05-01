// Ads Page Connector for AI REF-TRADERS
// This script handles ads page specific functionality

class AdsConnector {
  constructor() {
    this.dataService = window.SharedDataService
    this.userData = null
    this.init()
  }

  async init() {
    console.log("Initializing Ads Connector")

    // Load user data
    this.userData = await this.dataService.loadUserData()

    // Update UI
    this.updateUI()

    // Set up event listeners
    this.setupEventListeners()
  }

  updateUI() {
    if (!this.userData) return

    // Update ads watched count
    const adsWatchedElement = document.getElementById("adsWatched")
    if (adsWatchedElement) {
      adsWatchedElement.textContent = this.userData.adsWatched
    }

    // Update total ads watched
    const totalAdsWatchedElement = document.getElementById("totalAdsWatched")
    if (totalAdsWatchedElement) {
      totalAdsWatchedElement.textContent = this.userData.totalAdsWatched
    }

    // Update progress bar if exists
    const progressBar = document.getElementById("adsProgress")
    if (progressBar) {
      progressBar.value = this.userData.adsWatched
      progressBar.max = 20
    }
  }

  setupEventListeners() {
    // Listen for ad watch completion
    document.addEventListener("adWatched", async () => {
      await this.incrementAdCount()
    })

    // Listen for back button
    const backButton = document.getElementById("backButton")
    if (backButton) {
      backButton.addEventListener("click", () => {
        this.dataService.navigateTo("index.html")
      })
    }
  }

  async incrementAdCount() {
    if (!this.userData) return

    // Increment ads watched count
    this.userData.adsWatched = Math.min((this.userData.adsWatched || 0) + 1, 20)
    this.userData.totalAdsWatched = (this.userData.totalAdsWatched || 0) + 1
    this.userData.lastAdWatchTime = new Date().getTime()

    // Save to database
    await this.dataService.saveUserData(this.userData)

    // Update UI
    this.updateUI()

    // Broadcast the update to other pages
    this.dataService.broadcastUpdate("adCountUpdate", {
      adsWatched: this.userData.adsWatched,
      totalAdsWatched: this.userData.totalAdsWatched,
    })

    // Check if all ads are watched
    if (this.userData.adsWatched >= 20) {
      // Show completion message
      this.showCompletionMessage()
    }
  }

  showCompletionMessage() {
    const completionMessage = document.getElementById("completionMessage")
    if (completionMessage) {
      completionMessage.style.display = "block"
    }

    // Show alert
    alert("Congratulations! You have watched all 20 ads. You can now access games and trading features.")
  }
}

// Initialize the ads connector when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Wait for SharedDataService to be available
  const checkDependencies = () => {
    if (window.SharedDataService) {
      window.AdsConnector = new AdsConnector()
    } else {
      setTimeout(checkDependencies, 50)
    }
  }

  checkDependencies()
})
