// Batch Processing Integration for Admin Panel

// Backend URL - update this to your production URL
const BACKEND_URL = "https://v0-paystack-backend-setup.vercel.app"

/**
 * Fetch current batch status from the backend
 * @returns {Promise<Object>} - Batch status data
 */
async function fetchBatchStatus() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/batch-status`, {
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
    })
    return await response.json()
  } catch (error) {
    console.error("Error fetching batch status:", error)
    return {
      status: false,
      message: "Failed to fetch batch status. Please try again.",
      data: {
        totalRequests: 0,
        uniqueAccounts: 0,
        batchThreshold: 1000,
        percentComplete: 0,
      },
    }
  }
}

/**
 * Process the current batch of withdrawals
 * @param {boolean} force - Whether to force process the batch even if threshold isn't met
 * @returns {Promise<Object>} - Processing result
 */
async function processBatch(force = false) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/process-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify({ force }),
    })
    return await response.json()
  } catch (error) {
    console.error("Error processing batch:", error)
    return {
      status: false,
      message: "Failed to process batch. Please try again.",
    }
  }
}

/**
 * Update system configuration
 * @param {Object} config - Configuration object with updated values
 * @returns {Promise<Object>} - Update result
 */
async function updateSystemConfig(config) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/config`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAdminToken()}`,
      },
      body: JSON.stringify(config),
    })
    return await response.json()
  } catch (error) {
    console.error("Error updating system config:", error)
    return {
      status: false,
      message: "Failed to update configuration. Please try again.",
    }
  }
}

/**
 * Fetch system configuration
 * @returns {Promise<Object>} - System configuration
 */
async function fetchSystemConfig() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/config`, {
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
    })
    return await response.json()
  } catch (error) {
    console.error("Error fetching system config:", error)
    return {
      status: false,
      message: "Failed to fetch configuration. Please try again.",
      data: {
        batchThreshold: 1000,
        minWithdrawalAmount: 5000,
        maxWithdrawalAmount: 100000,
        processingFee: 0,
        maintenanceMode: false,
      },
    }
  }
}

/**
 * Fetch batch processing history
 * @param {number} limit - Number of records to fetch
 * @param {number} offset - Offset for pagination
 * @returns {Promise<Object>} - Batch history data
 */
async function fetchBatchHistory(limit = 10, offset = 0) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/batch-history?limit=${limit}&offset=${offset}`, {
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
    })
    return await response.json()
  } catch (error) {
    console.error("Error fetching batch history:", error)
    return {
      status: false,
      message: "Failed to fetch batch history. Please try again.",
      data: {
        batches: [],
        pagination: {
          total: 0,
          limit,
          offset,
        },
      },
    }
  }
}

/**
 * Get admin token from localStorage
 * @returns {string} - Admin token
 */
function getAdminToken() {
  return localStorage.getItem("adminApiKey") || ""
}

/**
 * Set admin token in localStorage
 * @param {string} token - Admin token
 */
function setAdminToken(token) {
  localStorage.setItem("adminApiKey", token)
}

// Export functions for use in admin panel
window.BatchProcessing = {
  fetchBatchStatus,
  processBatch,
  updateSystemConfig,
  fetchSystemConfig,
  fetchBatchHistory,
  getAdminToken,
  setAdminToken,
}
