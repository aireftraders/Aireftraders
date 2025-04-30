// telegram-auth.js
window.TelegramAuth = {
  log: (message) => {
    console.log(`[TelegramAuth] ${message}`);
  },

  initFromTelegram: function () {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {
      const initData = window.Telegram.WebApp.initData;
      localStorage.setItem("telegramInitData", initData);
      this.log("Telegram initData saved.");
    } else {
      this.log("No Telegram initData found.");
    }
  },

  isAuthenticated: function () {
    const initData = localStorage.getItem("telegramInitData");
    const isAuth = !!initData;
    this.log(`isAuthenticated: ${isAuth}`);
    return isAuth;
  },

  verifyAuth: async function () {
    this.log("verifyAuth called.");
    const initData = localStorage.getItem("telegramInitData");
    if (!initData) {
      this.log("No initData in localStorage.");
      return false;
    }

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData })
      });

      const result = await res.json();
      this.log(`verifyAuth response: ${JSON.stringify(result)}`);
      return result.success;
    } catch (err) {
      console.error("verifyAuth error:", err);
      return false;
    }
  },

  getUser: function () {
    try {
      const unsafe = window.Telegram.WebApp.initDataUnsafe;
      if (unsafe && unsafe.user) {
        return unsafe.user;
      }
    } catch (e) {
      this.log("getUser failed. Returning fallback user.");
    }

    return {
      id: "0000",
      first_name: "Guest",
      username: "guest_user"
    };
  },

  logout: function () {
    localStorage.removeItem("telegramInitData");
    sessionStorage.clear();
    this.log("User logged out.");
  }
};
