// Application Data Store
window.appData = {
    currentUser: {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0123',
        accountNumber: '****-****-****-1234'
    },
    
    cards: [
        {
            id: '1',
            cardNumber: '****-****-****-1234',
            cardType: 'Visa Platinum',
            expiryDate: '12/26',
            isActive: true,
            authorizedUsers: ['auth1', 'auth2']
        },
        {
            id: '2',
            cardNumber: '****-****-****-5678',
            cardType: 'Mastercard Gold',
            expiryDate: '08/25',
            isActive: true,
            authorizedUsers: ['auth1']
        }
    ],
    
    authorizedUsers: [
        {
            id: 'auth1',
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            phone: '+1-555-0124',
            facialDataEncoded: true,
            enrollmentDate: '2024-01-15',
            isActive: true,
            cardAccess: ['1', '2']
        },
        {
            id: 'auth2',
            name: 'Mike Davis',
            email: 'mike.d@example.com',
            phone: '+1-555-0125',
            facialDataEncoded: true,
            enrollmentDate: '2024-02-10',
            isActive: true,
            cardAccess: ['1']
        }
    ],
    
    transactions: [
        {
            id: 't1',
            cardId: '1',
            userId: 'auth1',
            amount: 200,
            location: 'ATM - Main Street Branch',
            timestamp: '2024-12-15 14:30:00',
            status: 'approved',
            verificationMethod: 'facial_recognition'
        },
        {
            id: 't2',
            cardId: '2',
            userId: 'auth1',
            amount: 100,
            location: 'ATM - Downtown Plaza',
            timestamp: '2024-12-15 10:15:00',
            status: 'approved',
            verificationMethod: 'facial_recognition'
        },
        {
            id: 't3',
            cardId: '1',
            userId: 'unknown',
            amount: 500,
            location: 'ATM - Airport Terminal',
            timestamp: '2024-12-14 22:45:00',
            status: 'pending',
            verificationMethod: 'manual_approval'
        }
    ]
};

// Data manipulation functions
window.dataManager = {
    // Cards
    addCard: function(cardData) {
        const newCard = {
            id: Date.now().toString(),
            cardNumber: `****-****-****-${cardData.cardNumber.slice(-4)}`,
            cardType: cardData.cardType,
            expiryDate: cardData.expiryDate,
            isActive: true,
            authorizedUsers: []
        };
        window.appData.cards.push(newCard);
        return newCard;
    },
    
    toggleCardStatus: function(cardId) {
        const card = window.appData.cards.find(c => c.id === cardId);
        if (card) {
            card.isActive = !card.isActive;
        }
        return card;
    },
    
    // Users
    addUser: function(userData) {
        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            facialDataEncoded: false,
            enrollmentDate: new Date().toISOString().split('T')[0],
            isActive: true,
            cardAccess: userData.cardAccess || []
        };
        window.appData.authorizedUsers.push(newUser);
        return newUser;
    },
    
    updateUserFacialData: function(userId, enrolled = true) {
        const user = window.appData.authorizedUsers.find(u => u.id === userId);
        if (user) {
            user.facialDataEncoded = enrolled;
        }
        return user;
    },
    
    toggleUserStatus: function(userId) {
        const user = window.appData.authorizedUsers.find(u => u.id === userId);
        if (user) {
            user.isActive = !user.isActive;
        }
        return user;
    },
    
    deleteUser: function(userId) {
        const index = window.appData.authorizedUsers.findIndex(u => u.id === userId);
        if (index > -1) {
            window.appData.authorizedUsers.splice(index, 1);
            // Remove face data
            if (window.faceRecognition) {
                window.faceRecognition.removeEnrolledFace(userId);
            }
            return true;
        }
        return false;
    },
    
    // Transactions
    addTransaction: function(transactionData) {
        const newTransaction = {
            id: Date.now().toString(),
            cardId: transactionData.cardId,
            userId: transactionData.userId || 'unknown',
            amount: transactionData.amount,
            location: transactionData.location || 'ATM - Demo Location',
            timestamp: new Date().toISOString(),
            status: transactionData.status || 'pending',
            verificationMethod: transactionData.verificationMethod || 'facial_recognition'
        };
        window.appData.transactions.unshift(newTransaction);
        return newTransaction;
    },
    
    updateTransactionStatus: function(transactionId, status) {
        const transaction = window.appData.transactions.find(t => t.id === transactionId);
        if (transaction) {
            transaction.status = status;
        }
        return transaction;
    },
    
    // Utility functions
    getCardInfo: function(cardId) {
        const card = window.appData.cards.find(c => c.id === cardId);
        return card ? `${card.cardType} (${card.cardNumber})` : 'Unknown Card';
    },
    
    getUserName: function(userId) {
        if (userId === 'unknown') return 'Unauthorized User';
        const user = window.appData.authorizedUsers.find(u => u.id === userId);
        return user ? user.name : 'Unknown User';
    },
    
    getAuthorizedUserNames: function(userIds) {
        return userIds.map(id => {
            const user = window.appData.authorizedUsers.find(u => u.id === id);
            return user ? user.name : 'Unknown User';
        }).join(', ');
    },
    
    getPendingTransactionsCount: function() {
        return window.appData.transactions.filter(t => t.status === 'pending').length;
    },
    
    getActiveUsersCount: function() {
        return window.appData.authorizedUsers.filter(u => u.isActive).length;
    }
};