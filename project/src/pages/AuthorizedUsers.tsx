import React, { useState } from 'react';
import { Users, Plus, Camera, Shield, CheckCircle, XCircle, Edit, Trash2 } from 'lucide-react';
import { AuthorizedUser, Card } from '../types';

interface AuthorizedUsersProps {
  authorizedUsers: AuthorizedUser[];
  setAuthorizedUsers: (users: AuthorizedUser[]) => void;
  cards: Card[];
}

const AuthorizedUsers: React.FC<AuthorizedUsersProps> = ({ 
  authorizedUsers, 
  setAuthorizedUsers, 
  cards 
}) => {
  const [showAddUser, setShowAddUser] = useState(false);
  const [showFacialEnrollment, setShowFacialEnrollment] = useState(false);
  const [currentEnrollmentUser, setCurrentEnrollmentUser] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    cardAccess: [] as string[]
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: AuthorizedUser = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      facialDataEncoded: false,
      enrollmentDate: new Date().toISOString().split('T')[0],
      isActive: true,
      cardAccess: newUser.cardAccess
    };
    setAuthorizedUsers([...authorizedUsers, user]);
    setNewUser({ name: '', email: '', phone: '', cardAccess: [] });
    setShowAddUser(false);
    setCurrentEnrollmentUser(user.id);
    setShowFacialEnrollment(true);
  };

  const handleFacialEnrollment = () => {
    if (currentEnrollmentUser) {
      setAuthorizedUsers(authorizedUsers.map(user => 
        user.id === currentEnrollmentUser 
          ? { ...user, facialDataEncoded: true }
          : user
      ));
      setShowFacialEnrollment(false);
      setCurrentEnrollmentUser(null);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setAuthorizedUsers(authorizedUsers.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setAuthorizedUsers(authorizedUsers.filter(user => user.id !== userId));
  };

  const getCardNames = (cardIds: string[]) => {
    return cardIds.map(id => {
      const card = cards.find(c => c.id === id);
      return card ? `${card.cardType} (${card.cardNumber})` : 'Unknown Card';
    }).join(', ');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Authorized Users</h1>
          <p className="text-gray-600">Manage users who can access your debit cards</p>
        </div>
        <button
          onClick={() => setShowAddUser(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {authorizedUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* User Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => toggleUserStatus(user.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Edit className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Facial Recognition</span>
                <div className="flex items-center space-x-1">
                  {user.facialDataEncoded ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-xs ${user.facialDataEncoded ? 'text-green-600' : 'text-red-600'}`}>
                    {user.facialDataEncoded ? 'Enrolled' : 'Not Enrolled'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">Phone</span>
                <p className="text-sm text-gray-600">{user.phone}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">Enrolled</span>
                <p className="text-sm text-gray-600">{new Date(user.enrollmentDate).toLocaleDateString()}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-700">Card Access</span>
                <p className="text-sm text-gray-600">
                  {user.cardAccess.length > 0 
                    ? `${user.cardAccess.length} card(s)`
                    : 'No cards assigned'
                  }
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex space-x-2">
              {!user.facialDataEncoded && (
                <button
                  onClick={() => {
                    setCurrentEnrollmentUser(user.id);
                    setShowFacialEnrollment(true);
                  }}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-1"
                >
                  <Camera className="h-4 w-4" />
                  <span>Enroll Face</span>
                </button>
              )}
              <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1">
                <Shield className="h-4 w-4" />
                <span>Manage</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Authorized User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Access
                </label>
                <div className="space-y-2">
                  {cards.map((card) => (
                    <label key={card.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newUser.cardAccess.includes(card.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewUser({ ...newUser, cardAccess: [...newUser.cardAccess, card.id] });
                          } else {
                            setNewUser({ ...newUser, cardAccess: newUser.cardAccess.filter(id => id !== card.id) });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{card.cardType} ({card.cardNumber})</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Facial Enrollment Modal */}
      {showFacialEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Facial Recognition Enrollment</h2>
            <div className="text-center space-y-4">
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <Camera className="h-16 w-16 text-gray-400" />
              </div>
              <p className="text-gray-600">
                Position your face in the camera frame and follow the on-screen instructions.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowFacialEnrollment(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFacialEnrollment}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Complete Enrollment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorizedUsers;