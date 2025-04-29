// Paystack Backend Integration

// Backend URL - update this to your production URL
const BACKEND_URL = "https://v0-paystack-backend-setup.vercel.app"

/**
 * Verify bank account details
 * @param {string} accountNumber - 10-digit account number
 * @param {string} bankCode - Bank code from Paystack
 * @returns {Promise<Object>} - Account verification response
 */
async function verifyAccount(accountNumber, bankCode) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/verify-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountNumber, bankCode }),
    })

    return await response.json()
  } catch (error) {
    console.error("Error verifying account:", error)
    return {
      status: false,
      message: "Failed to connect to verification service. Please check your internet connection and try again.",
    }
  }
}

/**
 * Fetch list of banks from Paystack
 * @returns {Promise<Object>} - Banks list response
 */
async function fetchBanks() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/banks`)
    return await response.json()
  } catch (error) {
    console.error("Error fetching banks:", error)
    return {
      status: false,
      message: "Failed to fetch banks list. Please check your internet connection and try again.",
    }
  }
}

/**
 * Initialize payment with Paystack
 * @param {string} email - User email
 * @param {string} accountNumber - Account number
 * @param {string} bankCode - Bank code
 * @param {string} accountName - Account name
 * @returns {Promise<Object>} - Payment initialization response
 */
async function initiatePayment(email, accountNumber, bankCode, accountName) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/initialize-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        accountNumber,
        bankCode,
        accountName,
      }),
    })

    return await response.json()
  } catch (error) {
    console.error("Error initializing payment:", error)
    return {
      status: false,
      message: "Failed to initialize payment. Please check your internet connection and try again.",
    }
  }
}

/**
 * Verify payment status
 * @param {string} reference - Payment reference
 * @returns {Promise<Object>} - Payment verification response
 */
async function verifyPayment(reference) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/verify-payment?reference=${reference}`)
    return await response.json()
  } catch (error) {
    console.error("Error verifying payment:", error)
    return {
      status: false,
      message: "Failed to verify payment. Please check your internet connection and try again.",
    }
  }
}

// Export functions for use in main application
window.PaystackIntegration = {
  verifyAccount,
  fetchBanks,
  initiatePayment,
  verifyPayment,
}