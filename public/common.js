// ===== THEME FUNCTIONALITY =====
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Update toggle button based on current theme
    updateThemeToggle();
    
    // Add event listener for theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Set the new theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update toggle button
            updateThemeToggle();
        });
    }
    
    function updateThemeToggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (themeIcon && themeText) {
            if (currentTheme === 'dark') {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Light Mode';
            } else {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Dark Mode';
            }
        }
    }
}

// ===== LANGUAGE FUNCTIONALITY =====
const translations = {
    en: {
        dashboard: "Dashboard",
        trading: "AI Trading",
        games: "Games",
        info: "Info",
        support: "Support",
        tradingTitle: "AI Trading",
        gamesTitle: "Games",
        adsTitle: "Watch Ads",
        // Add more English translations as needed
    },
    ha: {
        dashboard: "Dashboard",
        trading: "Kasuwancin AI",
        games: "Wasanni",
        info: "Bayani",
        support: "Tallafi",
        tradingTitle: "Kasuwancin AI",
        gamesTitle: "Wasanni",
        adsTitle: "Kalli Tallace-tallace",
    },
    yo: {
        dashboard: "Dashboard",
        trading: "Iṣowo AI",
        games: "Ere",
        info: "Alaye",
        support: "Atilẹyin",
        tradingTitle: "Iṣowo AI",
        gamesTitle: "Ere",
        adsTitle: "Wo Awọn ipolowo",
    },
    ig: {
        dashboard: "Dashboard",
        trading: "Ahịa AI",
        games: "Egwuregwu",
        info: "Ozi",
        support: "Nkwado",
        tradingTitle: "Ahịa AI",
        gamesTitle: "Egwuregwu",
        adsTitle: "Lelee Mgbasa Ozi",
    }
};

function updateLanguage(language) {
    // Save selected language to localStorage
    localStorage.setItem('selectedLanguage', language);
    
    // Update UI elements with translations
    const elementsToTranslate = {
        // Tab translations
        'tab-dashboard': translations[language].dashboard,
        'tab-trading': translations[language].trading,
        'tab-games': translations[language].games,
        'tab-info': translations[language].info,
        'tab-support': translations[language].support,
        
        // Page title translations
        'trading-title': translations[language].tradingTitle,
        'games-title': translations[language].gamesTitle,
        'ads-title': translations[language].adsTitle,
        
        // Add more elements as needed
    };
    
    for (const [id, text] of Object.entries(elementsToTranslate)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }
}

function setupLanguageSelector() {
    const languageDropdown = document.getElementById('languageDropdown');
    if (languageDropdown) {
        // Set initial language
        const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
        languageDropdown.value = savedLanguage;
        
        // Add event listener
        languageDropdown.addEventListener('change', function() {
            updateLanguage(this.value);
        });
    }
}

// ===== APPLY SETTINGS WHEN PAGE LOADS =====
function applyGlobalSettings() {
    // Apply theme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeToApply = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', themeToApply);
    
    // Apply language
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    if (document.getElementById('languageDropdown')) {
        document.getElementById('languageDropdown').value = savedLanguage;
    }
    updateLanguage(savedLanguage);
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', function() {
    applyGlobalSettings();
    setupThemeToggle();
    setupLanguageSelector();
    
    // Make sure the theme toggle button is properly initialized
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        if (document.getElementById('themeIcon')) {
            document.getElementById('themeIcon').textContent = '☀️';
        }
        if (document.getElementById('themeText')) {
            document.getElementById('themeText').textContent = 'Light Mode';
        }
    } else {
        if (document.getElementById('themeIcon')) {
            document.getElementById('themeIcon').textContent = '🌙';
        }
        if (document.getElementById('themeText')) {
            document.getElementById('themeText').textContent = 'Dark Mode';
        }
    }
});

// Make functions available to other scripts if needed
window.sharedFunctions = {
    updateLanguage,
    applyGlobalSettings
};
