// Trading Page Connector for AI REF-TRADERS
// This script handles trading page specific functionality

class TradingConnector {
  constructor() {
    this.dataService = window.SharedDataService
    this.userData = null
    this.init()
  }

  async init() {
    console.log("Initializing Trading Connector")

    // Load user data
    this.userData = await this.dataService.loadUserData()

    // Update UI
    this.updateUI()

    // Set up event listeners
    this.setupEventListeners()

    // Check if trading is active
    this.checkTradingStatus()
  }

  updateUI() {
    if (!this.userData) return

    // Update balance display
    const balanceElement = document.getElementById("balanceDisplay")
    if (balanceElement) {
      balanceElement.textContent = this.userData.balance.toLocaleString()
    }

    // Update trading capital if exists
    const tradingCapitalElement = document.getElementById("tradingCapital")
    if (tradingCapitalElement) {
      tradingCapitalElement.textContent = this.userData.tradingCapital.toLocaleString()
    }

    // Update daily profit if exists
    const dailyProfitElement = document.getElementById("dailyProfit")
    if (dailyProfitElement) {
      dailyProfitElement.textContent = (this.userData.dailyProfit || 0).toLocaleString()
    }
  }

  setupEventListeners() {
    // Listen for trading actions
    const startTradingButton = document.getElementById("startTrading")
    if (startTradingButton) {
      startTradingButton.addEventListener("click", () => {
        this.startTrading()
      })
    }

    // Listen for back button
    const backButton = document.getElementById("backButton")
    if (backButton) {
      backButton.addEventListener("click", () => {
        this.dataService.navigateTo("index.html")
      })
    }
  }

  checkTradingStatus() {
    if (!this.userData) return

    const tradingStatusElement = document.getElementById("tradingStatus")
    const tradingControlsElement = document.getElementById("tradingControls")

    if (tradingStatusElement) {
      if (this.userData.adsWatched >= 20 && this.userData.referrals >= 6) {
        tradingStatusElement.innerHTML = '<span class="success">✅ Trading Available</span>'
        if (tradingControlsElement) {
          tradingControlsElement.style.display = "block"
        }
      } else {
        tradingStatusElement.innerHTML = '<span class="error">❌ Trading Unavailable</span>'
        tradingStatusElement.innerHTML += `<p>Complete ${6 - this.userData.referrals} more referrals and watch ${20 - this.userData.adsWatched} more ads to unlock trading.</p>`
        if (tradingControlsElement) {
          tradingControlsElement.style.display = "none"
        }
      }
    }
  }

  async startTrading() {
    if (!this.userData) return

    if (this.userData.adsWatched >= 20 && this.userData.referrals >= 6) {
      // Activate trading if not already active
      if (!this.userData.tradingActive) {
        this.userData.tradingActive = true
        this.userData.tradingCapital = 35000 // ₦5k signup + ₦30k from 6 referrals
        await this.dataService.saveUserData(this.userData)
      }

      // Simulate trading
      this.simulateTrading()
    } else {
      alert("You need to complete 6 referrals and watch 20 ads to unlock trading.")
    }
  }

  async simulateTrading() {
    if (!this.userData || !this.userData.tradingActive) return

    // Show loading state
    const tradingStatusElement = document.getElementById("tradingStatus")
    if (tradingStatusElement) {
      tradingStatusElement.innerHTML = '<span class="loading">⏳ Trading in progress...</span>'
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Calculate random profit (20-50% of capital)
    const profitPercentage = 20 + Math.random() * 30 // 20-50%
    const totalProfit = Math.floor(this.userData.tradingCapital * (profitPercentage / 100))

    // Distribute profits
    const userShare = Math.floor(totalProfit * 0.7) // 70% to user
    const companyShare = Math.floor(totalProfit * 0.25) // 25% to company
    const systemFee = totalProfit - userShare - companyShare // 5% system fee

    // Update user data
    this.userData.dailyProfit = userShare
    this.userData.totalProfit = (this.userData.totalProfit || 0) + userShare
    this.userData.withdrawableProfit = (this.userData.withdrawableProfit || 0) + userShare
    this.userData.balance += userShare

    // Save to database
    await this.dataService.saveUserData(this.userData)

    // Update UI
    this.updateUI()

    // Show success message
    this.showTradingResults(userShare, profitPercentage)

    // Update trading status
    if (tradingStatusElement) {
      tradingStatusElement.innerHTML = '<span class="success">✅ Trading Completed</span>'
    }
  }

  showTradingResults(profit, percentage) {
    alert(
      `Trading completed successfully!\n\nProfit: ₦${profit.toLocaleString()}\nReturn: ${percentage.toFixed(1)}%\n\nYour share (70%): ₦${profit.toLocaleString()}`,
    )
  }
}

// Initialize the trading connector when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Wait for SharedDataService to be available
  const checkDependencies = () => {
    if (window.SharedDataService) {
      window.TradingConnector = new TradingConnector()
    } else {
      setTimeout(checkDependencies, 50)
    }
  }

  checkDependencies()
})
