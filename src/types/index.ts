export interface FoodItem {
  code: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface OutletInfo {
  name: string;
  address: string;
  distance: string;
  isOpen: boolean;
  operatingHours: string;
  totalOutlets: number;
}

export interface GeneratedCode {
  id: string;
  foodItem: FoodItem;
  outletInfo: OutletInfo;
  qrCode: string;
  generatedAt: Date;
  expiresAt: Date;
}