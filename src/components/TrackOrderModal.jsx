import React, { useState } from 'react';

export default function TrackOrderModal({ isOpen, onClose }) {
  const [trackId, setTrackId] = useState('');
  const [foundOrder, setFoundOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTrack = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setFoundOrder(null);

    // Clean tracking query input
    const cleanId = trackId.trim().toUpperCase().replace(/\s+/g, '');

    if (!cleanId) {
      setErrorMsg('Meharbani karke Order ID enter karein.');
      return;
    }

    // Fetch live orders across all synced localStorage keys
    const allOrders = JSON.parse(localStorage.getItem('ma_all_customer_orders') || '[]');
    const customerOrders = JSON.parse(localStorage.getItem('ma_customer_orders') || '[]');
    const legacyOrders = JSON.parse(localStorage.getItem('ma_placed_orders') || '[]');

    // Combine all orders & remove duplicates
    const combinedOrders = [...allOrders, ...customerOrders, ...legacyOrders];

    // Search and match order ID (Checks orderId, id, and trackingCode)
    const matched = combinedOrders.find((order) => {
      const targetId = (order.orderId || order.id || order.trackingCode || '').toString().toUpperCase().replace(/\s+/g, '');
      if (!targetId) return false;

      // Handle raw digits or MA- prefix comparison
      const formattedClean = cleanId.startsWith('MA-') ? cleanId : `MA-${cleanId}`;
      const formattedTarget = targetId.startsWith('MA-') ? targetId : `MA-${targetId}`;

      return targetId === cleanId || formattedTarget === formattedClean;
    });

    if (matched) {
      setFoundOrder(matched);
    } else {
      setErrorMsg(`Order ID "${trackId}" nahi mili! Pehle Checkout se Order place karein.`);
    }
  };

  const handleClose = () => {
    setFoundOrder(null);
    setErrorMsg('');
    setTrackId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#121214] border border-[#BA963E]/40 rounded-3xl max-w-md w-full p-6 space-y-5 relative shadow-2xl text-white">
        
        {/* Close Button */}
        <button 
          onClick={handleClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg font-bold cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-serif font-bold text-[#E5C158] uppercase tracking-wider">
            📍 Track Your Order
          </h3>
          <p className="text-xs text-gray-400">
            Apni Order ID enter karein (e.g. MA-43245101)
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleTrack} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter Order ID..." 
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            className="flex-1 bg-[#1A1A1D] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white uppercase focus:outline-none focus:border-[#BA963E]"
          />
          <button 
            type="submit" 
            className="bg-[#BA963E] hover:bg-[#E5C158] text-black font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Track
          </button>
        </form>

        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-xl text-center font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Details Card */}
        {foundOrder && (
          <div className="bg-[#1A1A1D] border border-[#BA963E]/30 rounded-2xl p-4 space-y-3 text-xs animate-fade-in">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="font-bold text-[#E5C158] font-mono">
                Order #{foundOrder.orderId || foundOrder.id}
              </span>
              <span className="bg-[#BA963E]/20 text-[#E5C158] border border-[#BA963E]/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase">
                ● {foundOrder.status || 'Pending Verification'}
              </span>
            </div>

            <div className="space-y-1 text-gray-300 text-[11px]">
              <p>👤 <strong>Customer:</strong> {foundOrder.customer?.fullName || foundOrder.fullName || 'N/A'}</p>
              <p>📞 <strong>Phone:</strong> {foundOrder.customer?.phone || foundOrder.phone || 'N/A'}</p>
              <p>📍 <strong>Address:</strong> {foundOrder.customer?.address || foundOrder.address || 'N/A'}</p>
              <p>💳 <strong>Payment Mode:</strong> {foundOrder.paymentType || foundOrder.customer?.paymentMethod || 'Advance/COD'}</p>
              <p>💰 <strong>Total Amount:</strong> <span className="text-[#E5C158] font-bold">{foundOrder.totalAmount || foundOrder.total || 0} PKR</span></p>
            </div>

            <div className="border-t border-white/10 pt-2 space-y-1">
              <p className="font-bold text-gray-400 text-[10px] uppercase">Items Ordered:</p>
              <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                {(foundOrder.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-gray-300 text-[11px] bg-black/20 p-1.5 rounded-lg">
                    <span>• {item.name} (x{item.quantity || 1})</span>
                    <span className="text-[#E5C158] font-mono">{item.finalPrice * (item.quantity || 1)} PKR</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}