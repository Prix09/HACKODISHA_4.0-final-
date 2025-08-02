export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountNumber: string;
}

export interface Card {
  id: string;
  cardNumber: string;
  cardType: string;
  expiryDate: string;
  isActive: boolean;
  authorizedUsers: string[];
}

export interface AuthorizedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  facialDataEncoded: boolean;
  enrollmentDate: string;
  isActive: boolean;
  cardAccess: string[];
}

export interface Transaction {
  id: string;
  cardId: string;
  userId: string;
  amount: number;
  location: string;
  timestamp: string;
  status: 'approved' | 'denied' | 'pending';
  verificationMethod: 'facial_recognition' | 'manual_approval';
}

export interface FacialRecognitionResult {
  match: boolean;
  confidence: number;
  userId?: string;
}