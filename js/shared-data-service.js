// In shared-data-service.js
// Add this property to the SharedDataService class

constructor() {
  this.db = new Dexie("AI_REF_TRADERS_DB")
  this.initDatabase()
  this.initTelegramSync()
  
  // Add your backend API URL here
  this.apiBaseUrl = "https://v0-paystack-backend-setup.vercel.app/"
}

// Then use it for API calls
async verifyAccount(accountNumber, bankCode) {
  try {
    const response = await fetch(`${this.apiBaseUrl}/verify-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accountNumber, bankCode }),
    })
    return await response.json()
  } catch (error) {
    console.error('Error verifying account:', error)
    return { status: false, message: 'Failed to verify account' }
  }
}
