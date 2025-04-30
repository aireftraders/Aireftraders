document.addEventListener("DOMContentLoaded", async function () {
    // Check if user is authenticated
    const isAuthenticated = await TelegramAuth.verifyAuth();
    if (!isAuthenticated) {
        console.error('Authentication failed. Redirecting to splash screen.');
        window.location.href = 'splash-screen.html';
    } else {
        console.log('Authentication successful.');
    }
});
