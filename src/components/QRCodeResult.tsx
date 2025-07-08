import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Copy, MapPin, Clock, CreditCard, Shield, RotateCcw, CheckCircle } from 'lucide-react';
import { GeneratedCode } from '../types';
import JsBarcode from 'jsbarcode';

interface QRCodeResultProps {
  generatedCode: GeneratedCode;
  onBack: () => void;
  onRefresh: () => void;
}

export default function QRCodeResult({ generatedCode, onBack, onRefresh }: QRCodeResultProps) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [barcodeDataURL, setBarcodeDataURL] = useState<string>('');

  useEffect(() => {
    // Generate simple barcode from product code + price
    const barcodeData = `${generatedCode.foodItem.code}${generatedCode.foodItem.price}`;
    
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, barcodeData, {
      format: "CODE128",
      width: 2,
      height: 128,
      displayValue: false,
      background: "#ffffff",
      lineColor: "#000000",
      margin: 5,
    });
    
    // Create vertical barcode by rotating the canvas
    const rotatedCanvas = document.createElement('canvas');
    const ctx = rotatedCanvas.getContext('2d');
    
    // Set rotated canvas dimensions (swap width and height)
    rotatedCanvas.width = canvas.height + 10; // Add padding
    rotatedCanvas.height = 128; // Fixed height same as QR code area
    
    if (ctx) {
      // Rotate 90 degrees clockwise
      ctx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);
    }
    
    setBarcodeDataURL(rotatedCanvas.toDataURL());
  }, [generatedCode.foodItem.code, generatedCode.foodItem.price]);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = generatedCode.expiresAt.getTime() - now.getTime();
      
      if (diff > 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft('00:00');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [generatedCode.expiresAt]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode.foodItem.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-800">Telah Ditukarkan</h1>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <span className="text-sm text-gray-500">Masa berlaku</span>
              <div className="flex space-x-1">
                {timeLeft.split('').map((char, index) => (
                  <span
                    key={index}
                    className="bg-black text-white px-1 py-0.5 rounded text-xs font-mono min-w-[16px] text-center"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Product Info */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-200">
              {generatedCode.foodItem.image ? (
                <img
                  src={generatedCode.foodItem.image || '/unnamed.png'}
                  alt={generatedCode.foodItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-yellow-100 flex items-center justify-center">
                  <div className="w-8 h-6 bg-yellow-400 rounded"></div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-800">{generatedCode.foodItem.name}</h2>
              <p className="text-sm text-gray-500 mt-1">Tersedia selama jam operasional</p>
              <p className="text-lg font-bold text-gray-800 mt-2">
                Rp{formatPrice(generatedCode.foodItem.price)}
              </p>
            </div>
          </div>
        </div>

        {/* Coupon Count */}
        <div className="text-center">
          <span className="text-lg font-medium text-gray-700">Jumlah Kupon yang ditukarkan: </span>
          <span className="text-lg font-bold text-red-500">1</span>
        </div>

        {/* QR Code */}
        <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <img
                src={generatedCode.qrCode}
                alt="QR Code"
                className="w-32 h-32 sm:w-40 sm:h-40 border border-gray-200 rounded-lg"
              />
            </div>
            <div className="flex flex-col items-center flex-shrink-0">
              <img
                src={barcodeDataURL}
                alt="Barcode"
                className="border border-gray-200 rounded-lg bg-white w-16 h-32"
              />
            </div>
          </div>
          
          <button
            onClick={onRefresh}
            className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mx-auto mb-4"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Muat Ulang</span>
          </button>

          <p className="text-sm text-gray-500 mb-4">
            Kode QR akan kedaluwarsa dalam 10 menit. Muat ulang untuk memperbarui.
          </p>

          <div className="flex items-center justify-center space-x-2 bg-gray-50 rounded-lg p-3">
            <span className="text-sm font-medium text-gray-700">Kode</span>
            <span className="font-mono text-sm font-bold">{generatedCode.foodItem.code}</span>
            <button
              onClick={handleCopyCode}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
        </div>

        {/* Outlet Info */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Bisa ditukar di {generatedCode.outletInfo.totalOutlets} gerai</h3>
            <span className="text-sm text-gray-500">Lihat semua ›</span>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{generatedCode.outletInfo.name}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {generatedCode.outletInfo.address}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  generatedCode.outletInfo.isOpen 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {generatedCode.outletInfo.isOpen ? 'Buka' : 'Tutup'}
                </span>
                <span className="text-xs text-gray-500">{generatedCode.outletInfo.operatingHours}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">{generatedCode.outletInfo.distance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4">Syarat dan Ketentuan</h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">Masa Penukaran</h4>
                <p className="text-sm text-gray-500">Berlaku selama 30 hari</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <CreditCard className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">Batas pembelian</h4>
                <p className="text-sm text-gray-500">Maksimal 1 item per hari</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">Waktu Penggunaan</h4>
                <p className="text-sm text-gray-500">Tersedia selama jam operasional</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <RotateCcw className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">Kebijakan Pengembalian</h4>
                <p className="text-sm text-gray-500">Pengembalian dana tidak dapat dilakukan setelah pemesanan</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-gray-700">Aturan Penggunaan</h4>
                <div className="text-sm text-gray-500 space-y-1 mt-1">
                  <p>1. Harus datang ke toko</p>
                  <p>2. Jika sebagian item tidak tersedia karena musim atau faktor tak terduga lainnya, penjual akan menggantinya dengan item sejenis. Untuk informasi lebih lanjut, silakan diskusikan dengan penjual</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

  );
}