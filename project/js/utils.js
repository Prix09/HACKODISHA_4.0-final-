// Utility Functions
window.utils = {
    // Format date and time
    formatDateTime: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
    },
    
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    },
    
    // Format currency
    formatCurrency: function(amount) {
        return `$${amount.toFixed(2)}`;
    },
    
    // Get status icon HTML
    getStatusIcon: function(status) {
        switch (status) {
            case 'approved':
                return '<i class="fas fa-check-circle transaction-status-icon approved"></i>';
            case 'denied':
                return '<i class="fas fa-times-circle transaction-status-icon denied"></i>';
            case 'pending':
                return '<i class="fas fa-clock transaction-status-icon pending"></i>';
            default:
                return '<i class="fas fa-question-circle transaction-status-icon"></i>';
        }
    },
    
    // Get card icon
    getCardIcon: function(cardType) {
        if (cardType.toLowerCase().includes('visa')) return '💳';
        if (cardType.toLowerCase().includes('mastercard')) return '💳';
        if (cardType.toLowerCase().includes('amex')) return '💳';
        return '💳';
    },
    
    // Generate user initials
    getUserInitials: function(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    },
    
    // Show notification
    showNotification: function(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    },
    
    // Show loading state
    showLoading: function(element, text = 'Loading...') {
        element.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <span>${text}</span>
            </div>
        `;
    },
    
    // Hide loading state
    hideLoading: function(element, originalContent) {
        element.innerHTML = originalContent;
    },
    
    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validate phone
    validatePhone: function(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/[\s\-\(\)]/g, ''));
    },
    
    // Format card number
    formatCardNumber: function(cardNumber) {
        return cardNumber.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
    },
    
    // Mask card number
    maskCardNumber: function(cardNumber) {
        const cleaned = cardNumber.replace(/\s/g, '');
        return `****-****-****-${cleaned.slice(-4)}`;
    },
    
    // Debounce function
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Send email notification (simulated)
    sendEmailNotification: function(to, subject, message) {
        console.log(`Email sent to ${to}:`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);
        
        // In a real application, this would make an API call to send email
        return Promise.resolve({
            success: true,
            message: 'Email notification sent successfully'
        });
    }
};