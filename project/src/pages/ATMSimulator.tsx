import React, { useState, useRef } from 'react';
import { Camera, CreditCard, Lock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Card, AuthorizedUser, Transaction, FacialRecognitionResult } from '../types';

interface ATMSimulatorProps {
  cards: Card[];
  authorizedUsers: AuthorizedUser[];
  onTransaction: (transaction: Transaction) => void;
}

const ATMSimulator: React.FC<ATMSimulatorProps> = ({ cards, authorizedUsers, onTransaction }) => {
  const [currentStep, setCurrentStep] = useState<'card' | 'camera' | 'amount' | 'result'>('card');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<FacialRecognitionResult | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const simulateFacialRecognition = (): FacialRecognitionResult => {
    // Simulate facial recognition with random results
    const random = Math.random();
    if (random > 0.7) {
      // Authorized user recognized
      const authorizedUser = authorizedUsers.find(user => 
        user.isActive && 
        user.facialDataEncoded && 
        selectedCard && 
        user.cardAccess.includes(selectedCard.id)
      );
      if (authorizedUser) {
        return {
          match: true,
          confidence: 0.85 + Math.random() * 0.15,
          userId: authorizedUser.id
        };
      }
    }
    
    // Unauthorized or no match
    return {
      match: false,
      confidence: 0.3 + Math.random() * 0.4
    };
  };

  const handleCardSelection = (card: Card) => {
    setSelectedCard(card);
    setCurrentStep('camera');
  };

  const handleCameraCapture = async () => {
    setIsCapturing(true);
    setIsProcessing(true);

    // Simulate camera capture and processing delay
    setTimeout(() => {
      const result = simulateFacialRecognition();
      setRecognitionResult(result);
      setIsCapturing(false);
      setIsProcessing(false);
      
      if (result.match) {
        setCurrentStep('amount');
      } else {
        setCurrentStep('result');
      }
    }, 3000);
  };

  const handleTransaction = () => {
    if (!selectedCard || !amount) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      cardId: selectedCard.id,
      userId: recognitionResult?.userId || 'unknown',
      amount: parseFloat(amount),
      location: 'ATM - Demo Location',
      timestamp: new Date().toISOString(),
      status: recognitionResult?.match ? 'approved' : 'pending',
      verificationMethod: recognitionResult?.match ? 'facial_recognition' : 'manual_approval'
    };

    onTransaction(transaction);
    setCurrentStep('result');
  };

  const resetATM = () => {
    setCurrentStep('card');
    setSelectedCard(null);
    setAmount('');
    setRecognitionResult(null);
    setIsProcessing(false);
    setIsCapturing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ATM Simulator</h1>
        <p className="text-gray-600">Test the facial recognition security system</p>
      </div>

      {/* ATM Interface */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl">
          {/* ATM Screen */}
          <div className="bg-black rounded-lg p-6 mb-6">
            <div className="bg-blue-900 text-blue-100 p-4 rounded-lg min-h-[400px]">
              {currentStep === 'card' && (
                <div className="text-center space-y-6">
                  <CreditCard className="h-16 w-16 mx-auto text-blue-300" />
                  <h2 className="text-xl font-bold">Select Your Card</h2>
                  <p className="text-blue-200">Choose the card you want to use for the transaction</p>
                  <div className="space-y-3">
                    {cards.filter(card => card.isActive).map((card) => (
                      <button
                        key={card.id}
                        onClick={() => handleCardSelection(card)}
                        className="w-full bg-blue-800 hover:bg-blue-700 p-4 rounded-lg text-left transition-colors"
                      >
                        <div className="font-medium">{card.cardType}</div>
                        <div className="text-sm text-blue-300">{card.cardNumber}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'camera' && (
                <div className="text-center space-y-6">
                  <Camera className="h-16 w-16 mx-auto text-blue-300" />
                  <h2 className="text-xl font-bold">Facial Recognition</h2>
                  <p className="text-blue-200">Please look at the camera for identity verification</p>
                  
                  <div className="bg-gray-700 rounded-lg p-4 h-48 flex items-center justify-center">
                    {isCapturing ? (
                      <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-blue-200">Processing facial recognition...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400">Camera Preview</p>
                      </div>
                    )}
                  </div>

                  {!isCapturing && !isProcessing && (
                    <button
                      onClick={handleCameraCapture}
                      className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Capture & Verify
                    </button>
                  )}
                </div>
              )}

              {currentStep === 'amount' && (
                <div className="text-center space-y-6">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-400" />
                  <h2 className="text-xl font-bold">Identity Verified</h2>
                  <p className="text-blue-200">Welcome! Enter the withdrawal amount</p>
                  
                  <div className="space-y-4">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full bg-blue-800 text-white px-4 py-3 rounded-lg text-center text-xl"
                    />
                    
                    <div className="grid grid-cols-3 gap-2">
                      {[20, 40, 60, 80, 100, 200].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setAmount(preset.toString())}
                          className="bg-blue-800 hover:bg-blue-700 py-2 rounded text-sm transition-colors"
                        >
                          ${preset}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={handleTransaction}
                      disabled={!amount}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 py-3 rounded-lg font-medium transition-colors"
                    >
                      Withdraw ${amount}
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'result' && (
                <div className="text-center space-y-6">
                  {recognitionResult?.match ? (
                    <>
                      <CheckCircle className="h-16 w-16 mx-auto text-green-400" />
                      <h2 className="text-xl font-bold text-green-400">Transaction Approved</h2>
                      <div className="bg-green-900/30 p-4 rounded-lg">
                        <p className="text-green-200">Withdrawal of ${amount} has been processed successfully.</p>
                        <p className="text-sm text-green-300 mt-2">
                          Confidence: {((recognitionResult.confidence || 0) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-16 w-16 mx-auto text-red-400" />
                      <h2 className="text-xl font-bold text-red-400">Identity Not Verified</h2>
                      <div className="bg-red-900/30 p-4 rounded-lg">
                        <p className="text-red-200">Transaction has been flagged for manual review.</p>
                        <p className="text-sm text-red-300 mt-2">
                          The account holder will be notified via email.
                        </p>
                      </div>
                    </>
                  )}
                  
                  <button
                    onClick={resetATM}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Start New Transaction
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ATM Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={resetATM}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <Lock className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Secure Connection</p>
            <p className="text-sm text-gray-600">256-bit encryption</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <Camera className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Facial Recognition</p>
            <p className="text-sm text-gray-600">AI-powered security</p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-center">
            <AlertTriangle className="h-8 w-8 mx-auto text-orange-600 mb-2" />
            <p className="font-medium text-gray-900">Real-time Monitoring</p>
            <p className="text-sm text-gray-600">24/7 fraud detection</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATMSimulator;