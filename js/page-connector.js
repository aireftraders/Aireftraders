// Page Connector for AI REF-TRADERS
// This script connects each page to the shared data service and handles page-specific logic

class PageConnector {
  constructor() {
    this.dataService = window.SharedDataService
    this.telegramBridge = window.TelegramBridge
    this.userData = null
    this.pageType = this.detectPageType()
    this.initPage()
  }

  // Detect the current page type
  detectPageType() {
    const path = window.location.pathname
    if (path.includes("trading.html")) return "trading"
    if (path.includes("game.html")) return "game"
    if (path.includes("ads.html")) return "ads"
    return "main" // index.html or root
  }

  // Initialize the page
  async initPage() {
    console.log(`Initializing ${this.pageType} page`)

    // Check for initial sync
    this.userData = await this.dataService.checkInitialSync()

    // Set up event listeners for updates
    this.setupEventListeners()

    // Initialize page-specific functionality
    this.initPageSpecific()

    // Update UI with current data
    this.updateUI()

    console.log(`${this.pageType} page initialized`)
  }

  // Set up event listeners
  setupEventListeners() {
    // Listen for updates from other pages
    window.addEventListener("aireftraders_update", (event) => {
      console.log("Received update event:", event.detail.type)
      this.handleUpdate(event.detail)
    })

    // Listen for messages from iframes or popups
    window.addEventListener("message", (event) => {
      if (event.data && event.data.source === "aireftraders") {
        console.log("Received message:", event.data.type)
        this.handleUpdate(event.data)
      }
    })

    // Set up page-specific event listeners
    this.setupPageSpecificListeners()
  }

  // Handle updates from other pages
  handleUpdate(update) {
    if (update.type === "userData") {
      this.userData = update.data
      this.updateUI()
    } else if (update.type === "fieldUpdate") {
      if (this.userData) {
        this.userData[update.data.field] = update.data.value
        this.updateUI()
      }
    } else if (update.type === "adCountUpdate") {
      this.handleAdCountUpdate(update.data)
    } else if (update.type === "gameEarningsUpdate") {
      this.handleGameEarningsUpdate(update.data)
    } else if (update.type === "balanceUpdate") {
      this.handleBalanceUpdate(update.data)
    }
  }

  // Initialize page-specific functionality
  initPageSpecific() {
    switch (this.pageType) {
      case "trading":
        this.initTradingPage()
        break
      case "game":
        this.initGamePage()
        break
      case "ads":
        this.initAdsPage()
        break
      case "main":
      default:
        this.initMainPage()
        break
    }
  }

  // Set up page-specific event listeners
  setupPageSpecificListeners() {
    switch (this.pageType) {
      case "trading":
        // Trading page specific listeners
        break
      case "game":
        // Game page specific listeners
        break
      case "ads":
        // Ads page specific listeners
        break
      case "main":
      default:
        // Main page specific listeners
        this.setupMainPageListeners()
        break
    }
  }

  // Update UI with current data
  updateUI() {
    if (!this.userData) return

    // Common UI updates for all pages
    const balanceDisplay = document.getElementById("balanceDisplay")
    if (balanceDisplay) {
      balanceDisplay.textContent = this.userData.balance.toLocaleString()
    }

    // Page-specific UI updates
    switch (this.pageType) {
      case "trading":
        this.updateTradingUI()
        break
      case "game":
        this.updateGameUI()
        break
      case "ads":
        this.updateAdsUI()
        break
      case "main":
      default:
        this.updateMainUI()
        break
    }
  }

  // Initialize main page (index.html)
  initMainPage() {
    console.log("Initializing main page")
    // Main page specific initialization
  }

  // Initialize trading page
  initTradingPage() {
    console.log("Initializing trading page")
    // Trading page specific initialization
  }

  // Initialize game page
  initGamePage() {
    console.log("Initializing game page")
    // Game page specific initialization
  }

  // Initialize ads page
  initAdsPage() {
    console.log("Initializing ads page")
    // Ads page specific initialization
  }

  // Update main page UI
  updateMainUI() {
    if (!this.userData) return

    // Update referrals
    const currentReferrals = document.getElementById("currentReferrals")
    const completedReferrals = document.getElementById("completedReferrals")
    const referralProgress = document.getElementById("referralProgress")
    const referralEarnings = document.getElementById("referralEarnings")

    if (currentReferrals) currentReferrals.textContent = this.userData.referrals
    if (completedReferrals) completedReferrals.textContent = this.userData.referrals
    if (referralProgress) referralProgress.value = this.userData.referrals
    if (referralEarnings) referralEarnings.textContent = (this.userData.referrals * 5000).toLocaleString()

    // Update ads watched
    const adsWatchedCount = document.getElementById("adsWatchedCount")
    const totalAdsWatched = document.getElementById("totalAdsWatched")
    const adsProgress = document.getElementById("adsProgress")

    if (adsWatchedCount) adsWatchedCount.textContent = this.userData.adsWatched
    if (totalAdsWatched) totalAdsWatched.textContent = this.userData.totalAdsWatched
    if (adsProgress) adsProgress.value = this.userData.adsWatched

    // Update trading status
    const tradingStatus = document.getElementById("tradingStatus")
    if (tradingStatus) {
      if (this.userData.adsWatched >= 20 && this.userData.referrals >= 6) {
        tradingStatus.innerHTML =
          "AI Bot: <b>Active</b> (24h Profit: ₦" + (this.userData.dailyProfit || 0).toLocaleString() + ")"
      } else {
        tradingStatus.innerHTML = "AI Bot: <b>Inactive</b> (Complete 6 referrals and 20 ads)"
      }
    }

    // Update verification badge
    const verifiedBadge = document.getElementById("verifiedBadge")
    if (verifiedBadge) {
      verifiedBadge.textContent = this.userData.verified ? "✅" : "❌"
    }

    // Update payment circle
    const paidUsers = document.getElementById("paidUsers")
    const paymentCircleProgress = document.getElementById("paymentCircleProgress")

    if (paidUsers) paidUsers.textContent = (this.userData.paymentCircle?.current || 0).toLocaleString()
    if (paymentCircleProgress) paymentCircleProgress.value = this.userData.paymentCircle?.current || 0
  }

  // Update trading page UI
  updateTradingUI() {
    // Trading page specific UI updates
  }

  // Update game page UI
  updateGameUI() {
    // Game page specific UI updates
  }

  // Update ads page UI
  updateAdsUI() {
    // Ads page specific UI updates
  }

  // Set up main page listeners
  setupMainPageListeners() {
    // Trading button
    const tradingButton = document.getElementById("tradingButton")
    if (tradingButton) {
      tradingButton.addEventListener("click", () => {
        this.dataService.navigateTo("trading.html")
      })
    }

    // Games button
    const gamesButton = document.getElementById("gamesButton")
    if (gamesButton) {
      gamesButton.addEventListener("click", () => {
        // Check if user has watched ads within the last 60 minutes
        const lastAdWatchTime = this.userData.lastAdWatchTime
        const currentTime = new Date().getTime()
        const sixtyMinutesInMs = 60 * 60 * 1000

        if (
          lastAdWatchTime &&
          currentTime - lastAdWatchTime < sixtyMinutesInMs &&
          (this.userData.adsWatched || 0) >= 20
        ) {
          // User has watched ads within 60 minutes - allow access to games
          this.dataService.navigateTo("game.html")
        } else {
          // User hasn't watched ads or it's been more than 60 minutes - redirect to ads
          this.dataService.navigateTo("ads.html")
        }
      })
    }
  }

  // Handle ad count update
  async handleAdCountUpdate(data) {
    if (!this.userData) return

    // Update user data
    this.userData.adsWatched = data.adsWatched
    this.userData.totalAdsWatched = data.totalAdsWatched
    this.userData.lastAdWatchTime = new Date().getTime()

    // Save to database
    await this.dataService.saveUserData(this.userData)

    // Update UI
    this.updateUI()

    // Check if trading should be activated
    if (this.userData.adsWatched >= 20 && this.userData.referrals >= 6 && !this.userData.tradingActive) {
      this.userData.tradingActive = true
      this.userData.tradingCapital = 35000 // ₦5k signup + ₦30k from 6 referrals
      await this.dataService.saveUserData(this.userData)
    }
  }

  // Handle game earnings update
  async handleGameEarningsUpdate(data) {
    if (!this.userData) return

    // Update balance with game earnings
    this.userData.balance += data.amount
    this.userData.gameEarnings += data.amount

    // Save to database
    await this.dataService.saveUserData(this.userData)

    // Update UI
    this.updateUI()

    // Show notification if on main page
    if (this.pageType === "main") {
      this.showNotification(`🎮 You earned ₦${data.amount} from games!`)
    }
  }

  // Handle balance update
  async handleBalanceUpdate(data) {
    if (!this.userData) return

    // Update balance
    this.userData.balance = data.balance

    // Save to database
    await this.dataService.saveUserData(this.userData)

    // Update UI
    this.updateUI()
  }

  // Show notification
  showNotification(message) {
    const notification = document.getElementById("notification")
    const notificationText = document.getElementById("notificationText")

    if (!notification || !notificationText) return

    notificationText.textContent = message
    notification.classList.add("show")
    setTimeout(() => {
      notification.classList.remove("show")
    }, 3000)
  }
}

// Initialize the page connector when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Wait for SharedDataService and TelegramBridge to be available
  const checkDependencies = () => {
    if (window.SharedDataService && window.TelegramBridge) {
      window.PageConnector = new PageConnector()
    } else {
      setTimeout(checkDependencies, 50)
    }
  }

  checkDependencies()
})
