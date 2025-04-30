document.addEventListener('DOMContentLoaded', async function () {
    try {
        const isAuthenticated = await TelegramAuth.verifyAuth();
        if (!isAuthenticated) {
            console.error('Authentication failed. Redirecting to splash screen.');
            window.location.href = 'splash-screen.html';
        } else {
            console.log('Authentication successful.');
        }
    } catch (error) {
        console.error('Error during authentication check:', error);
        window.location.href = 'splash-screen.html';
    }
});
