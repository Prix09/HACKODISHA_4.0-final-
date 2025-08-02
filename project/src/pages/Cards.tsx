import React, { useState } from 'react';
import { CreditCard, Plus, Settings, Shield, Users, MoreVertical } from 'lucide-react';
import { Card, AuthorizedUser } from '../types';

interface CardsProps {
  cards: Card[];
  setCards: (cards: Card[]) => void;
  authorizedUsers: AuthorizedUser[];
}

const Cards: React.FC<CardsProps> = ({ cards, setCards, authorizedUsers }) => {
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    cardType: '',
    expiryDate: ''
  });

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    const card: Card = {
      id: Date.now().toString(),
      cardNumber: `****-****-****-${newCard.cardNumber.slice(-4)}`,
      cardType: newCard.cardType,
      expiryDate: newCard.expiryDate,
      isActive: true,
      authorizedUsers: []
    };
    setCards([...cards, card]);
    setNewCard({ cardNumber: '', cardType: '', expiryDate: '' });
    setShowAddCard(false);
  };

  const toggleCardStatus = (cardId: string) => {
    setCards(cards.map(card => 
      card.id === cardId ? { ...card, isActive: !card.isActive } : card
    ));
  };

  const getAuthorizedUserNames = (userIds: string[]) => {
    return userIds.map(id => {
      const user = authorizedUsers.find(u => u.id === id);
      return user ? user.name : 'Unknown User';
    }).join(', ');
  };

  const getCardIcon = (cardType: string) => {
    if (cardType.toLowerCase().includes('visa')) return '💳';
    if (cardType.toLowerCase().includes('mastercard')) return '💳';
    if (cardType.toLowerCase().includes('amex')) return '💳';
    return '💳';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Debit Cards</h1>
          <p className="text-gray-600">Manage your debit cards and security settings</p>
        </div>
        <button
          onClick={() => setShowAddCard(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Card</span>
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div key={card.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Card Header */}
            <div className={`p-6 ${card.isActive ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gray-500'} text-white`}>
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{getCardIcon(card.cardType)}</div>
                <button className="p-1 hover:bg-white/10 rounded">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-mono">{card.cardNumber}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{card.cardType}</span>
                  <span className="text-sm">Exp: {card.expiryDate}</span>
                </div>
              </div>
            </div>

            {/* Card Details */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      card.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {card.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => toggleCardStatus(card.id)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Toggle
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Authorized Users</span>
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600">
                    {card.authorizedUsers.length > 0 
                      ? getAuthorizedUserNames(card.authorizedUsers)
                      : 'No authorized users'
                    }
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Facial Recognition Enabled</span>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-6 flex space-x-2">
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>Users</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Card Modal */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Debit Card</h2>
            <form onSubmit={handleAddCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Type
                </label>
                <select
                  value={newCard.cardType}
                  onChange={(e) => setNewCard({ ...newCard, cardType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select card type</option>
                  <option value="Visa Platinum">Visa Platinum</option>
                  <option value="Visa Gold">Visa Gold</option>
                  <option value="Mastercard Platinum">Mastercard Platinum</option>
                  <option value="Mastercard Gold">Mastercard Gold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={newCard.expiryDate}
                  onChange={(e) => setNewCard({ ...newCard, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;