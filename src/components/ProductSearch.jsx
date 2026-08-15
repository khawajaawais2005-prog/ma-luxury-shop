import React, { useState } from 'react';

export default function ProductSearch({ products, onSelectProduct }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Instant filter on typing
  const filteredProducts = searchTerm.trim() === '' 
    ? [] 
    : products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()))
      );

  return (
    <div className="relative w-full max-w-lg mx-auto font-sans z-40 my-4">
      
      {/* Search Input Field */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="🔍 Search luxury products, categories..."
          className="w-full bg-[#121214] border border-[#BA963E]/40 text-white text-xs sm:text-sm rounded-2xl py-3 pl-4 pr-10 shadow-lg focus:outline-none focus:border-[#E5C158] transition-all placeholder:text-gray-500"
        />

        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 text-gray-400 hover:text-white text-xs bg-white/10 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Instant Dropdown Results */}
      {isFocused && searchTerm.trim() !== '' && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-[#121214] border border-[#BA963E]/40 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto divide-y divide-white/5 z-50">
          
          {filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-400">
              ❌ No products found matching "<span className="text-[#E5C158]">{searchTerm}</span>"
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id || product.name}
                onClick={() => {
                  if (onSelectProduct) onSelectProduct(product);
                  setSearchTerm('');
                  setIsFocused(false);
                }}
                className="p-3 hover:bg-white/[0.05] transition-all cursor-pointer flex items-center gap-3"
              >
                {/* Product Image */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-xl border border-white/10"
                  />
                ) : (
                  <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xs">
                    📦
                  </div>
                )}

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{product.name}</h4>
                  <p className="text-[10px] text-gray-400 truncate">
                    {product.category || 'Luxury Collection'}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right">
                  <span className="text-xs font-bold text-[#E5C158] block">
                    Rs. {product.price?.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Outside Click Overlay to close dropdown */}
      {isFocused && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => setIsFocused(false)} 
        />
      )}
    </div>
  );
}