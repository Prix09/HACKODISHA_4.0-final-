import React from 'react';
import { CreditCard, Users, Activity, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Card, AuthorizedUser, Transaction } from '../types';

interface DashboardProps {
  cards: Card[];
  authorizedUsers: AuthorizedUser[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ cards, authorizedUsers, transactions }) => {
  const activeCards = cards.filter(card => card.isActive).length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const recentTransactions = transactions.slice(0, 5);

  const stats = [
    {
      name: 'Active Cards',
      value: activeCards,
      icon: CreditCard,
      color: 'bg-blue-500',
      change: '+2 this month'
    },
    {
      name: 'Authorized Users',
      value: authorizedUsers.filter(u => u.isActive).length,
      icon: Users,
      color: 'bg-green-500',
      change: '+1 this week'
    },
    {
      name: 'Pending Approvals',
      value: pendingTransactions,
      icon: AlertTriangle,
      color: 'bg-orange-500',
      change: pendingTransactions > 0 ? 'Needs attention' : 'All clear'
    },
    {
      name: 'This Month',
      value: transactions.length,
      icon: Activity,
      color: 'bg-purple-500',
      change: '+12% from last month'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'denied':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
            <p className="text-blue-100">Your account is secure and all systems are operational.</p>
          </div>
          <Shield className="h-12 w-12 text-blue-200" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.name}</h3>
            <p className="text-xs text-gray-500">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <Activity className="h-5 w-5 text-gray-500" />
          </div>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(transaction.status)}
                  <div>
                    <p className="font-medium text-gray-900">${transaction.amount}</p>
                    <p className="text-sm text-gray-600">{transaction.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 capitalize">{transaction.status}</p>
                  <p className="text-xs text-gray-500">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full text-left p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Add New Card</p>
                  <p className="text-sm text-gray-600">Register a new debit card to your account</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors">
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Add Authorized User</p>
                  <p className="text-sm text-gray-600">Enroll a new user with facial recognition</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-900">Review Pending Transactions</p>
                  <p className="text-sm text-gray-600">Approve or deny unauthorized attempts</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="font-medium text-gray-900">Security Settings</p>
                  <p className="text-sm text-gray-600">Manage security preferences and alerts</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Facial Recognition</p>
              <p className="text-sm text-gray-600">Active & Secure</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Enabled</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Account Protection</p>
              <p className="text-sm text-gray-600">Maximum Security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;