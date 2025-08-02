// Page Management and Functionality
window.pages = {
    currentPage: 'dashboard',
    currentATMCard: null,
    currentEnrollmentUser: null,
    
    // Initialize pages
    init: function() {
        this.bindEvents();
        this.showPage('dashboard');
        this.updateDashboardStats();
        this.renderRecentTransactions();
    },
    
    // Bind event listeners
    bindEvents: function() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.showPage(page);
            });
        });
        
        // Mobile menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('hidden');
        });
        
        // Profile menu
        const profileBtn = document.querySelector('.profile-btn');
        const profileDropdown = document.querySelector('.profile-dropdown');
        profileBtn.addEventListener('click', () => {
            profileDropdown.classList.toggle('hidden');
        });
        
        // Logout
        document.querySelector('.logout-btn').addEventListener('click', () => {
            this.logout();
        });
        
        // Modal events
        this.bindModalEvents();
        
        // Quick actions
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });
        
        // Transaction filters
        const transactionFilter = document.getElementById('transaction-filter');
        const transactionSearch = document.getElementById('transaction-search');
        
        if (transactionFilter) {
            transactionFilter.addEventListener('change', () => this.filterTransactions());
        }
        
        if (transactionSearch) {
            transactionSearch.addEventListener('input', window.utils.debounce(() => this.filterTransactions(), 300));
        }
        
        // ATM controls
        const atmCancel = document.getElementById('atm-cancel');
        if (atmCancel) {
            atmCancel.addEventListener('click', () => this.resetATM());
        }
    },
    
    // Show specific page
    showPage: function(pageName) {
        // Hide all pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.add('hidden');
        });
        
        // Show selected page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }
        
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelectorAll(`[data-page="${pageName}"]`).forEach(link => {
            link.classList.add('active');
        });
        
        this.currentPage = pageName;
        
        // Load page-specific content
        switch (pageName) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'cards':
                this.loadCards();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'transactions':
                this.loadTransactions();
                break;
            case 'atm':
                this.loadATM();
                break;
        }
    },
    
    // Load dashboard
    loadDashboard: function() {
        this.updateDashboardStats();
        this.renderRecentTransactions();
    },
    
    // Update dashboard statistics
    updateDashboardStats: function() {
        const activeCards = window.appData.cards.filter(card => card.isActive).length;
        const activeUsers = window.dataManager.getActiveUsersCount();
        const pendingTransactions = window.dataManager.getPendingTransactionsCount();
        const totalTransactions = window.appData.transactions.length;
        
        document.querySelector('#authorized-users-count').textContent = activeUsers;
        document.querySelector('#pending-count').textContent = pendingTransactions;
        document.querySelector('#transactions-count').textContent = totalTransactions;
    },
    
    // Render recent transactions
    renderRecentTransactions: function() {
        const recentTransactions = window.appData.transactions.slice(0, 5);
        const container = document.getElementById('recent-transactions');
        
        if (recentTransactions.length === 0) {
            container.innerHTML = '<p class="no-data">No recent transactions</p>';
            return;
        }
        
        container.innerHTML = recentTransactions.map(transaction => 
            window.components.renderTransaction(transaction, false)
        ).join('');
    },
    
    // Load cards page
    loadCards: function() {
        const container = document.getElementById('cards-grid');
        container.innerHTML = window.appData.cards.map(card => 
            window.components.renderCard(card)
        ).join('');
    },
    
    // Load users page
    loadUsers: function() {
        const container = document.getElementById('users-grid');
        container.innerHTML = window.appData.authorizedUsers.map(user => 
            window.components.renderUser(user)
        ).join('');
    },
    
    // Load transactions page
    loadTransactions: function() {
        this.renderTransactions();
        this.updateTransactionsBadge();
    },
    
    // Render transactions
    renderTransactions: function() {
        const container = document.getElementById('transactions-list');
        const filteredTransactions = this.getFilteredTransactions();
        
        if (filteredTransactions.length === 0) {
            container.innerHTML = `
                <div class="no-transactions">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>No transactions found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = filteredTransactions.map(transaction => 
            window.components.renderTransaction(transaction, true)
        ).join('');
    },
    
    // Get filtered transactions
    getFilteredTransactions: function() {
        const filter = document.getElementById('transaction-filter')?.value || 'all';
        const search = document.getElementById('transaction-search')?.value.toLowerCase() || '';
        
        return window.appData.transactions.filter(transaction => {
            const matchesFilter = filter === 'all' || transaction.status === filter;
            const matchesSearch = search === '' || 
                transaction.location.toLowerCase().includes(search) ||
                transaction.amount.toString().includes(search);
            return matchesFilter && matchesSearch;
        });
    },
    
    // Filter transactions
    filterTransactions: function() {
        this.renderTransactions();
    },
    
    // Update transactions badge
    updateTransactionsBadge: function() {
        const pendingCount = window.dataManager.getPendingTransactionsCount();
        const badge = document.getElementById('pending-transactions-badge');
        if (badge) {
            badge.innerHTML = `<span>${pendingCount} pending approval${pendingCount !== 1 ? 's' : ''}</span>`;
            badge.style.display = pendingCount > 0 ? 'block' : 'none';
        }
    },
    
    // Load ATM page
    loadATM: function() {
        this.resetATM();
    },
    
    // Reset ATM to initial state
    resetATM: function() {
        this.currentATMCard = null;
        const display = document.getElementById('atm-display');
        display.innerHTML = window.components.renderATMCardSelection();
    },
    
    // Handle quick actions
    handleQuickAction: function(action) {
        switch (action) {
            case 'add-card':
                this.showAddCardModal();
                break;
            case 'add-user':
                this.showAddUserModal();
                break;
            case 'review-transactions':
                this.showPage('transactions');
                break;
            case 'security-settings':
                window.utils.showNotification('Security settings coming soon!', 'info');
                break;
        }
    },
    
    // Modal management
    bindModalEvents: function() {
        const overlay = document.getElementById('modal-overlay');
        
        // Close modal events
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.hideModal());
        });
        
        // Click outside to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideModal();
            }
        });
        
        // Form submissions
        document.getElementById('add-card-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddCard();
        });
        
        document.getElementById('add-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddUser();
        });
        
        // Facial enrollment events
        document.getElementById('start-enrollment').addEventListener('click', () => {
            this.startFacialEnrollment();
        });
        
        document.getElementById('complete-enrollment').addEventListener('click', () => {
            this.completeFacialEnrollment();
        });
        
        // ATM camera events
        document.getElementById('capture-face').addEventListener('click', () => {
            this.captureATMFace();
        });
        
        document.getElementById('proceed-transaction').addEventListener('click', () => {
            this.proceedATMTransaction();
        });
        
        // Add card button
        document.getElementById('add-card-btn').addEventListener('click', () => {
            this.showAddCardModal();
        });
        
        // Add user button
        document.getElementById('add-user-btn').addEventListener('click', () => {
            this.showAddUserModal();
        });
    },
    
    // Show modal
    showModal: function(modalId) {
        document.getElementById('modal-overlay').classList.remove('hidden');
        document.getElementById(modalId).classList.remove('hidden');
    },
    
    // Hide modal
    hideModal: function() {
        document.getElementById('modal-overlay').classList.add('hidden');
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.add('hidden');
        });
        
        // Stop any camera streams
        if (window.faceRecognition) {
            window.faceRecognition.stopCamera();
        }
    },
    
    // Show add card modal
    showAddCardModal: function() {
        this.showModal('add-card-modal');
    },
    
    // Show add user modal
    showAddUserModal: function() {
        // Populate card access list
        const cardAccessList = document.getElementById('card-access-list');
        cardAccessList.innerHTML = window.appData.cards.map(card => `
            <label class="checkbox-item">
                <input type="checkbox" value="${card.id}">
                <span>${card.cardType} (${card.cardNumber})</span>
            </label>
        `).join('');
        
        this.showModal('add-user-modal');
    },
    
    // Handle add card
    handleAddCard: function() {
        const cardNumber = document.getElementById('card-number').value;
        const cardType = document.getElementById('card-type').value;
        const expiryDate = document.getElementById('expiry-date').value;
        
        if (!cardNumber || !cardType || !expiryDate) {
            window.utils.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        const newCard = window.dataManager.addCard({
            cardNumber,
            cardType,
            expiryDate
        });
        
        this.hideModal();
        this.loadCards();
        this.updateDashboardStats();
        window.utils.showNotification('Card added successfully!', 'success');
        
        // Reset form
        document.getElementById('add-card-form').reset();
    },
    
    // Handle add user
    handleAddUser: function() {
        const name = document.getElementById('user-name').value;
        const email = document.getElementById('user-email').value;
        const phone = document.getElementById('user-phone').value;
        const cardAccess = Array.from(document.querySelectorAll('#card-access-list input:checked'))
            .map(input => input.value);
        
        if (!name || !email || !phone) {
            window.utils.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!window.utils.validateEmail(email)) {
            window.utils.showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        const newUser = window.dataManager.addUser({
            name,
            email,
            phone,
            cardAccess
        });
        
        this.currentEnrollmentUser = newUser.id;
        this.hideModal();
        
        // Show facial enrollment modal
        setTimeout(() => {
            this.showFacialEnrollmentModal();
        }, 500);
        
        // Reset form
        document.getElementById('add-user-form').reset();
    },
    
    // Show facial enrollment modal
    showFacialEnrollmentModal: function() {
        this.showModal('facial-enrollment-modal');
    },
    
    // Start facial enrollment
    async startFacialEnrollment() {
        const video = document.getElementById('enrollment-video');
        const startBtn = document.getElementById('start-enrollment');
        const completeBtn = document.getElementById('complete-enrollment');
        const instruction = document.getElementById('enrollment-instruction');
        const progress = document.getElementById('enrollment-progress');
        
        // Initialize camera
        const cameraInitialized = await window.faceRecognition.initCamera(video);
        if (!cameraInitialized) {
            return;
        }
        
        startBtn.classList.add('hidden');
        instruction.textContent = 'Hold still while we capture your facial data...';
        progress.classList.remove('hidden');
        
        // Simulate enrollment progress
        await window.faceRecognition.simulateEnrollmentProgress((progressValue) => {
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.getElementById('progress-text');
            progressFill.style.width = `${progressValue}%`;
            progressText.textContent = `${Math.round(progressValue)}%`;
        });
        
        // Capture face data
        const canvas = document.getElementById('enrollment-canvas');
        const success = await window.faceRecognition.captureFaceData(video, canvas, this.currentEnrollmentUser);
        
        if (success) {
            instruction.textContent = 'Facial data captured successfully!';
            progress.classList.add('hidden');
            completeBtn.classList.remove('hidden');
        } else {
            instruction.textContent = 'Failed to capture facial data. Please try again.';
            progress.classList.add('hidden');
            startBtn.classList.remove('hidden');
        }
    },
    
    // Complete facial enrollment
    completeFacialEnrollment: function() {
        if (this.currentEnrollmentUser) {
            window.dataManager.updateUserFacialData(this.currentEnrollmentUser, true);
            this.loadUsers();
            this.updateDashboardStats();
            window.utils.showNotification('Facial recognition enrolled successfully!', 'success');
        }
        
        this.hideModal();
        this.currentEnrollmentUser = null;
    },
    
    // Enroll user face (for existing users)
    enrollUserFace: function(userId) {
        this.currentEnrollmentUser = userId;
        this.showFacialEnrollmentModal();
    },
    
    // Toggle card status
    toggleCardStatus: function(cardId) {
        window.dataManager.toggleCardStatus(cardId);
        this.loadCards();
        window.utils.showNotification('Card status updated', 'success');
    },
    
    // Delete user
    deleteUser: function(userId) {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            window.dataManager.deleteUser(userId);
            this.loadUsers();
            this.updateDashboardStats();
            window.utils.showNotification('User deleted successfully', 'success');
        }
    },
    
    // Edit user (placeholder)
    editUser: function(userId) {
        window.utils.showNotification('Edit user functionality coming soon!', 'info');
    },
    
    // Approve transaction
    approveTransaction: function(transactionId) {
        window.dataManager.updateTransactionStatus(transactionId, 'approved');
        this.loadTransactions();
        this.updateDashboardStats();
        this.renderRecentTransactions();
        window.utils.showNotification('Transaction approved', 'success');
    },
    
    // Deny transaction
    denyTransaction: function(transactionId) {
        window.dataManager.updateTransactionStatus(transactionId, 'denied');
        this.loadTransactions();
        this.updateDashboardStats();
        this.renderRecentTransactions();
        window.utils.showNotification('Transaction denied', 'success');
        
        // Send email notification
        const transaction = window.appData.transactions.find(t => t.id === transactionId);
        if (transaction) {
            window.utils.sendEmailNotification(
                window.appData.currentUser.email,
                'Transaction Denied',
                `A withdrawal attempt of $${transaction.amount} at ${transaction.location} has been denied.`
            );
        }
    },
    
    // ATM Functions
    selectATMCard: function(cardId) {
        this.currentATMCard = cardId;
        this.showModal('atm-camera-modal');
    },
    
    // Capture ATM face
    async captureATMFace() {
        const video = document.getElementById('atm-video');
        const canvas = document.getElementById('atm-canvas');
        const captureBtn = document.getElementById('capture-face');
        const proceedBtn = document.getElementById('proceed-transaction');
        const instruction = document.getElementById('atm-instruction');
        const resultDiv = document.getElementById('verification-result');
        const successIcon = document.querySelector('.success-icon');
        const errorIcon = document.querySelector('.error-icon');
        const message = document.getElementById('verification-message');
        
        // Initialize camera if not already done
        if (!video.srcObject) {
            const cameraInitialized = await window.faceRecognition.initCamera(video);
            if (!cameraInitialized) {
                return;
            }
        }
        
        captureBtn.disabled = true;
        instruction.textContent = 'Processing...';
        
        // Verify face
        const result = await window.faceRecognition.verifyFace(video, canvas, this.currentATMCard);
        
        // Show result
        resultDiv.classList.remove('hidden');
        message.textContent = result.message;
        
        if (result.success) {
            successIcon.classList.remove('hidden');
            errorIcon.classList.add('hidden');
            proceedBtn.classList.remove('hidden');
            captureBtn.classList.add('hidden');
        } else {
            errorIcon.classList.remove('hidden');
            successIcon.classList.add('hidden');
            captureBtn.disabled = false;
            instruction.textContent = 'Try again or contact support';
            
            // Create pending transaction for manual review
            window.dataManager.addTransaction({
                cardId: this.currentATMCard,
                userId: 'unknown',
                amount: 0, // Will be set later if approved
                status: 'pending',
                verificationMethod: 'manual_approval'
            });
            
            // Send email notification
            window.utils.sendEmailNotification(
                window.appData.currentUser.email,
                'Unauthorized ATM Access Attempt',
                `An unauthorized access attempt was made on your card at ATM - Demo Location. Please review and approve or deny this transaction.`
            );
        }
    },
    
    // Proceed with ATM transaction
    proceedATMTransaction: function() {
        this.hideModal();
        
        // Get verified user
        const authorizedUsers = window.appData.authorizedUsers.filter(user => 
            user.cardAccess.includes(this.currentATMCard) && user.facialDataEncoded && user.isActive
        );
        
        if (authorizedUsers.length > 0) {
            const user = authorizedUsers[0]; // In real implementation, this would be the matched user
            const display = document.getElementById('atm-display');
            display.innerHTML = window.components.renderATMAmountSelection(user.name);
        }
    },
    
    // Process ATM transaction
    processATMTransaction: function() {
        const amount = parseFloat(document.getElementById('atm-amount').value);
        
        if (!amount || amount < 10 || amount > 1000) {
            window.utils.showNotification('Please enter a valid amount between $10 and $1000', 'error');
            return;
        }
        
        // Get verified user
        const authorizedUsers = window.appData.authorizedUsers.filter(user => 
            user.cardAccess.includes(this.currentATMCard) && user.facialDataEncoded && user.isActive
        );
        
        if (authorizedUsers.length > 0) {
            const user = authorizedUsers[0];
            
            // Create successful transaction
            window.dataManager.addTransaction({
                cardId: this.currentATMCard,
                userId: user.id,
                amount: amount,
                status: 'approved',
                verificationMethod: 'facial_recognition'
            });
            
            // Show success result
            const display = document.getElementById('atm-display');
            display.innerHTML = window.components.renderATMResult(
                true, 
                `Transaction completed successfully! Please take your cash.`,
                amount
            );
            
            // Update dashboard
            this.updateDashboardStats();
            this.renderRecentTransactions();
            
            window.utils.showNotification('ATM transaction completed successfully!', 'success');
        }
    },
    
    // Logout
    logout: function() {
        if (confirm('Are you sure you want to logout?')) {
            document.getElementById('main-app').classList.add('hidden');
            document.getElementById('login-page').classList.remove('hidden');
        }
    }
};