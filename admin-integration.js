// Integration script for connecting admin panel with backend API

document.addEventListener("DOMContentLoaded", () => {
    // Declare showNotification and showConfirmation functions
    function showNotification(message) {
      const notification = document.getElementById("notification")
      const notificationText = document.getElementById("notificationText")
  
      notificationText.textContent = message
      notification.classList.add("show")
  
      setTimeout(() => {
        notification.classList.remove("show")
      }, 3000)
    }
  
    function showConfirmation(title, message, callback) {
      document.getElementById("confirmTitle").textContent = title
      document.getElementById("confirmMessage").textContent = message
      const modal = document.getElementById("confirmModal")
  
      modal.classList.add("active")
  
      document.getElementById("confirmActionBtn").onclick = () => {
        modal.classList.remove("active")
        callback(true)
      }
  
      document.getElementById("cancelActionBtn").onclick = () => {
        modal.classList.remove("active")
        callback(false)
      }
    }
  
    // Add API key input to settings tab
    const securitySettings = document.querySelector("#settingsTab .status-card:nth-child(2)")
    if (securitySettings) {
      const apiKeyGroup = document.createElement("div")
      apiKeyGroup.className = "admin-form-group"
      apiKeyGroup.innerHTML = `
        <label for="adminApiKey">Backend API Key</label>
        <input type="password" id="adminApiKey" placeholder="Enter API key for backend access">
        <small>Required for batch processing and system configuration</small>
      `
  
      securitySettings.insertBefore(apiKeyGroup, securitySettings.querySelector(".action-bar"))
  
      // Load saved API key if available
      const savedApiKey = window.BatchProcessing.getAdminToken()
      if (savedApiKey) {
        document.getElementById("adminApiKey").value = savedApiKey
      }
  
      // Save API key when security settings are saved
      document.getElementById("changeSecurityBtn").addEventListener("click", () => {
        const apiKey = document.getElementById("adminApiKey").value
        if (apiKey) {
          window.BatchProcessing.setAdminToken(apiKey)
          showNotification("API key saved successfully")
        }
      })
    }
  
    // Override batch processing functions
    const processBatchBtn = document.getElementById("processBatchBtn")
    const forceProcessBtn = document.getElementById("forceProcessBtn")
    const batchSizeInput = document.getElementById("batchSize")
  
    if (processBatchBtn) {
      processBatchBtn.addEventListener("click", async (e) => {
        e.preventDefault()
  
        if (!window.BatchProcessing.getAdminToken()) {
          showNotification("Please set your API key in Security Settings first")
          return
        }
  
        showConfirmation("Process Batch", "Are you sure you want to process the current batch?", async (confirmed) => {
          if (confirmed) {
            processBatchBtn.disabled = true
            processBatchBtn.innerHTML = '<span class="loading"></span> Processing...'
  
            const result = await window.BatchProcessing.processBatch(false)
  
            if (result.status) {
              showNotification(`Batch processing initiated: ${result.message || "Success"}`)
              await refreshBatchStatus()
            } else {
              showNotification(`Error: ${result.message || "Failed to process batch"}`)
            }
  
            processBatchBtn.disabled = false
            processBatchBtn.textContent = "Process Current Batch"
          }
        })
      })
    }
  
    if (forceProcessBtn) {
      forceProcessBtn.addEventListener("click", async (e) => {
        e.preventDefault()
  
        if (!window.BatchProcessing.getAdminToken()) {
          showNotification("Please set your API key in Security Settings first")
          return
        }
  
        showConfirmation(
          "Force Process Batch",
          "Are you sure you want to force process the current batch? This will process all pending withdrawals even if the threshold is not met.",
          async (confirmed) => {
            if (confirmed) {
              forceProcessBtn.disabled = true
              forceProcessBtn.innerHTML = '<span class="loading"></span> Processing...'
  
              const result = await window.BatchProcessing.processBatch(true)
  
              if (result.status) {
                showNotification(`Batch processing initiated: ${result.message || "Success"}`)
                await refreshBatchStatus()
              } else {
                showNotification(`Error: ${result.message || "Failed to process batch"}`)
              }
  
              forceProcessBtn.disabled = false
              forceProcessBtn.textContent = "Force Process"
            }
          },
        )
      })
    }
  
    if (batchSizeInput) {
      batchSizeInput.addEventListener("change", async function () {
        if (!window.BatchProcessing.getAdminToken()) {
          showNotification("Please set your API key in Security Settings first")
          return
        }
  
        const newBatchSize = Number.parseInt(this.value)
        if (isNaN(newBatchSize) || newBatchSize < 100) {
          showNotification("Batch size must be at least 100")
          this.value = 1000
          return
        }
  
        const result = await window.BatchProcessing.updateSystemConfig({
          batchThreshold: newBatchSize,
        })
  
        if (result.status) {
          document.getElementById("batchSizeDisplay").textContent = newBatchSize
          showNotification("Batch size updated successfully")
          await refreshBatchStatus()
        } else {
          showNotification(`Error: ${result.message || "Failed to update batch size"}`)
          this.value = document.getElementById("batchSizeDisplay").textContent
        }
      })
    }
  
    // Add refresh button for batch status
    const batchProgressDiv = document.querySelector(".batch-progress")
    if (batchProgressDiv) {
      const refreshButton = document.createElement("button")
      refreshButton.className = "secondary"
      refreshButton.style.marginTop = "10px"
      refreshButton.textContent = "Refresh Status"
      refreshButton.addEventListener("click", refreshBatchStatus)
      batchProgressDiv.appendChild(refreshButton)
    }
  
    // Function to refresh batch status
    async function refreshBatchStatus() {
      if (!window.BatchProcessing.getAdminToken()) {
        return
      }
  
      const batchProgress = document.getElementById("batchProgress")
      const batchSizeDisplay = document.getElementById("batchSizeDisplay")
      const batchProgressBar = document.getElementById("batchProgressBar")
  
      if (batchProgress && batchSizeDisplay && batchProgressBar) {
        const result = await window.BatchProcessing.fetchBatchStatus()
  
        if (result.status) {
          const data = result.data
          batchProgress.textContent = data.uniqueAccounts
          batchSizeDisplay.textContent = data.batchThreshold
          batchProgressBar.value = data.uniqueAccounts
          batchProgressBar.max = data.batchThreshold
  
          // Update dashboard stats too
          const currentBatchElement = document.getElementById("currentBatch")
          if (currentBatchElement) {
            currentBatchElement.textContent = `${data.uniqueAccounts}/${data.batchThreshold}`
          }
        }
      }
    }
  
    // Add batch history functionality
    const batchHistoryDiv = document.getElementById("batchHistory")
    if (batchHistoryDiv) {
      // Add refresh button for batch history
      const refreshHistoryButton = document.createElement("button")
      refreshHistoryButton.className = "secondary"
      refreshHistoryButton.style.marginBottom = "10px"
      refreshHistoryButton.textContent = "Refresh History"
      refreshHistoryButton.addEventListener("click", loadBatchHistory)
      batchHistoryDiv.parentNode.insertBefore(refreshHistoryButton, batchHistoryDiv)
  
      // Function to load batch history
      async function loadBatchHistory() {
        if (!window.BatchProcessing.getAdminToken()) {
          showNotification("Please set your API key in Security Settings first")
          return
        }
  
        batchHistoryDiv.innerHTML = '<p><span class="loading"></span> Loading batch history...</p>'
  
        const result = await window.BatchProcessing.fetchBatchHistory()
  
        if (result.status && result.data && result.data.batches) {
          if (result.data.batches.length === 0) {
            batchHistoryDiv.innerHTML = "<p>No batch history available</p>"
            return
          }
  
          batchHistoryDiv.innerHTML = result.data.batches
            .map(
              (batch) => `
            <div class="batch-item">
              <p><strong>Batch ID:</strong> ${batch.id}</p>
              <p><strong>Status:</strong> ${batch.status}</p>
              <p><strong>Created:</strong> ${new Date(batch.createdAt).toLocaleString()}</p>
              <p><strong>Processed:</strong> ${batch.processedAt ? new Date(batch.processedAt).toLocaleString() : "Pending"}</p>
              <p><strong>Completed:</strong> ${batch.completedAt ? new Date(batch.completedAt).toLocaleString() : "Pending"}</p>
              <p><strong>Batch Size:</strong> ${batch.batchSize}</p>
              <p><strong>Unique Accounts:</strong> ${batch.uniqueAccounts}</p>
              ${batch.paystackBatchId ? `<p><strong>Paystack Batch ID:</strong> ${batch.paystackBatchId}</p>` : ""}
              ${batch.errorMessage ? `<p><strong>Error:</strong> ${batch.errorMessage}</p>` : ""}
            </div>
          `,
            )
            .join("")
        } else {
          batchHistoryDiv.innerHTML = "<p>Failed to load batch history. Please try again.</p>"
        }
      }
  
      // Load batch history on page load
      loadBatchHistory()
    }
  
    // Load initial batch status
    refreshBatchStatus()
  
    // Load system configuration
    async function loadSystemConfig() {
      if (!window.BatchProcessing.getAdminToken()) {
        return
      }
  
      const result = await window.BatchProcessing.fetchSystemConfig()
  
      if (result.status && result.data) {
        const config = result.data
  
        // Update batch size
        if (batchSizeInput && config.batchThreshold) {
          batchSizeInput.value = config.batchThreshold
          document.getElementById("batchSizeDisplay").textContent = config.batchThreshold
        }
  
        // Update other settings if they exist in your admin panel
        const minWithdrawalInput = document.getElementById("minWithdrawal")
        if (minWithdrawalInput && config.minWithdrawalAmount) {
          minWithdrawalInput.value = config.minWithdrawalAmount
        }
  
        const maxWithdrawalInput = document.getElementById("maxWithdrawal")
        if (maxWithdrawalInput && config.maxWithdrawalAmount) {
          maxWithdrawalInput.value = config.maxWithdrawalAmount
        }
  
        const processingFeeInput = document.getElementById("processingFee")
        if (processingFeeInput && config.processingFee !== undefined) {
          processingFeeInput.value = config.processingFee
        }
  
        const maintenanceModeCheckbox = document.getElementById("maintenanceMode")
        if (maintenanceModeCheckbox && config.maintenanceMode !== undefined) {
          maintenanceModeCheckbox.checked = config.maintenanceMode
        }
      }
    }
  
    // Load initial system config
    loadSystemConfig()
  
    // Override save settings button
    const saveSettingsBtn = document.getElementById("saveSettingsBtn")
    if (saveSettingsBtn) {
      saveSettingsBtn.addEventListener("click", async (e) => {
        e.preventDefault()
  
        if (!window.BatchProcessing.getAdminToken()) {
          showNotification("Please set your API key in Security Settings first")
          return
        }
  
        const config = {
          batchThreshold: Number.parseInt(document.getElementById("batchSize").value) || 1000,
          minWithdrawalAmount: Number.parseInt(document.getElementById("minWithdrawal").value) || 5000,
          maxWithdrawalAmount: Number.parseInt(document.getElementById("maxWithdrawal").value) || 100000,
          processingFee: Number.parseInt(document.getElementById("processingFee").value) || 0,
          maintenanceMode: document.getElementById("maintenanceMode")?.checked || false,
        }
  
        saveSettingsBtn.disabled = true
        saveSettingsBtn.innerHTML = '<span class="loading"></span> Saving...'
  
        const result = await window.BatchProcessing.updateSystemConfig(config)
  
        if (result.status) {
          showNotification("Settings saved successfully")
          await loadSystemConfig()
        } else {
          showNotification(`Error: ${result.message || "Failed to save settings"}`)
        }
  
        saveSettingsBtn.disabled = false
        saveSettingsBtn.textContent = "Save Settings"
      })
    }
  })
  