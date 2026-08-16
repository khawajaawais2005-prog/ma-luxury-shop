import React, { useState } from 'react';

export default function Checkout({ darkMode, cartItems, totalBudget, bankDetails, companyAddress, onOrderPlaced }) {
  // Dynamic Delivery Fee Rules
  const calculateDeliveryCharges = (amount) => {
    if (amount >= 1000 && amount <= 3000) return 250;
    if (amount > 3000 && amount <= 10000) return 350;
    if (amount > 10000) return 450;
    return 250; // Default fallback
  };

  const deliveryFee = calculateDeliveryCharges(totalBudget);
  const finalPayableTotal = totalBudget + deliveryFee;

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    paymentOption: 'ADVANCE_DELIVERY', // Options: ADVANCE_DELIVERY or FULL_ADVANCE
    receiptScreenshot: null,
    otpCode: '',
    isOtpSent: false,
    isOtpVerified: false
  });

  // Modal State for Luxury Order Confirmation Popup
  const [placedOrderModal, setPlacedOrderModal] = useState(null);

  // OTP Generator & Validation
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleSendOtp = () => {
    if (!formData.phone || formData.phone.length < 10) {
      alert("⚠️ Meharbani karke valid Phone / WhatsApp number enter karein!");
      return;
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otp);
    setFormData((prev) => ({ ...prev, isOtpSent: true }));
    alert(`📲 [MA PRODUCTS OTP SHIELD]\nAapka Security Verification Code hai: ${otp}`);
  };

  const handleVerifyOtp = () => {
    if (formData.otpCode === generatedOtp) {
      setFormData((prev) => ({ ...prev, isOtpVerified: true }));
      alert("✅ Phone Number Successfully Verified!");
    } else {
      alert("❌ Galat OTP code! Phir se koshish karein.");
    }
  };

  const handleScreenshotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, receiptScreenshot: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.phone || !formData.address) {
      alert("⚠️ Meharbani karke tamam details fill karein!");
      return;
    }

    if (!formData.isOtpVerified) {
      alert("🛡️ Security Verification Incomplete! Pehle OTP code verify karein.");
      return;
    }

    if (!formData.receiptScreenshot) {
      alert("📸 Payment Slip Screenshot attach karna zaroori hai!");
      return;
    }

    const generatedId = 'MA-' + Math.floor(10000000 + Math.random() * 90000000);

    const paymentTypeLabel = formData.paymentOption === 'ADVANCE_DELIVERY' 
      ? `Advance Delivery Fee (PKR ${deliveryFee}) + COD` 
      : '100% Full Online Advance';

    // Integrated Order Object
    const newOrderObj = {
      id: generatedId,
      orderId: generatedId,
      date: new Date().toISOString().split('T')[0],
      courier: "TCS Express",
      trackingCode: generatedId,
      total: finalPayableTotal,
      totalAmount: finalPayableTotal,
      itemTotal: totalBudget,
      deliveryCharges: deliveryFee,
      paymentType: paymentTypeLabel,
      paymentStatus: 'Pending Admin Approval',
      otpVerified: formData.isOtpVerified,
      receiptScreenshot: formData.receiptScreenshot,
      status: 'Pending',
      customer: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: paymentTypeLabel
      },
      items: cartItems
    };

    // Broadcast live event across Localhost Ports & Unified Key
    try {
      // 1. Unified Key for Tracker & Admin Sync
      const allOrders = JSON.parse(localStorage.getItem('ma_all_customer_orders') || '[]');
      const updatedAllOrders = [newOrderObj, ...allOrders];
      localStorage.setItem('ma_all_customer_orders', JSON.stringify(updatedAllOrders));

      // 2. Legacy Key Fallback
      localStorage.setItem('ma_customer_orders', JSON.stringify(updatedAllOrders));
      
      // Trigger Storage Event Signal for Admin Panel Realtime Broadcast
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error("Failed to sync order:", err);
    }

    if (onOrderPlaced) {
      onOrderPlaced(newOrderObj);
    }

    // Open Luxury Success Modal
    setPlacedOrderModal(newOrderObj);

    // Reset Form State
    setFormData({
      fullName: '',
      phone: '',
      address: '',
      paymentOption: 'ADVANCE_DELIVERY',
      receiptScreenshot: null,
      otpCode: '',
      isOtpSent: false,
      isOtpVerified: false
    });
  };

  return (
    <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#121214] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} space-y-6 shadow-2xl`}>
      <h2 className="text-lg font-serif text-[#E5C158] font-bold uppercase tracking-wider">
        🛍️ Secure Checkout & Verification
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* CUSTOMER DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="bg-[#1A1A1D] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#BA963E]"
            required
          />

          {/* PHONE WITH LIVE OTP SHIELD */}
          <div className="space-y-1">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Phone / WhatsApp Number" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={formData.isOtpVerified}
                className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#BA963E]"
                required
              />
              {!formData.isOtpVerified && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="bg-[#BA963E]/20 text-[#E5C158] border border-[#BA963E]/40 px-3 rounded-xl font-bold hover:bg-[#BA963E] hover:text-black transition-all cursor-pointer whitespace-nowrap"
                >
                  {formData.isOtpSent ? 'Resend OTP' : 'Send OTP'}
                </button>
              )}
            </div>
            {formData.isOtpSent && !formData.isOtpVerified && (
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Enter 4-Digit Code"
                  value={formData.otpCode}
                  onChange={(e) => setFormData({...formData, otpCode: e.target.value})}
                  className="bg-[#1A1A1D] border border-emerald-500/50 rounded-xl p-2 text-white text-center w-full focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="bg-emerald-500 text-black px-4 rounded-xl font-bold cursor-pointer hover:bg-emerald-400"
                >
                  Verify
                </button>
              </div>
            )}
            {formData.isOtpVerified && (
              <p className="text-[10px] text-emerald-400 font-bold">✓ Phone Number Shield Verified</p>
            )}
          </div>
        </div>

        <div>
          <textarea 
            placeholder="Destination Shipping Address" 
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#BA963E] h-20 resize-none"
            required
          ></textarea>
        </div>

        {/* PRICING BREAKDOWN */}
        <div className="p-4 bg-[#1A1A1D] rounded-2xl border border-white/5 space-y-2 text-xs">
          <div className="flex justify-between text-gray-400">
            <span>Items Subtotal:</span>
            <span>PKR {totalBudget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#E5C158] font-bold">
            <span>Dynamic Shipping Fee:</span>
            <span>PKR {deliveryFee}</span>
          </div>
          <div className="flex justify-between text-white font-bold border-t border-white/10 pt-2 text-sm">
            <span>Grand Total Payable:</span>
            <span className="text-[#E5C158]">PKR {finalPayableTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* MANDATORY ADVANCE OPTIONS */}
        <div className="p-4 bg-[#1A1A1D] rounded-2xl border border-[#BA963E]/30 space-y-3">
          <p className="font-bold text-[#E5C158]">💳 Choose Advance Payment Mode:</p>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input 
                type="radio" 
                name="paymentOption" 
                value="ADVANCE_DELIVERY" 
                checked={formData.paymentOption === 'ADVANCE_DELIVERY'} 
                onChange={() => setFormData({...formData, paymentOption: 'ADVANCE_DELIVERY'})}
                className="accent-[#BA963E]"
              />
              <span>Advance Delivery Fee Only (<strong>PKR {deliveryFee}</strong>) + Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input 
                type="radio" 
                name="paymentOption" 
                value="FULL_ADVANCE" 
                checked={formData.paymentOption === 'FULL_ADVANCE'} 
                onChange={() => setFormData({...formData, paymentOption: 'FULL_ADVANCE'})}
                className="accent-[#BA963E]"
              />
              <span>100% Full Online Advance (<strong>PKR {finalPayableTotal.toLocaleString()}</strong>)</span>
            </label>
          </div>
        </div>

        {/* BANK DETAILS & PAYMENT SCREENSHOT UPLOAD */}
        <div className="p-4 bg-[#1A1A1D]/80 rounded-2xl border border-white/10 space-y-3 text-[11px] text-gray-300">
          <p className="font-bold text-[#E5C158]">🏦 Official Transfer Coordinates:</p>
          <p><strong>Bank:</strong> {bankDetails?.bankName} | <strong>Title:</strong> {bankDetails?.accountTitle} | <strong>A/C:</strong> {bankDetails?.accountNumber}</p>
          <p><strong>EasyPaisa:</strong> {bankDetails?.easypaisaNumber} ({bankDetails?.easypaisaTitle})</p>
          
          <div className="pt-2 border-t border-white/5 space-y-2">
            <label className="block text-gray-300 font-bold">📸 Upload Payment Proof / Screenshot (Required):</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleScreenshotUpload}
              className="w-full bg-black/40 border border-dashed border-white/20 p-2 rounded-xl text-gray-400 text-xs cursor-pointer"
              required
            />
            {formData.receiptScreenshot && (
              <p className="text-[10px] text-emerald-400 font-bold">✓ Payment Screenshot Attached Successfully</p>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-[#BA963E] to-[#E5C158] text-black font-bold py-3.5 rounded-xl uppercase tracking-widest shadow-xl hover:opacity-90 transition-all cursor-pointer text-xs"
        >
          Confirm & Submit Order
        </button>
      </form>

      {/* LUXURY ORDER SUCCESS MODAL */}
      {placedOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-[#BA963E] p-6 md:p-8 rounded-3xl max-w-md w-full text-center space-y-5 shadow-2xl relative text-white">
            
            <div className="w-16 h-16 bg-[#BA963E]/20 text-[#E5C158] rounded-full flex items-center justify-center mx-auto text-3xl border border-[#BA963E]/40">
              🎯
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-serif font-bold text-[#E5C158] tracking-widest uppercase">
                Order Successfully Placed!
              </h2>
              <p className="text-xs text-gray-400">
                Aapka order system mein register kar liya gaya hai.
              </p>
            </div>

            <div className="bg-[#1A1A1D] border border-white/5 p-4 rounded-2xl text-left space-y-2 font-mono text-xs">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Order ID:</span>
                <span className="text-[#E5C158] font-bold">{placedOrderModal.id}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Grand Total:</span>
                <span className="text-white font-bold">{placedOrderModal.total} PKR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Live Status:</span>
                <span className="text-amber-400 font-bold">Pending Verification</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed">
              Admin panel ko <strong className="text-white">Live Signal</strong> bhej diya gaya hai. Verification ke baad order dispatch kar diya jayega!
            </p>

            <button
              onClick={() => setPlacedOrderModal(null)}
              className="w-full bg-[#BA963E] text-black font-bold py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-[#E5C158] transition-all cursor-pointer shadow-lg"
            >
              Close & Continue 🛍️
            </button>
          </div>
        </div>
      )}
    </div>
  );
}