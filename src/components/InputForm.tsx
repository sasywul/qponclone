import React, { useState } from 'react';
import { ArrowRight, Package, DollarSign, FileText, Upload, X, Image, MapPin, Clock, Building } from 'lucide-react';
import { FoodItem, OutletInfo } from '../types';

interface InputFormProps {
  onSubmit: (foodItem: FoodItem, outletInfo: OutletInfo) => void;
}

export default function InputForm({ onSubmit }: InputFormProps) {
  const [formData, setFormData] = useState<FoodItem>({
    code: '',
    name: '',
    price: 0,
    description: '',
    image: undefined
  });

  const [outletData, setOutletData] = useState<OutletInfo>({
    name: '',
    address: '',
    distance: "1km",
    isOpen: true,
    operatingHours: '00:00-22:00',
    totalOutlets: 99
  });

  const [errors, setErrors] = useState<Partial<FoodItem>>({});
  const [outletErrors, setOutletErrors] = useState<Partial<OutletInfo>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<FoodItem> = {};
    const newOutletErrors: Partial<OutletInfo> = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Kode produk wajib diisi';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nama makanan wajib diisi';
    }



    if (!outletData.name.trim()) {
      newOutletErrors.name = 'Nama outlet wajib diisi';
    }

    if (!outletData.address.trim()) {
      newOutletErrors.address = 'Alamat outlet wajib diisi';
    }

    setErrors(newErrors);
    setOutletErrors(newOutletErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newOutletErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData, outletData);
    }
  };

  const handleInputChange = (field: keyof FoodItem, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleOutletChange = (field: keyof OutletInfo, value: string | number | boolean) => {
    setOutletData(prev => ({ ...prev, [field]: value }));
    if (outletErrors[field]) {
      setOutletErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: undefined }));
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Generator Kode QR</h1>
          <p className="text-gray-600">Masukkan detail makanan untuk membuat QR code</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kode Produk
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan kode produk"
              />
            </div>
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Makanan
            </label>
            <div className="relative">
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Contoh: Kopi & Roti"
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Harga
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.price || ''}
                onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="5000"
                min="1"
              />
            </div>
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Produk (Opsional)
            </label>
            
            {!imagePreview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 ${
                  isDragOver ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center space-y-2">
                  <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Klik untuk unggah atau seret & lepas
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, JPEG hingga 10MB
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Image className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Gambar berhasil diunggah
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Gambar akan ditampilkan di kode QR
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Outlet Information Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <span>Informasi Outlet</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Outlet
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={outletData.name}
                    onChange={(e) => handleOutletChange('name', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      outletErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Contoh: Roti'O - Stasiun Tawang 2"
                  />
                </div>
                {outletErrors.name && <p className="text-red-500 text-sm mt-1">{outletErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Lengkap
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    value={outletData.address}
                    onChange={(e) => handleOutletChange('address', e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none ${
                      outletErrors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Jl. Taman Tawang No.1, Tj. Mas, Kec. Semarang..."
                    rows={2}
                  />
                </div>
                {outletErrors.address && <p className="text-red-500 text-sm mt-1">{outletErrors.address}</p>}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Buat Kode QR</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}