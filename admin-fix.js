document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin fix script loaded');
    
    // Fix admin login functionality
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    if (adminLoginBtn) {
      adminLoginBtn.addEventListener('click', function() {
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value.trim();
        const passkey = document.getElementById('adminPasskey').value.trim();
        
        if ((!username || !password) && !passkey) {
          showNotification('Please enter either username/password or passkey.');
          return;
        }
        
        // For demo purposes, allow login with default credentials
        if ((username === 'admin' && password === 'admin123') || passkey === 'defaultPasskey') {
          document.getElementById('loginContainer').style.display = 'none';
          document.getElementById('adminPanel').style.display = 'block';
          document.getElementById('adminUsernameDisplay').textContent = username || 'Admin';
          
          // Initialize admin panel data
          loadAdminPanelData();
        } else {
          showNotification('Invalid credentials. Please try again.');
        }
      });
    }
    
    // Fix 2FA functionality
    const totpInputs = document.querySelectorAll('#totpStep .totp-input');
    totpInputs.forEach((input, index) => {
      input.addEventListener('input', function() {
        if (this.value.length === 1) {
          // Move to next input
          if (index < totpInputs.length - 1) {
            totpInputs[index + 1].focus();
          }
        }
      });
      
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && !this.value) {
          // Move to previous input on backspace if current is empty
          if (index > 0) {
            totpInputs[index - 1].focus();
          }
        }
      });
    });
    
    // Fix verify TOTP button
    const verifyTotpBtn = document.getElementById('verifyTotpBtn');
    if (verifyTotpBtn) {
      verifyTotpBtn.addEventListener('click', function() {
        const code = Array.from(totpInputs).map(input => input.value).join('');
        if (code.length === 6) {
          // For demo purposes, accept any 6-digit code
          document.getElementById('loginContainer').style.display = 'none';
          document.getElementById('adminPanel').style.display = 'block';
          document.getElementById('adminUsernameDisplay').textContent = 'Admin';
          
          // Initialize admin panel data
          loadAdminPanelData();
        } else {
          showNotification('Please enter a valid 6-digit code.');
        }
      });
    }
    
    // Fix back to password button
    const backToPasswordBtn = document.getElementById('backToPasswordBtn');
    if (backToPasswordBtn) {
      backToPasswordBtn.addEventListener('click', function() {
        document.getElementById('totpStep').classList.remove('active');
        document.getElementById('passwordStep').classList.add('active');
      });
    }
    
    // Fix tab switching
    const adminTabs = document.querySelectorAll('.admin-tab');
    adminTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        adminTabs.forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Hide all tab contents
        document.querySelectorAll('.admin-tab-content').forEach(content => {
          content.classList.remove('active');
        });
        
        // Show corresponding tab content
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId + 'Tab').classList.add('active');
      });
    });
    
    // Fix logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('adminPanel').style.display = 'none';
      });
    }
    
    // Fix theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        
        // Update toggle button
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.getElementById('themeText');
        if (newTheme === 'dark') {
          themeIcon.textContent = '☀️';
          themeText.textContent = 'Light Mode';
        } else {
          themeIcon.textContent = '🌙';
          themeText.textContent = 'Dark Mode';
        }
      });
    }
    
    // Helper function to show notification
    function showNotification(message) {
      const notification = document.getElementById('notification');
      const notificationText = document.getElementById('notificationText');
      
      notificationText.textContent = message;
      notification.classList.add('show');
      
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
    
    // Initialize admin panel data with mock data
    function loadAdminPanelData() {
      // Set some mock statistics
      document.getElementById('totalUsers').textContent = '1,245';
      document.getElementById('activeUsers').textContent = '876';
      document.getElementById('verifiedUsers').textContent = '723';
      document.getElementById('pendingWithdrawals').textContent = '42';
      document.getElementById('currentBatch').textContent = '723/1000';
      document.getElementById('totalProfit').textContent = '₦12,450,000';
      
      // Set batch progress
      document.getElementById('batchProgress').textContent = '723';
      document.getElementById('batchSizeDisplay').textContent = '1000';
      document.getElementById('batchProgressBar').value = 723;
      document.getElementById('batchProgressBar').max = 1000;
      
      // Initialize charts if Chart.js is loaded
      if (window.Chart) {
        initializeCharts();
      }
    }
    
    // Initialize charts
    function initializeCharts() {
      // User growth chart
      const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
      new Chart(userGrowthCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
          datasets: [{
            label: 'Total Users',
            data: [120, 250, 380, 520, 680, 950, 1245],
            borderColor: '#6C5CE7',
            backgroundColor: 'rgba(108, 92, 231, 0.1)',
            tension: 0.1,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'User Growth Over Time'
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
      
      // Profit distribution chart
      const profitDistributionCtx = document.getElementById('profitDistributionChart').getContext('2d');
      new Chart(profitDistributionCtx, {
        type: 'doughnut',
        data: {
          labels: ['User Profit', 'Company Profit', 'System Fee'],
          datasets: [{
            data: [8715000, 3112500, 622500],
            backgroundColor: [
              '#00B894',
              '#6C5CE7',
              '#2D3436'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Profit Distribution'
            }
          }
        }
      });
    }
  });
  