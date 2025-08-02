// Component Rendering Functions
window.components = {
    // Render transaction item
    renderTransaction: function(transaction, showActions = false) {
        const statusIcon = window.utils.getStatusIcon(transaction.status);
        const cardInfo = window.dataManager.getCardInfo(transaction.cardId);
        const userName = window.dataManager.getUserName(transaction.userId);
        const formattedTime = window.utils.formatDateTime(transaction.timestamp);
        
        const actionsHtml = showActions && transaction.status === 'pending' ? `
            <div class="transaction-actions">
                <p>This transaction requires your approval</p>
                <div class="action-buttons">
                    <button class="btn-deny" onclick="window.pages.denyTransaction('${transaction.id}')">
                        Deny
                    </button>
                    <button class="btn-approve" onclick="window.pages.approveTransaction('${transaction.id}')">
                        Approve
                    </button>
                </div>
            </div>
        ` : '';
        
        return `
            <div class="transaction-item" data-id="${transaction.id}">
                <div class="transaction-main">
                    <div class="transaction-left">
                        ${statusIcon}
                        <div class="transaction-info">
                            <div class="transaction-header">
                                <span class="transaction-amount">${window.utils.formatCurrency(transaction.amount)}</span>
                                <span class="status-badge status-${transaction.status}">${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                            </div>
                            <p class="transaction-location">${transaction.location}</p>
                            <p class="transaction-card">${cardInfo}</p>
                        </div>
                    </div>
                    <div class="transaction-right">
                        <p class="transaction-user">${userName}</p>
                        <p class="transaction-time">${formattedTime}</p>
                        <p class="transaction-method">${transaction.verificationMethod.replace('_', ' ')}</p>
                    </div>
                </div>
                ${actionsHtml}
            </div>
        `;
    },
    
    // Render card item
    renderCard: function(card) {
        const authorizedUserNames = window.dataManager.getAuthorizedUserNames(card.authorizedUsers);
        const cardIcon = window.utils.getCardIcon(card.cardType);
        
        return `
            <div class="card-item" data-id="${card.id}">
                <div class="card-header-section ${card.isActive ? '' : 'inactive'}">
                    <div class="card-top">
                        <div class="card-icon">${cardIcon}</div>
                        <button class="card-menu">
                            <i class="fas fa-ellipsis-v"></i>
                        </button>
                    </div>
                    <div class="card-number">${card.cardNumber}</div>
                    <div class="card-info">
                        <span class="card-type">${card.cardType}</span>
                        <span class="card-expiry">Exp: ${card.expiryDate}</span>
                    </div>
                </div>
                <div class="card-details">
                    <div class="card-detail-row">
                        <span class="detail-label">Status</span>
                        <div class="status-controls">
                            <span class="status-badge ${card.isActive ? 'active' : 'inactive'}">
                                ${card.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button class="toggle-btn" onclick="window.pages.toggleCardStatus('${card.id}')">
                                Toggle
                            </button>
                        </div>
                    </div>
                    <div class="card-detail-row">
                        <span class="detail-label">Authorized Users</span>
                        <div class="authorized-users-info">
                            <i class="fas fa-users"></i>
                            <span>${card.authorizedUsers.length > 0 ? `${card.authorizedUsers.length} user(s)` : 'No users assigned'}</span>
                        </div>
                    </div>
                    <div class="security-feature">
                        <i class="fas fa-shield-alt"></i>
                        <span>Facial Recognition Enabled</span>
                    </div>
                    <div class="card-actions">
                        <button class="btn-settings">
                            <i class="fas fa-cog"></i>
                            <span>Settings</span>
                        </button>
                        <button class="btn-users">
                            <i class="fas fa-users"></i>
                            <span>Users</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Render user item
    renderUser: function(user) {
        const initials = window.utils.getUserInitials(user.name);
        const formattedDate = window.utils.formatDate(user.enrollmentDate);
        
        return `
            <div class="user-item" data-id="${user.id}">
                <div class="user-header">
                    <div class="user-info">
                        <div class="user-avatar">${initials}</div>
                        <div>
                            <div class="user-name">${user.name}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                    <div class="user-actions">
                        <button class="edit-btn" onclick="window.pages.editUser('${user.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="window.pages.deleteUser('${user.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="user-details">
                    <div class="user-detail-row">
                        <span class="detail-label">Status</span>
                        <span class="status-badge ${user.isActive ? 'active' : 'inactive'}">
                            ${user.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                    <div class="user-detail-row">
                        <span class="detail-label">Facial Recognition</span>
                        <div class="facial-status ${user.facialDataEncoded ? 'enrolled' : 'not-enrolled'}">
                            <i class="fas fa-${user.facialDataEncoded ? 'check-circle' : 'times-circle'}"></i>
                            <span>${user.facialDataEncoded ? 'Enrolled' : 'Not Enrolled'}</span>
                        </div>
                    </div>
                    <div class="user-detail-row">
                        <span class="detail-label">Phone</span>
                        <span class="user-phone">${user.phone}</span>
                    </div>
                    <div class="user-detail-row">
                        <span class="detail-label">Enrolled</span>
                        <span class="user-enrolled">${formattedDate}</span>
                    </div>
                    <div class="user-detail-row">
                        <span class="detail-label">Card Access</span>
                        <span class="user-cards">${user.cardAccess.length} card(s)</span>
                    </div>
                </div>
                <div class="user-card-actions">
                    ${!user.facialDataEncoded ? `
                        <button class="enroll-face-btn" onclick="window.pages.enrollUserFace('${user.id}')">
                            <i class="fas fa-camera"></i>
                            <span>Enroll Face</span>
                        </button>
                    ` : ''}
                    <button class="manage-user-btn">
                        <i class="fas fa-shield-alt"></i>
                        <span>Manage</span>
                    </button>
                </div>
            </div>
        `;
    },
    
    // Render ATM card selection
    renderATMCardSelection: function() {
        const activeCards = window.appData.cards.filter(card => card.isActive);
        
        return `
            <div class="atm-step-content">
                <i class="fas fa-credit-card atm-icon"></i>
                <h2>Select Your Card</h2>
                <p>Choose the card you want to use for the transaction</p>
                <div class="atm-card-list">
                    ${activeCards.map(card => `
                        <button class="atm-card-btn" onclick="window.pages.selectATMCard('${card.id}')">
                            <div class="atm-card-info">
                                <div class="atm-card-type">${card.cardType}</div>
                                <div class="atm-card-number">${card.cardNumber}</div>
                            </div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    },
    
    // Render ATM amount selection
    renderATMAmountSelection: function(userName) {
        return `
            <div class="atm-step-content">
                <i class="fas fa-check-circle atm-icon success"></i>
                <h2>Identity Verified</h2>
                <p>Welcome, ${userName}! Enter the withdrawal amount</p>
                <div class="atm-amount-input">
                    <input type="number" id="atm-amount" placeholder="Enter amount" min="10" max="1000">
                </div>
                <div class="atm-preset-amounts">
                    ${[20, 40, 60, 80, 100, 200].map(amount => `
                        <button class="atm-preset-btn" onclick="document.getElementById('atm-amount').value = ${amount}">
                            $${amount}
                        </button>
                    `).join('')}
                </div>
                <button class="atm-proceed-btn" onclick="window.pages.processATMTransaction()">
                    Withdraw Amount
                </button>
            </div>
        `;
    },
    
    // Render ATM result
    renderATMResult: function(success, message, amount = null) {
        return `
            <div class="atm-step-content">
                <i class="fas fa-${success ? 'check-circle' : 'times-circle'} atm-icon ${success ? 'success' : 'error'}"></i>
                <h2>${success ? 'Transaction Approved' : 'Access Denied'}</h2>
                <div class="atm-result-message ${success ? 'success' : 'error'}">
                    <p>${message}</p>
                    ${amount ? `<p class="amount-text">Amount: ${window.utils.formatCurrency(amount)}</p>` : ''}
                </div>
                <button class="atm-new-transaction-btn" onclick="window.pages.resetATM()">
                    Start New Transaction
                </button>
            </div>
        `;
    }
};