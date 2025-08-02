import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, Filter, Search, Download } from 'lucide-react';
import { Transaction, Card, AuthorizedUser } from '../types';

interface TransactionsProps {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  cards: Card[];
  authorizedUsers: AuthorizedUser[];
}

const Transactions: React.FC<TransactionsProps> = ({ 
  transactions, 
  setTransactions, 
  cards, 
  authorizedUsers 
}) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApproveTransaction = (transactionId: string) => {
    setTransactions(transactions.map(t => 
      t.id === transactionId ? { ...t, status: 'approved' } : t
    ));
  };

  const handleDenyTransaction = (transactionId: string) => {
    setTransactions(transactions.map(t => 
      t.id === transactionId ? { ...t, status: 'denied' } : t
    ));
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.status === filter;
    const matchesSearch = transaction.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.amount.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'denied':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCardInfo = (cardId: string) => {
    const card = cards.find(c => c.id === cardId);
    return card ? `${card.cardType} (${card.cardNumber})` : 'Unknown Card';
  };

  const getUserName = (userId: string) => {
    if (userId === 'unknown') return 'Unauthorized User';
    const user = authorizedUsers.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600">Monitor and manage all card transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          {pendingCount > 0 && (
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              {pendingCount} pending approval{pendingCount > 1 ? 's' : ''}
            </div>
          )}
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Transactions</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="denied">Denied</option>
              </select>
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStatusIcon(transaction.status)}
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">${transaction.amount}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{transaction.location}</p>
                  <p className="text-xs text-gray-500">{getCardInfo(transaction.cardId)}</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{getUserName(transaction.userId)}</p>
                <p className="text-xs text-gray-500">{new Date(transaction.timestamp).toLocaleString()}</p>
                <p className="text-xs text-gray-500 capitalize">{transaction.verificationMethod.replace('_', ' ')}</p>
              </div>
            </div>

            {transaction.status === 'pending' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">This transaction requires your approval</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDenyTransaction(transaction.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                    >
                      Deny
                    </button>
                    <button
                      onClick={() => handleApproveTransaction(transaction.id)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;