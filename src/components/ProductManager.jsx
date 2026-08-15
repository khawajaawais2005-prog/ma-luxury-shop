import React, { useState } from 'react';

export default function ProductManager({ product }) {
  const [price, setPrice] = useState(product?.originalPrice || 7500);
  const [salePrice, setSalePrice] = useState(product?.salePrice || 5500);
  const [isOnSale, setIsOnSale] = useState(product?.isOnSale || false);
  const [images, setImages] = useState(product?.images || ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500"]);

  // Computer se file select karne ka function
  const handleImageAdd = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Local link banana photo ka
      setImages([...images, imageUrl]); // List me add karna
    }
  };

  const handlePriceUpdate = () => {
    alert(`Database Updated! Standard Price: ${price} PKR | Sale: ${isOnSale ? salePrice : 'Off'}`);
  };

  const deleteImage = (indexToDelete) => {
    setImages(images.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="bg-[#121214] border border-[#BA963E]/20 p-6 rounded-2xl text-white shadow-2xl backdrop-blur-md">
      <h2 className="text-xl font-serif text-[#E5C158] mb-4 tracking-wide border-b border-white/5 pb-3">
        Edit Product Authority Panel
      </h2>

      {/* Image Gallery */}
      <div className="mb-6">
        <label className="text-xs text-gray-400 block mb-2 uppercase tracking-widest">Product Images (Hover to Delete)</label>
        <div className="flex gap-4 overflow-x-auto py-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative group min-w-[90px] h-[90px] border border-white/5 rounded-xl overflow-hidden shadow-md">
              <img src={img} alt="product" className="w-full h-full object-cover" />
              <button onClick={() => deleteImage(idx)} className="absolute inset-0 bg-red-600/80 text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs">
                Delete
              </button>
            </div>
          ))}
          
          {/* Asli Hidden File Input jo click karne pr computer files khole ga */}
          <label className="min-w-[90px] h-[90px] border border-dashed border-[#BA963E]/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-[#BA963E]/10 text-[#E5C158] transition-all text-xs font-medium">
            <span>+ Add</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageAdd} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* Pricing Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-[10px] text-gray-400 block mb-1 uppercase tracking-wider">Standard Price (PKR)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-[#1A1A1D] border border-white/5 rounded-xl p-3 text-[#E5C158] focus:outline-none focus:border-[#BA963E]/50 font-medium" />
        </div>
        <div>
          <label className="text-[10px] text-gray-400 block mb-1 uppercase tracking-wider">Sale Event Price (PKR)</label>
          <input type="number" value={salePrice} disabled={!isOnSale} onChange={(e) => setSalePrice(e.target.value)} className={`w-full bg-[#1A1A1D] border border-white/5 rounded-xl p-3 text-[#E5C158] focus:outline-none focus:border-[#BA963E]/50 font-medium ${!isOnSale && 'opacity-30'}`} />
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between bg-[#1A1A1D] p-4 rounded-xl mb-6 border border-white/5">
        <div>
          <span className="text-xs font-medium block text-white uppercase tracking-wide">Activate Special Occasion Sale</span>
          <span className="text-[11px] text-gray-500">Force sale prices live right away.</span>
        </div>
        <input type="checkbox" checked={isOnSale} onChange={(e) => setIsOnSale(e.target.checked)} className="w-5 h-5 accent-[#BA963E] cursor-pointer rounded" />
      </div>

      <button onClick={handlePriceUpdate} className="w-full bg-gradient-to-r from-[#BA963E] to-[#E5C158] text-black font-bold py-3.5 rounded-xl uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-lg shadow-[#BA963E]/10">
        Save Changes & Push Live
      </button>
    </div>
  );
}