// Main Application Controller
class BankerApp {
    constructor() {
        this.isLoggedIn = false;
        this.init();
    }
    
    init() {
        this.showLoadingScreen();
        this.bindLoginEvents();
        
        // Simulate loading time
        setTimeout(() => {
            this.hideLoadingScreen();
            this.showLoginPage();
        }, 2000);
    }
    
    showLoadingScreen() {
        document.getElementById('loading-screen').classList.remove('hidden');
    }
    
    hideLoadingScreen() {
        document.getElementById('loading-screen').classList.add('hidden');
    }
    
    showLoginPage() {
        document.getElementById('login-page').classList.remove('hidden');
    }
    
    hideLoginPage() {
        document.getElementById('login-page').classList.add('hidden');
    }
    
    showMainApp() {
        document.getElementById('main-app').classList.remove('hidden');
        // Initialize pages after showing main app
        window.pages.init();
    }
    
    bindLoginEvents() {
        const loginForm = document.getElementById('login-form');
        const passwordToggle = document.querySelector('.password-toggle');
        const passwordInput = document.getElementById('password');
        
        // Password toggle
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = passwordToggle.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
        
        // Login form submission
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
    }
    
    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const loginBtn = document.querySelector('.login-btn');
        const btnText = document.querySelector('.btn-text');
        const btnLoading = document.querySelector('.btn-loading');
        
        // Validate inputs
        if (!email || !password) {
            window.utils.showNotification('Please enter both email and password', 'error');
            return;
        }
        
        if (!window.utils.validateEmail(email)) {
            window.utils.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        loginBtn.disabled = true;
        
        // Simulate authentication delay
        setTimeout(() => {
            // For demo purposes, accept the pre-filled credentials
            if (email === 'john.smith@example.com' && password === 'password123') {
                this.loginSuccess();
            } else {
                this.loginError('Invalid email or password');
            }
        }, 2000);
    }
    
    loginSuccess() {
        this.isLoggedIn = true;
        this.hideLoginPage();
        this.showMainApp();
        window.utils.showNotification('Welcome to Banker! Login successful.', 'success');
    }
    
    loginError(message) {
        const loginBtn = document.querySelector('.login-btn');
        const btnText = document.querySelector('.btn-text');
        const btnLoading = document.querySelector('.btn-loading');
        
        // Hide loading state
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
        loginBtn.disabled = false;
        
        window.utils.showNotification(message, 'error');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bankerApp = new BankerApp();
});