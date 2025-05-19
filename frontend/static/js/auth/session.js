document.addEventListener('DOMContentLoaded', function() {
    displayUserName();
    setupLogoutHandlers();
});

function displayUserName() {
    const userNameElement = document.getElementById('user-name');
    const loggedUserName = localStorage.getItem('userName');
    
    if (userNameElement && loggedUserName) {
        userNameElement.textContent = loggedUserName;
    } else {
        checkAuth();
    }
}

function setupLogoutHandlers() {
    const logoutButtons = ['btn-logout', 'dropdown-logout'];
    
    logoutButtons.forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', handleLogout);
        }
    });
}

function handleLogout(event) {
    event.preventDefault();
    localStorage.clear();
    window.location.href = '../../landingpage.html';
}

function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '../../landingpage.html';
    }
}

checkAuth();