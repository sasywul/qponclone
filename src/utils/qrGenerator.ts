import QRCode from 'qrcode';
import { FoodItem, OutletInfo, GeneratedCode } from '../types';

export const generateQRCode = async (foodItem: FoodItem, outletInfo: OutletInfo): Promise<GeneratedCode> => {
  // Generate unique ID
  const id = Math.random().toString(36).substr(2, 9).toUpperCase();
  
  // Set default outlet values
  const defaultOutletInfo: OutletInfo = {
    name: outletInfo.name,
    address: outletInfo.address,
    distance: "1km",
    isOpen: true,
    operatingHours: "00:00-23:59",
    totalOutlets: 99
  };
  
  // Create simple QR data
  const qrData = {
    code: foodItem.code,
    name: foodItem.name,
    price: foodItem.price,
    outlet: defaultOutletInfo.name,
    timestamp: new Date().toISOString()
  };
  
  // Generate QR code image
  const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });

  // Set expiration time (10 minutes from now)
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 48)

  return {
    id,
    foodItem: {
      ...foodItem,
            image: foodItem.image || '/unnamed.png', 
      description: 'Tersedia selama jam buka'
    },
    outletInfo: defaultOutletInfo,
    qrCode: qrCodeDataURL,
    generatedAt: new Date(),
    expiresAt
  };
};