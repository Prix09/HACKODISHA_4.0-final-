import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Cards from './pages/Cards';
import AuthorizedUsers from './pages/AuthorizedUsers';
import Transactions from './pages/Transactions';
import ATMSimulator from './pages/ATMSimulator';
import Login from './pages/Login';
import { User, Card, AuthorizedUser, Transaction } from './types';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [authorizedUsers, setAuthorizedUsers] = useState<AuthorizedUser[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Simulate user login
    const mockUser: User = {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-0123',
      accountNumber: '****-****-****-1234'
    };
    setCurrentUser(mockUser);

    // Initialize mock data
    const mockCards: Card[] = [
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
    ];

    const mockAuthorizedUsers: AuthorizedUser[] = [
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
    ];

    const mockTransactions: Transaction[] = [
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
    ];

    setCards(mockCards);
    setAuthorizedUsers(mockAuthorizedUsers);
    setTransactions(mockTransactions);
  }, []);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header user={currentUser} onLogout={() => setCurrentUser(null)} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <Dashboard 
                  cards={cards} 
                  authorizedUsers={authorizedUsers} 
                  transactions={transactions} 
                />
              } 
            />
            <Route 
              path="/cards" 
              element={
                <Cards 
                  cards={cards} 
                  setCards={setCards} 
                  authorizedUsers={authorizedUsers} 
                />
              } 
            />
            <Route 
              path="/authorized-users" 
              element={
                <AuthorizedUsers 
                  authorizedUsers={authorizedUsers} 
                  setAuthorizedUsers={setAuthorizedUsers}
                  cards={cards}
                />
              } 
            />
            <Route 
              path="/transactions" 
              element={
                <Transactions 
                  transactions={transactions} 
                  setTransactions={setTransactions}
                  cards={cards}
                  authorizedUsers={authorizedUsers}
                />
              } 
            />
            <Route 
              path="/atm-simulator" 
              element={
                <ATMSimulator 
                  cards={cards} 
                  authorizedUsers={authorizedUsers}
                  onTransaction={(transaction) => setTransactions(prev => [transaction, ...prev])}
                />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;