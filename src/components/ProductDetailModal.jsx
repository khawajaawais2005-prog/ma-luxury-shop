import React, { useState, useEffect } from 'react';

export default function ProductDetailModal({ product, isOpen, onClose, onAddToCart }) {
  if (!isOpen || !product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image || 'https://via.placeholder.com/300'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');

  // Touch gesture state for mobile swiping
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Reset index when product changes or modal opens
  useEffect(() => {
    setCurrentIndex(0);
  }, [product]);

  // Keyboard Left / Right arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      handleNext();
    }
    if (isRightSwipe && images.length > 1) {
      handlePrev();
    }
  };

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      selectedSize,
      selectedColor,
      image: images[currentIndex]
    };
    onAddToCart(itemToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#121214] border border-[#BA963E]/40 rounded-3xl max-w-2xl w-full p-6 space-y-6 relative shadow-2xl text-white">
        
        {/* Close Modal Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold cursor-pointer z-20"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* LEFT: IMAGE CAROUSEL WITH NAVIGATION & THUMBNAILS */}
          <div className="space-y-3">
            <div 
              className="relative group h-64 rounded-2xl overflow-hidden border border-white/10 bg-black flex items-center justify-center select-none"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img 
                src={images[currentIndex]} 
                alt={product.name} 
                className="w-full h-full object-cover transition-all duration-300 pointer-events-none"
              />

              {/* LEFT / RIGHT CAROUSEL ARROWS */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2 bg-black/70 text-[#E5C158] hover:bg-[#BA963E] hover:text-black w-8 h-8 rounded-full font-bold transition-all flex items-center justify-center shadow-md cursor-pointer border border-white/10"
                    title="Previous Image"
                  >
                    ❮
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2 bg-black/70 text-[#E5C158] hover:bg-[#BA963E] hover:text-black w-8 h-8 rounded-full font-bold transition-all flex items-center justify-center shadow-md cursor-pointer border border-white/10"
                    title="Next Image"
                  >
                    ❯
                  </button>
                </>
              )}

              {/* IMAGE COUNTER BADGE */}
              {images.length > 1 && (
                <span className="absolute bottom-2 right-2 bg-black/80 text-[#E5C158] text-[10px] px-2.5 py-0.5 rounded-full font-mono border border-[#BA963E]/30">
                  {currentIndex + 1} / {images.length}
                </span>
              )}
            </div>

            {/* THUMBNAILS LIST */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      currentIndex === idx ? 'border-[#E5C158] scale-105' : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`thumbnail-${idx}`} className="w-full h-full object-cover pointer-events-none" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: PRODUCT DETAILS, SIZES & COLORS */}
          <div className="space-y-4 text-xs">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#E5C158]">{product.name}</h2>
              <p className="text-xl font-bold text-white mt-1">
                PKR {(product.salePrice || product.price || product.originalPrice)?.toLocaleString()}
              </p>
            </div>

            {/* DISPATCH / WAREHOUSE ADDRESS */}
            {product.storeAddress && (
              <p className="text-[11px] text-gray-400 bg-[#1A1A1D] p-2.5 rounded-xl border border-white/5">
                📍 <strong>Dispatch Location:</strong> {product.storeAddress}
              </p>
            )}

            {/* COLOR SELECTION */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold block">🎨 Select Color:</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                        selectedColor === color 
                          ? 'bg-[#BA963E] text-black border-[#E5C158]' 
                          : 'bg-[#1A1A1D] text-gray-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SIZE SELECTION */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold block">📏 Select Size:</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 rounded-xl font-bold border flex items-center justify-center transition-all cursor-pointer ${
                        selectedSize === size 
                          ? 'bg-[#BA963E] text-black border-[#E5C158]' 
                          : 'bg-[#1A1A1D] text-gray-300 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-[#BA963E] to-[#E5C158] text-black font-bold py-3 rounded-xl uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer mt-4 shadow-md"
            >
              Add Selected Variant to Cart 🛒
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}