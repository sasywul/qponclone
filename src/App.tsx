import React, { useState } from 'react';
import InputForm from './components/InputForm';
import QRCodeResult from './components/QRCodeResult';
import { FoodItem, OutletInfo, GeneratedCode } from './types';
import { generateQRCode } from './utils/qrGenerator';

function App() {
  const [currentView, setCurrentView] = useState<'input' | 'result'>('input');
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);

  const handleFormSubmit = async (foodItem: FoodItem, outletInfo: OutletInfo) => {
    try {
      const code = await generateQRCode(foodItem, outletInfo);
      setGeneratedCode(code);
      setCurrentView('result');
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const handleBack = () => {
    setCurrentView('input');
    setGeneratedCode(null);
  };

  const handleRefresh = async () => {
    if (generatedCode) {
      try {
        const newCode = await generateQRCode(generatedCode.foodItem, generatedCode.outletInfo);
        setGeneratedCode(newCode);
      } catch (error) {
        console.error('Error refreshing QR code:', error);
      }
    }
  };

  if (currentView === 'result' && generatedCode) {
    return (
      <QRCodeResult
        generatedCode={generatedCode}
        onBack={handleBack}
        onRefresh={handleRefresh}
      />
    );
  }

  return <InputForm onSubmit={handleFormSubmit} />;
}

export default App;