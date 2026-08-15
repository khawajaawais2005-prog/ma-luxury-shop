import React, { useState, useEffect } from 'react';

export default function CustomerOrders() {
  const [orders] = useState(() => {
    const saved = localStorage.getItem('ma_customer_orders');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'MA-90821', 
        date: '2026-08-10', 
        total: 8500, 
        status: 'In Transit', 
        trackingCode: 'TCS-889102', 
        courier: 'TCS Express', 
        items: 2,
        address: 'House #42, Street 10, F-8/3, Islamabad'
      },
      { 
        id: 'MA-88120', 
        date: '2026-07-28', 
        total: 14200, 
        status: 'Delivered', 
        trackingCode: 'MNP-441029', 
        courier: 'M&P Courier', 
        items: 3,
        address: 'House #42, Street 10, F-8/3, Islamabad'
      }
    ];
  });

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    localStorage.setItem('ma_customer_orders', JSON.stringify(orders));
  }, [orders]);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const copyTrackingCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="space-y-4 text-xs text-gray-200 font-sans">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-[#E5C158] uppercase tracking-wider text-sm flex items-center gap-2">
          <span>📦</span> Purchase History & Live Tracker
        </h3>
        <span className="text-[10px] text-gray-400 font-mono">
          {orders.length} Total Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-black/30 p-8 rounded-2xl border border-white/5 text-center text-gray-500 space-y-2">
          <p className="text-2xl">🛍️</p>
          <p className="font-bold text-gray-400">No orders placed yet!</p>
          <p className="text-[11px]">Your completed purchases and tracking status will appear here persistence-linked.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;
            return (
              <div 
                key={ord.id} 
                onClick={() => toggleExpand(ord.id)}
                className={`bg-black/30 p-4 rounded-2xl border transition-all cursor-pointer ${
                  isExpanded ? 'border-[#BA963E]/40 bg-black/50 shadow-xl' : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* CARD HEADER */}
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[#E5C158] font-bold text-sm">Order #{ord.id}</span>
                      <span className="text-[10px] text-gray-500">({isExpanded ? 'Click to collapse' : 'Click to details'})</span>
                    </div>
                    <span className="text-gray-500 text-[10px] block mt-0.5">Placed on {ord.date}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg font-bold font-mono text-[10px] border flex items-center gap-1.5 ${
                    ord.status === 'Delivered' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {ord.status}
                  </span>
                </div>

                {/* SUMMARY METRICS GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-gray-400 pt-3">
                  <div>
                    <span className="block text-[10px] text-gray-500">Total Bill</span>
                    <span className="text-white font-bold">PKR {ord.total?.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">Items Count</span>
                    <span className="text-white">{ord.items} {ord.items === 1 ? 'Product' : 'Products'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">Courier Partner</span>
                    <span className="text-white">{ord.courier || 'Express Freight'}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">Tracking Reference</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#E5C158] font-mono font-bold">{ord.trackingCode}</span>
                      <button
                        type="button"
                        onClick={(e) => copyTrackingCode(ord.trackingCode, e)}
                        className="text-[10px] bg-white/5 hover:bg-white/10 px-1.5 py-0.5 rounded text-gray-300 transition-colors"
                        title="Copy Code"
                      >
                        {copiedCode === ord.trackingCode ? '✓ Copied' : '📋'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* EXPANDED VIEW DETAILS */}
                {isExpanded && (
                  <div className="mt-4 pt-3 border-t border-white/5 space-y-2 text-[11px] animate-in fade-in">
                    {ord.address && (
                      <div className="bg-white/5 p-2.5 rounded-xl border border-white/5">
                        <span className="text-gray-400 block text-[10px] uppercase tracking-wider">📍 Delivery Address</span>
                        <p className="text-gray-200 font-medium mt-0.5">{ord.address}</p>
                      </div>
                    )}
                    <div className="flex justify-end gap-2 pt-1">
                      <span className="text-gray-500 text-[10px]">Need help with this order? Switch to the Customer Complaint Desk tab.</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}