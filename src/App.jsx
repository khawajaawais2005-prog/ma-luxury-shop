import React, { useState, useEffect } from 'react';
import AdminDashboard from './components/AdminDashboard';
import Checkout from './components/Checkout';
import LiveChat from './components/LiveChat';
// ■ NUE FEATURES COMPONENTS IMPORT
import CustomerPortal from './components/CustomerPortal';
import NotificationBanner from './components/NotificationBanner';
import TrackOrderModal from './components/TrackOrderModal';

export default function App() {
  const [viewMode, setViewMode] = useState('customer');
  const [darkMode, setDarkMode] = useState(true);

  // ■ CUSTOMER SUB-TAB STATE ('catalog' ya 'portal' ya 'wishlist')
  const [customerTab, setCustomerTab] = useState('catalog');

  // ■ SEARCH & CATEGORY FILTER STATES
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // ■ WISHLIST (FAVORITES) STATE
  const [wishlist, setWishlist] = useState([]);

  // ■ NEW FEATURE STATE: FLOATING CART DRAWER MODAL
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // ■■ PROMO CODE & DISCOUNT ENGINE STATES (SECURE & ONE-TIME USE)
  const [availableCoupons, setAvailableCoupons] = useState([
    { code: 'MA10', discount: 10, active: true },
    { code: 'PAKISTAN', discount: 14, active: true },
    { code: 'LUXURY20', discount: 20, active: true }
  ]);
  const [usedCoupons, setUsedCoupons] = useState(() => {
    return JSON.parse(localStorage.getItem('ma_used_coupons') || '[]');
  });
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);

  // ■ GLOBAL NOTIFICATIONS & TRACK MODAL STATES
  const [notifications, setNotifications] = useState([]);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  // ■ CHAT STATUS STATE
  const [isChatOpen, setIsChatOpen] = useState(false);

  // ■■ CENTRAL CHAT ENGINE DATA STATE
  const [chatSessions, setChatSessions] = useState({});

  // Professional Configuration States (Controlled Live by Admin)
  const [adminPassword, setAdminPassword] = useState('ma786');
  const [inputPassword, setInputPassword] = useState('');

  // Live Company Address State
  const [companyAddress, setCompanyAddress] = useState("Main Commercial Market,Rawalpindi, Pakistan");

  // Extended Professional Payment Gateways State
  const [bankDetails, setBankDetails] = useState({
    bankName: "Meezan Bank Ltd",
    accountTitle: "MA Products Official",
    accountNumber: "0312 3456789",
    iban: "PK12 MEZN 0012 3456 7890",
    easypaisaName: "EasyPaisa Wallet",
    easypaisaNumber: "0300 1234567",
    easypaisaTitle: "Khawaja Awais"
  });

  const [cart, setCart] = useState([]);
  const [feedbacks, setFeedbacks] = useState([
    { name: "Ali Ahmed", rating: "★★★★★", comment: "Jacket ki quality kamaal ki hai! Highly recommended.", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150" }
  ]);
  const [newFeedback, setNewFeedback] = useState({ name: '', rating: '★★★★★', comment: '', image: null });

  // ■ NEW FEATURE STATES (QUICK VIEW & TRACKING DATA)
  const [selectedProductModal, setSelectedProductModal] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
 const [placedOrdersList, setPlacedOrdersList] = useState(() => {
  const savedOrders = localStorage.getItem('ma_placed_orders');
  return savedOrders ? JSON.parse(savedOrders) : [];
});
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // ■ FLASH SALE TIMER
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Master Dynamic Inventory Engine
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Luxury Premium Jacket",
      category: "Apparel",
      originalPrice: 7500,
      salePrice: 5500,
      isOnSale: true,
      saleLabel: "14 August Sale",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
      description: "Handcrafted genuine leather finish with ultra-soft inner velvet lining.",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Black", "Brown"]
    },
    {
      id: 2,
      name: "Premium Gold Rim Shades",
      category: "Accessories",
      originalPrice: 3500,
      salePrice: 2500,
      isOnSale: false,
      saleLabel: "Clearance",
      image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
      description: "18k Gold plated frame with UV400 polarized protection lenses.",
      sizes: ["Standard"],
      colors: ["Gold"]
    },
    {
      id: 3,
      name: "Urban Minimalist Black Hoodie",
      category: "Apparel",
      originalPrice: 4800,
      salePrice: 3200,
      isOnSale: true,
      saleLabel: "Limited Stock",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
      description: "Heavyweight fleece cotton hoodie designed for streetwear look.",
      sizes: ["M", "L", "XL"],
      colors: ["Matte Black"]
    },
    {
      id: 4,
      name: "Chrono Heritage Gold Watch",
      category: "Watches",
      originalPrice: 18500,
      salePrice: 14500,
      isOnSale: true,
      saleLabel: "Premium Tier",
      image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=600",
      description: "Japanese Movement with Sapphire Crystal scratch-resistant glass.",
      sizes: ["42mm Dial"],
      colors: ["Royal Gold"]
    },
    {
      id: 5,
      name: "Classic Italian Leather Boots",
      category: "Footwear",
      originalPrice: 12000,
      salePrice: 9500,
      isOnSale: false,
      saleLabel: "New Arrival",
      image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600",
      description: "Hand-stitched genuine calfskin leather with memory foam sole.",
      sizes: ["41", "42", "43"],
      colors: ["Chestnut"]
    },
    {
      id: 6,
      name: "Sleek Matt-Black Wallet",
      category: "Accessories",
      originalPrice: 2800,
      salePrice: 1950,
      isOnSale: true,
      saleLabel: "Hot Deal",
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600",
      description: "RFID blocking slim bi-fold leather wallet.",
      sizes: ["Slim"],
      colors: ["Matt Black"]
    }
  ]);

  // ■ GLOBAL NOTIFICATION DISPATCHER HELPER
  const addNotification = (title, message, type = 'info') => {
    const newNote = {
      id: Date.now(),
      title,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNote, ...prev]);
    setTimeout(() => { 
      clearNotification(newNote.id);
    }, 5000);
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // ■ REAL ORDER TRACKING SYNC & SAVING FUNCTION
  const handleOrderPlaced = (newOrder) => {
    const generatedId = newOrder.orderId || 'MA-' + Math.floor(10000 + Math.random() * 90000);
    const completeOrderObj = {
      ...newOrder,
      orderId: generatedId,
      date: new Date().toLocaleDateString(),
      status: 'Confirmed & Processing',
      appliedCoupon: appliedCoupon || 'None'
    };

    // 1. One-Time Promo Code Permanent Lock
    if (appliedCoupon) {
      const updatedUsed = [...usedCoupons, appliedCoupon];
      setUsedCoupons(updatedUsed);
      localStorage.setItem('ma_used_coupons', JSON.stringify(updatedUsed));
    }

    // 2. Save Order to Tracking System (LocalStorage Persistent)
    const existingSaved = JSON.parse(localStorage.getItem('ma_placed_orders') || '[]');
    const updatedOrderList = [completeOrderObj, ...existingSaved];
    localStorage.setItem('ma_placed_orders', JSON.stringify(updatedOrderList));
    setPlacedOrdersList(updatedOrderList);
    setLastPlacedOrder(completeOrderObj);

    // 3. Notification Dispatch
    addNotification("🛍️ Order Confirmed!", `Order #${generatedId} successfully placed!`, "order");

    const customerName = newOrder.customer?.fullName || newOrder.fullName || "Customer";
    const phone = newOrder.customer?.phone || newOrder.phone || "N/A";
    const address = newOrder.customer?.address || newOrder.address || "N/A";
    const payment = newOrder.customer?.paymentMethod || newOrder.paymentMethod || "COD";

    const itemsSummary = (newOrder.items || cart)
      .map(item => `• ${item.name} ${item.selectedSize ? `(Size: ${item.selectedSize})` : ''} (x${item.quantity || 1})`)
      .join('\n');

    const formattedOrderMessage = 
      `📦 *NEW ORDER CONFIRMATION*\n` +
      `--------------------------------\n` +
      `🆔 *Order ID:* ${generatedId}\n` +
      `👤 *Name:* ${customerName}\n` +
      `📞 *Phone:* ${phone}\n` +
      `📍 *Address:* ${address}\n` +
      `💳 *Payment:* ${payment}\n` +
      `🎟️ *Coupon:* ${appliedCoupon || 'None'}\n\n` +
      `🛒 *Items Ordered:*\n${itemsSummary}\n\n` +
      `💰 *Total Amount:* ${newOrder.totalAmount || totalBudget} PKR`;

    const sessionKey = "Customer";
    const newMessage = {
      id: Date.now(),
      sender: customerName,
      text: formattedOrderMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOrder: true
    };

    setChatSessions(prev => ({
      ...prev,
      [sessionKey]: [...(prev[sessionKey] || []), newMessage]
    }));

    // Reset Cart & Coupon States
    setCart([]);
    setCouponCode('');
    setDiscountPercent(0);
    setAppliedCoupon(null);
    setIsChatOpen(true);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputPassword === adminPassword) {
      setViewMode('admin-panel');
      addNotification("🔐 Admin Logged In", "Welcome back Master Admin!", "info");
    } else {
      alert('Galt Password! Sirf Admin hi open kar sakta hai.');
    }
  };

  // ■ ENHANCED ADD TO CART WITH QUANTITY & VARIANTS
  const addToCart = (product, customSize = null, customColor = null) => {
    const price = product.isOnSale ? Number(product.salePrice) : Number(product.originalPrice);
    const sizeToUse = customSize || selectedSize || (product.sizes ? product.sizes[0] : null);
    const colorToUse = customColor || selectedColor || (product.colors ? product.colors[0] : null);

    const existingIndex = cart.findIndex(item => item.id === product.id && item.selectedSize === sizeToUse && item.selectedColor === colorToUse);

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity = (updatedCart[existingIndex].quantity || 1) + 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, finalPrice: price, quantity: 1, selectedSize: sizeToUse, selectedColor: colorToUse, cartId: Date.now() }]);
    }
    addNotification("🛒 Cart Updated", `${product.name} added to cart!`, "order");
    setSelectedProductModal(null);
  };

  // ■ QUANTITY ADJUSTMENT HELPER
  const updateQuantity = (cartId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = (item.quantity || 1) + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  // ■ WISHLIST TOGGLE HELPER
  const toggleWishlist = (product) => {
    if (wishlist.some(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      addNotification("💔 Wishlist", `${product.name} removed from Wishlist`, "info");
    } else {
      setWishlist([...wishlist, product]);
      addNotification("❤️ Wishlist", `${product.name} added to Wishlist!`, "info");
    }
  };

  // ■■ SECURE PROMO CODE ENGINE (NO FAKE / ONE-TIME USE)
  const applyCoupon = (e) => {
    e.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();

    if (!cleanCode) {
      alert("Meharbani karke promo code enter karein.");
      return;
    }

    // 1. Check if coupon was already used
    if (usedCoupons.includes(cleanCode)) {
      alert(`⚠️ Code "${cleanCode}" pehle hi istemaal ho chuka hai! Yeh dobara use nahi ho sakta.`);
      setCouponCode('');
      return;
    }

    // 2. Check if code exists in valid coupons list
    const validCoupon = availableCoupons.find(
      c => c.code === cleanCode && c.active
    );

    if (validCoupon) {
      setDiscountPercent(validCoupon.discount);
      setAppliedCoupon(validCoupon.code);
      addNotification("🎉 Coupon Applied", `${validCoupon.discount}% Flat Discount Applied!`, "info");
    } else {
      // 3. Block Fake / Invalid Codes
      setDiscountPercent(0);
      setAppliedCoupon(null);
      alert("❌ Fake ya Invalid Promo Code! Sirf authorized codes hi chalenge.");
    }
  };

  const handleReviewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFeedback({ ...newFeedback, image: URL.createObjectURL(file) });
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (newFeedback.name && newFeedback.comment) {
      setFeedbacks([...feedbacks, newFeedback]);
      setNewFeedback({ name: '', rating: '★★★★★', comment: '', image: null });
      document.getElementById('review-img-input').value = '';
      addNotification("⭐ Review Submitted", "Thank you for sharing your experience!", "info");
    }
  };

  // ■ CALCULATION FOR TOTAL WITH QUANTITIES & DISCOUNT
  const subTotalBudget = cart.reduce((acc, curr) => acc + (Number(curr.finalPrice) * (curr.quantity || 1)), 0);
  const totalDiscount = Math.round((subTotalBudget * discountPercent) / 100);
  const totalBudget = subTotalBudget - totalDiscount;

  // ■ SMART MULTI-FIELD SEARCH FILTERING LOGIC
  const filteredProducts = products.filter(prod => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      prod.name.toLowerCase().includes(query) ||
      (prod.category && prod.category.toLowerCase().includes(query)) ||
      (prod.description && prod.description.toLowerCase().includes(query));

    const matchesCategory = selectedCategory === 'All' || (prod.category && prod.category === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(products.map(p => p.category || 'General'))];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-[#0D0D0E] text-white' : 'bg-[#F4F4F7] text-gray-900'}`}>
      
      {/* ■ GLOBAL NOTIFICATION BANNER */}
      <NotificationBanner notifications={notifications} clearNotification={clearNotification} />

      {/* THEME CONTROLLER */}
      <div className="p-3 flex justify-end px-6 border-b border-white/5">
        <button onClick={() => setDarkMode(!darkMode)} className="bg-white/10 text-xs px-3 py-1.5 rounded-xl hover:bg-white/20 transition-all cursor-pointer">
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
      

      {/* ==================== 1. CUSTOMER PORTAL & SHOPPING CATALOG ==================== */}
      {viewMode === 'customer' && (
        <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 pb-24">
          
          {/* TOP HEADER & NAVIGATION HUB */}
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-700/20 pb-4 gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-lg object-cover" onError={(e) => e.target.style.display='none'} />
              <h1 className="text-xl font-serif tracking-widest font-bold">MA PRODUCTS</h1>
            </div>

            {/* CUSTOMER NAVIGATION BUTTONS */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setCustomerTab('catalog')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  customerTab === 'catalog'
                    ? 'bg-[#BA963E] text-black shadow-md'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                🛍️ Shop Catalog
              </button>

              <button
                onClick={() => setCustomerTab('wishlist')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
                  customerTab === 'wishlist'
                    ? 'bg-[#BA963E] text-black shadow-md'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                ❤️ Wishlist ({wishlist.length})
              </button>

              <button
                onClick={() => setCustomerTab('portal')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  customerTab === 'portal'
                    ? 'bg-[#BA963E] text-black shadow-md'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                📦 My Orders & Complaints
              </button>

              <button
                onClick={() => setIsTrackModalOpen(true)}
                className="bg-[#BA963E]/10 border border-[#BA963E]/30 text-[#E5C158] hover:bg-[#BA963E]/20 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🔍</span> Track Order
              </button>
            </div>

            <div 
              onClick={() => setIsCartDrawerOpen(true)} 
              className="text-right text-xs bg-[#BA963E]/10 border border-[#BA963E]/30 px-4 py-2 rounded-xl text-[#E5C158] font-bold cursor-pointer hover:bg-[#BA963E]/20 transition-all flex items-center gap-2"
            >
              <span>🛒 Items in Cart:</span>
              <span className="bg-[#BA963E] text-black px-2 py-0.5 rounded-full text-[11px] font-mono font-bold">
                {cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
              </span>
            </div>
          </div>

          {/* TAB 1: SHOPPING CATALOG */}
          {customerTab === 'catalog' && (
            <>
              {/* ■ FLASH SALE COUNTDOWN BANNER */}
              <div className="bg-gradient-to-r from-[#BA963E]/20 via-[#121214] to-[#BA963E]/20 border border-[#BA963E]/30 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left shadow-lg">
                <div>
                  <h3 className="text-sm font-serif font-bold text-[#E5C158] uppercase tracking-wider">🔥 MA LUXURY FLASH SALE IS LIVE!</h3>
                  <p className="text-xs text-gray-400">Get flat discounts on high-end luxury items before stock runs out.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono bg-black/60 px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-gray-400">Ends In:</span>
                  <span className="text-[#E5C158] font-bold">{String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>

              {/* ■ SMART SEARCH & CATEGORY FILTER BAR */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#121214]/50 p-4 rounded-2xl border border-white/5">
                <div className="w-full md:w-1/2 relative">
                  <input
                    type="text"
                    placeholder="🔎 Search products by name, description, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#BA963E]"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2 text-xs text-gray-400 hover:text-white">✕</button>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#BA963E] text-black font-bold'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Live Catalog Display */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredProducts.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-gray-400 text-xs bg-[#121214]/30 rounded-3xl border border-white/5 space-y-2">
                      <p className="font-bold text-gray-300">No matching products found!</p>
                      <p className="text-[11px] text-gray-500">Try searching for something else like "Jacket", "Watch", or "Leather".</p>
                    </div>
                  ) : (
                    filteredProducts.map((prod) => {
                      const discountPercentage = prod.isOnSale && prod.originalPrice 
                        ? Math.round(((prod.originalPrice - prod.salePrice) / prod.originalPrice) * 100)
                        : 0;

                      return (
                        <div key={prod.id} className="bg-[#121214]/40 p-4 rounded-3xl border border-white/5 shadow-xl flex flex-col justify-between hover:border-[#BA963E]/30 transition-all relative overflow-hidden group">
                          
                          {/* SALE BADGE & DYNAMIC DISCOUNT TAG */}
                          {prod.isOnSale && (
                            <div className="absolute top-3 left-3 z-10 flex gap-1 items-center">
                              <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                                🔥 {prod.saleLabel || 'SALE'}
                              </span>
                              {discountPercentage > 0 && (
                                <span className="bg-[#BA963E] text-black text-[10px] font-bold px-2 py-1 rounded-full shadow-md font-mono">
                                  -{discountPercentage}%
                                </span>
                              )}
                            </div>
                          )}

                          {/* WISHLIST TOGGLE BUTTON */}
                          <button
                            onClick={() => toggleWishlist(prod)}
                            className="absolute top-3 right-3 z-10 bg-black/40 hover:bg-black/80 p-2 rounded-full border border-white/10 transition-all text-xs cursor-pointer"
                          >
                            {wishlist.some(w => w.id === prod.id) ? '❤️' : '🤍'}
                          </button>

                          {/* IMAGE (CLICK TO QUICK VIEW) */}
                          <div
                            onClick={() => { setSelectedProductModal(prod); setSelectedSize(prod.sizes ? prod.sizes[0] : ''); setSelectedColor(prod.colors ? prod.colors[0] : ''); }}
                            className="rounded-2xl overflow-hidden border border-white/10 h-56 mb-4 bg-black/20 cursor-pointer relative group"
                          >
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white uppercase tracking-wider">
                              👁️ Quick View
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h2
                              onClick={() => { setSelectedProductModal(prod); setSelectedSize(prod.sizes ? prod.sizes[0] : ''); setSelectedColor(prod.colors ? prod.colors[0] : ''); }}
                              className="text-lg font-serif tracking-wide cursor-pointer hover:text-[#E5C158] transition-colors"
                            >
                              {prod.name}
                            </h2>

                            <div className="text-md font-sans font-semibold">
                              {prod.isOnSale ? (
                                <div className="flex items-baseline gap-2">
                                  <span className="text-[#E5C158] text-lg font-mono font-bold">{prod.salePrice} PKR</span>
                                  <span className="text-xs text-gray-500 line-through font-normal font-mono">{prod.originalPrice} PKR</span>
                                </div>
                              ) : (
                                <span className="text-white text-md font-mono font-bold">{prod.originalPrice} PKR</span>
                              )}
                            </div>

                            <button onClick={() => addToCart(prod)} className="w-full bg-[#BA963E] text-black font-bold py-2.5 rounded-xl uppercase tracking-wider text-xs hover:bg-[#E5C158] transition-all cursor-pointer">
                              🛒 Add to Cart
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* LIVE CART SIDEBAR */}
                <div className="bg-[#121214] border border-white/5 p-5 rounded-3xl space-y-4 shadow-xl lg:sticky lg:top-6">
                  <h3 className="text-md font-serif text-[#E5C158] border-b border-white/5 pb-2 uppercase tracking-wider flex justify-between items-center">
                    <span>Your Active Cart</span>
                    <span className="text-xs font-mono text-gray-400">({cart.length})</span>
                  </h3>

                  {cart.length === 0 ? (
                    <p className="text-xs text-gray-500 py-6 text-center">Your cart is empty. Add items to see total budget.</p>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {cart.map((item) => (
                          <div key={item.cartId} className="flex justify-between items-center bg-[#1A1A1D] p-2.5 rounded-xl border border-white/5 text-xs">
                            <div className="flex items-center gap-2">
                              <img src={item.image} className="w-8 h-8 rounded object-cover" alt="" />
                              <div>
                                <p className="font-medium max-w-[100px] truncate">{item.name}</p>
                                {(item.selectedSize || item.selectedColor) && (
                                  <p className="text-[9px] text-gray-400">{item.selectedSize ? `Size: ${item.selectedSize}` : ''}</p>
                                )}
                                <p className="text-[#E5C158] text-[11px] font-bold font-mono">{item.finalPrice * (item.quantity || 1)} PKR</p>
                              </div>
                            </div>

                            {/* QUANTITY CONTROLS */}
                            <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                              <button onClick={() => updateQuantity(item.cartId, -1)} className="text-xs hover:text-[#E5C158] px-1 font-bold">-</button>
                              <span className="text-[11px] font-bold font-mono">{item.quantity || 1}</span>
                              <button onClick={() => updateQuantity(item.cartId, 1)} className="text-xs hover:text-[#E5C158] px-1 font-bold">+</button>
                            </div>

                            <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:bg-red-500/10 p-1 px-2 rounded-lg text-[10px] font-bold uppercase transition-all">Remove</button>
                          </div>
                        ))}
                      </div>

                      {/* PROMO CODE SECTION */}
                      <form onSubmit={applyCoupon} className="pt-2 flex flex-col gap-1.5">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Promo Code (e.g. MA10)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            disabled={discountPercent > 0}
                            className="bg-[#1A1A1D] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none flex-1 uppercase disabled:opacity-50"
                          />
                          {discountPercent === 0 ? (
                            <button type="submit" className="bg-[#BA963E] hover:bg-[#E5C158] text-black text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer">
                              Apply
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => { setDiscountPercent(0); setAppliedCoupon(null); setCouponCode(''); }}
                              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        {appliedCoupon && (
                          <p className="text-[10px] text-emerald-400 font-bold">
                            ✓ Code "{appliedCoupon}" Applied ({discountPercent}% Off)
                          </p>
                        )}
                      </form>

                      <div className="pt-3 border-t border-white/10 space-y-2">
                        {discountPercent > 0 && (
                          <div className="flex justify-between items-center text-xs text-emerald-400">
                            <span>Discount ({discountPercent}%):</span>
                            <span className="font-mono">-{totalDiscount} PKR</span>
                          </div>
                        )}
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-gray-400 uppercase tracking-wider">Total Budget:</span>
                          <span className="text-xl font-bold text-[#E5C158] font-mono">{totalBudget} PKR</span>
                        </div>
                        <button onClick={() => document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' })} className="w-full bg-gradient-to-r from-[#BA963E] to-[#E5C158] text-black font-bold py-3 rounded-xl uppercase tracking-widest text-xs shadow-lg cursor-pointer">
                          ⚡ Proceed to Checkout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Secure Checkout Desk */}
              {cart.length > 0 && (
                <div id="checkout-section" className="pt-6 scroll-mt-6">
                  <Checkout
                    darkMode={darkMode}
                    cartItems={cart}
                    totalBudget={totalBudget}
                    bankDetails={bankDetails}
                    companyAddress={companyAddress}
                    onOrderPlaced={handleOrderPlaced}
                  />
                </div>
              )}

              {/* REVIEWS SYSTEM */}
              <div className="bg-[#121214]/30 border border-white/5 p-6 rounded-3xl space-y-6">
                <h3 className="text-lg font-serif text-[#E5C158]">Customer Feedbacks & Reviews</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedbacks.map((f, i) => (
                    <div key={i} className="bg-[#1A1A1D]/60 p-4 rounded-xl border border-white/5 text-xs flex gap-4 items-start">
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#E5C158]">{f.name}</span>
                          <span className="tracking-widest text-[10px] text-amber-400">{f.rating}</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">{f.comment}</p>
                      </div>
                      {f.image && <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0"><img src={f.image} className="w-full h-full object-cover" alt="" /></div>}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-4 pt-4 border-t border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input type="text" placeholder="Your Name" value={newFeedback.name} onChange={(e) => setNewFeedback({...newFeedback, name: e.target.value})} className="bg-[#1A1A1D] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none" required />
                    <select value={newFeedback.rating} onChange={(e) => setNewFeedback({...newFeedback, rating: e.target.value})} className="bg-[#1A1A1D] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none">
                      <option value="★★★★★">5 Stars (Excellent)</option>
                      <option value="★★★★☆">4 Stars (Good)</option>
                      <option value="★★★☆☆">3 Stars (Average)</option>
                    </select>
                  </div>
                  <div className="bg-[#1A1A1D]/40 p-3 rounded-xl border border-white/5 flex justify-between items-center">
                    <input id="review-img-input" type="file" accept="image/*" onChange={handleReviewImageChange} className="text-gray-500 text-xs cursor-pointer" />
                    {newFeedback.image && <img src={newFeedback.image} className="w-10 h-10 rounded-lg object-cover" alt="" />}
                  </div>
                  <textarea placeholder="Write feedback here..." value={newFeedback.comment} onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})} className="w-full h-20 bg-[#1A1A1D] border border-white/5 rounded-xl p-2.5 text-xs text-white focus:outline-none resize-none" required></textarea>
                  <button type="submit" className="bg-[#BA963E] text-black font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer">Submit Review</button>
                </form>
              </div>
            </>
          )}

          {/* TAB: WISHLIST DISPLAY */}
          {customerTab === 'wishlist' && (
            <div className="space-y-6">
              <h2 className="text-xl font-serif text-[#E5C158] border-b border-white/10 pb-3">❤️ My Saved Wishlist</h2>
              {wishlist.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-sm">
                  Your wishlist is currently empty. Explore the catalog to save your favorite items!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((prod) => (
                    <div key={prod.id} className="bg-[#121214]/40 p-4 rounded-3xl border border-white/5 shadow-xl flex flex-col justify-between">
                      <div className="rounded-2xl overflow-hidden border border-white/10 h-48 mb-4">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-3">
                        <h2 className="text-md font-serif">{prod.name}</h2>
                        <p className="text-[#E5C158] font-bold font-mono">{prod.isOnSale ? prod.salePrice : prod.originalPrice} PKR</p>
                        <div className="flex gap-2">
                          <button onClick={() => addToCart(prod)} className="flex-1 bg-[#BA963E] text-black font-bold py-2 rounded-xl text-xs cursor-pointer">
                            🛒 Add to Cart
                          </button>
                          <button onClick={() => toggleWishlist(prod)} className="bg-red-500/20 text-red-400 p-2 rounded-xl text-xs border border-red-500/30 cursor-pointer">
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTEGRATED CUSTOMER PORTAL */}
          {customerTab === 'portal' && (
            <CustomerPortal addNotification={addNotification} />
          )}

        </div>
      )}

      {/* QUICK VIEW PRODUCT DETAILS MODAL */}
      {selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-[#BA963E]/40 rounded-3xl max-w-xl w-full p-6 space-y-6 relative shadow-2xl text-white">
            <button onClick={() => setSelectedProductModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white text-lg">✕</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden border border-white/10 h-56 bg-black/40">
                <img src={selectedProductModal.image} alt={selectedProductModal.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] text-[#E5C158] uppercase font-bold tracking-widest">{selectedProductModal.category}</span>
                  <h3 className="text-lg font-serif font-bold">{selectedProductModal.name}</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">{selectedProductModal.description || "Luxury product by MA Products."}</p>
                <div className="text-base font-bold text-[#E5C158] font-mono">
                  {selectedProductModal.isOnSale ? `${selectedProductModal.salePrice} PKR` : `${selectedProductModal.originalPrice} PKR`}
                </div>
                {/* SIZES SELECTOR */}
                {selectedProductModal.sizes && selectedProductModal.sizes.length > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold">Select Size:</label>
                    <div className="flex gap-2">
                      {selectedProductModal.sizes.map(s => (
                        <button key={s} onClick={() => setSelectedSize(s)} className={`px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${selectedSize === s ? 'bg-[#BA963E] text-black font-bold border-[#BA963E]' : 'border-white/10 text-gray-300'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => addToCart(selectedProductModal, selectedSize, selectedColor)} className="w-full bg-[#BA963E] text-black font-bold py-3 rounded-xl uppercase tracking-wider text-xs hover:bg-[#E5C158] transition-all cursor-pointer">
                  🛒 Add to Cart Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW FEATURE MODAL: QUICK FLOATING CART DRAWER */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="bg-[#121214] border-l border-[#BA963E]/30 w-full max-w-md h-full p-6 space-y-6 shadow-2xl overflow-y-auto text-white flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-lg font-serif text-[#E5C158]">🛒 Your Shopping Basket</h3>
                <button onClick={() => setIsCartDrawerOpen(false)} className="text-gray-400 hover:text-white text-lg">✕</button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  Your cart is empty. Browse products and add them here!
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.cartId} className="flex justify-between items-center bg-[#1A1A1D] p-3 rounded-2xl border border-white/5 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} className="w-10 h-10 rounded-xl object-cover" alt="" />
                        <div>
                          <p className="font-bold text-white">{item.name}</p>
                          <p className="text-[#E5C158] font-mono">{item.finalPrice * (item.quantity || 1)} PKR</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.cartId, -1)} className="bg-black/40 text-white px-2 py-1 rounded-lg border border-white/10 font-bold">-</button>
                        <span className="font-mono">{item.quantity || 1}</span>
                        <button onClick={() => updateQuantity(item.cartId, 1)} className="bg-black/40 text-white px-2 py-1 rounded-lg border border-white/10 font-bold">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Payable:</span>
                  <span className="text-[#E5C158] font-bold font-mono">{totalBudget} PKR</span>
                </div>
                <button 
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
                  }} 
                  className="w-full bg-[#BA963E] text-black font-bold py-3 rounded-xl uppercase text-xs hover:bg-[#E5C158] transition-all cursor-pointer"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== 2. ADMIN AUTHENTICATION TERMINAL ==================== */}
      {viewMode === 'admin-login' && (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
          <form onSubmit={handleLogin} className="bg-[#121214] border border-[#BA963E]/30 p-8 rounded-3xl shadow-2xl w-full max-w-sm space-y-6 text-center">
            <h2 className="text-xl font-serif text-[#E5C158] tracking-widest uppercase">Admin Terminal Verification</h2>
            <input
              type="password"
              placeholder="Enter Admin Passkey"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl p-3 text-center text-[#E5C158] tracking-widest focus:outline-none"
              required
            />
            <button type="submit" className="w-full bg-[#BA963E] text-black font-bold py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer">Verify Identity</button>
            <button type="button" onClick={() => setViewMode('customer')} className="text-xs text-gray-500 hover:underline block mx-auto cursor-pointer">Cancel</button>
          </form>
        </div>
      )}

      {/* ==================== 3. ADMIN MANAGEMENT TERMINAL ==================== */}
      {viewMode === 'admin-panel' && (
        <div className="flex flex-col md:flex-row min-h-screen">
          <aside className="w-full md:w-64 bg-[#121214] p-6 border-r border-white/5 flex flex-col justify-between">
            <div className="space-y-6">
              <h2 className="text-sm tracking-widest text-[#E5C158] font-bold text-center border-b border-white/5 pb-3">MA MASTER CONSOLE</h2>
              <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-xl border border-emerald-500/20 text-[11px] font-bold text-center">⚙️ Root Access Node Active</div>
            </div>
            <button onClick={() => { setViewMode('customer'); setInputPassword(''); }} className="w-full bg-red-600/20 text-red-400 py-2.5 rounded-xl font-bold text-xs uppercase border border-red-600/30 cursor-pointer">Exit Terminal</button>
          </aside>

          <main className="flex-1 p-6 md:p-10 space-y-8 max-w-6xl overflow-x-hidden">
            <AdminDashboard
              products={products}
              setProducts={setProducts}
              bankDetails={bankDetails}
              setBankDetails={setBankDetails}
              adminPassword={adminPassword}
              setAdminPassword={setAdminPassword}
              companyAddress={companyAddress}
              setCompanyAddress={setCompanyAddress}
              addNotification={addNotification}
            />
          </main>
        </div>
      )}

      {/* ■ DYNAMIC FLOATING LAYOUT AREA FOR LIVECHAT */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {isChatOpen && (
          <div className="shadow-2xl mb-1 transform transition-all duration-200">
            <LiveChat
              isAdmin={viewMode === 'admin-panel'}
              darkMode={darkMode}
              chatSessions={chatSessions}
              setChatSessions={setChatSessions}
              onClose={() => setIsChatOpen(false)}
            />
          </div>
        )}

        {/* Floating Golden Toggle Action Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-[#BA963E] hover:bg-[#E5C158] text-black font-bold px-5 py-3.5 rounded-full shadow-2xl transition-all duration-200 flex items-center gap-2 text-xs uppercase tracking-wider border border-[#BA963E]/40 cursor-pointer"
        >
          <span>💬</span> Live Support
        </button>
      </div>

      {/* QUICK TRACK MODAL INTEGRATION */}
      <TrackOrderModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />

      {/* CORPORATE NAVIGATION FOOTER */}
      <footer className="text-center py-12 border-t border-white/5 bg-black/20 mt-12 space-y-3">
        <p className="text-xs text-gray-500 max-w-md mx-auto px-4">📍 {companyAddress}</p>
        <button onClick={() => setViewMode(viewMode === 'customer' ? 'admin-login' : 'customer')} className="text-xs text-[#E5C158] bg-[#BA963E]/10 border border-[#BA963E]/30 px-5 py-2 rounded-xl uppercase tracking-widest hover:bg-[#BA963E] hover:text-black transition-all font-bold cursor-pointer">
          {viewMode === 'customer' ? '🔒 Switch to Admin Console' : '🛍️ Switch to Customer View'}
        </button>
      </footer>

    </div>
  );
}