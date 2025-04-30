// app-init.js
document.addEventListener('DOMContentLoaded', async function () {
  try {
    TelegramAuth.initFromTelegram(); // Save initData to localStorage if present

    const isAuthenticated = await TelegramAuth.verifyAuth();
    if (!isAuthenticated) {
      console.warn('Authentication failed. Redirecting to splash screen...');
      window.location.href = 'splash-screen.html';
    } else {
      console.log('Authentication successful. Welcome:', TelegramAuth.getUser());
    }
  } catch (error) {
    console.error('Fatal error during auth check:', error);
    window.location.href = 'splash-screen.html';
  }
});
