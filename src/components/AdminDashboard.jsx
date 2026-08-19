import React, { useState, useEffect } from 'react';

export default function AdminDashboard({
  products,
  setProducts,
  bankDetails,
  setBankDetails,
  adminPassword,
  setAdminPassword,
  companyAddress,
  setCompanyAddress,
  addNotification,
  notificationHistory = [],
  freeDeliveryAuthorityEnabled = false,
  onToggleFreeDeliveryAuthority,
  orders: parentOrders = [],
  orderHistory = [],
  onPaymentVerification,
  onToggleOrderFreeDelivery,
  forceLightMode = false,
  onOpenLiveChat
}) {
  const [activeTab, setActiveTab] = useState('all');

  // 1. LIVE ORDERS SYNC WITH LOCALSTORAGE
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('ma_customer_orders');
    return saved ? JSON.parse(saved) : [
      { id: "ORD-9821", date: "2026-08-14", courier: "TCS Express", trackingCode: "TCS-889123", total: 11000, status: "Pending" }
    ];
  });


  // REAL-TIME MULTI-TAB SYNC & AUDIO ALERT
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ma_customer_orders' || !e.key) {
        const freshOrders = JSON.parse(localStorage.getItem('ma_customer_orders') || '[]');
        
        if (freshOrders.length > orders.length) {
          try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
          } catch (err) {
            console.log("Audio alert blocked by browser settings.");
          }
          if (addNotification) {
            addNotification("🚨 NEW ORDER RECEIVED!", `Order #${freshOrders[0]?.id || 'NEW'} placed live!`, "order");
          }
        }
        setOrders(freshOrders);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [orders.length, addNotification]);

  // STATE: Filter, Search, Invoice Modal & Screenshot Modal
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('ALL');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [viewScreenshot, setViewScreenshot] = useState(null);

  // Auto Save Orders & Complaints
  useEffect(() => {
    localStorage.setItem('ma_customer_orders', JSON.stringify(orders));
  }, [orders]);


  // Handle Order Status Update
  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (addNotification) {
      addNotification("■ Order Status Saved", `Order #${orderId} updated to [${newStatus}]`, "order");
    }
  };

  // Bulk Order Status Update
  const handleBulkStatusChange = (newStatus) => {
    if (!newStatus) return;
    if (window.confirm(`■■ Are you sure you want to update ALL filtered orders to [${newStatus}]?`)) {
      const updated = orders.map(ord => {
        const matchesSearch = ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
          ord.trackingCode.toLowerCase().includes(orderSearch.toLowerCase());
        const matchesFilter = orderFilter === 'ALL' || ord.status === orderFilter;
        if (matchesSearch && matchesFilter) {
          return { ...ord, status: newStatus };
        }
        return ord;
      });
      setOrders(updated);
      if (addNotification) addNotification("■ Bulk Update Applied", `Selected orders updated to [${newStatus}]`, "order");
    }
  };

  // Export Orders to CSV File
  const handleExportCSV = () => {
    if (orders.length === 0) {
      alert("No orders available to export!");
      return;
    }
    const headers = "Order ID,Date,Courier,Tracking Code,Total (PKR),Status\n";
    const rows = orders.map(o => `${o.id},${o.date},${o.courier},${o.trackingCode},${o.total},${o.status}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    if (addNotification) addNotification("■ Export Complete", "Orders downloaded as CSV.", "info");
  };


  // NEW PRODUCT STATE WITH MULTI-IMAGE, SIZES, COLORS & STORE ADDRESS
  const [newProduct, setNewProduct] = useState({
    name: '',
    originalPrice: '',
    salePrice: '',
    isOnSale: false,
    saleLabel: 'Special Sale',
    images: [],
    sizes: 'S, M, L, XL',
    colors: 'Black, Brown, Gold',
    storeAddress: companyAddress || ''
  });

  const [tempPassword, setTempPassword] = useState('');

  // MULTIPLE IMAGES UPLOAD HANDLER
  // Data URLs are intentionally used instead of temporary blob URLs so the
  // gallery survives a page refresh when the catalogue is saved to localStorage.
  const handleMultipleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length !== files.length) {
      alert('Only image files can be added to the product gallery.');
    }

    const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
    const acceptedFiles = imageFiles.filter(file => file.size <= MAX_IMAGE_SIZE);
    if (acceptedFiles.length !== imageFiles.length) {
      alert('Images larger than 5MB were skipped.');
    }

    Promise.all(acceptedFiles.map(file => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }))).then(newUrls => {
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, ...newUrls.filter(Boolean)]
      }));
      e.target.value = '';
    }).catch(() => alert('One or more gallery images could not be read.'));
  };

  const removeSelectedImage = (indexToRemove) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const triggerGallerySelector = () => {
    document.getElementById('gallery-upload-input').click();
  };

  const handleAddressChangeWithConfirmation = (e) => {
    const freshAddress = e.target.value;
    if (window.confirm(`■■ CONFIRMATION SHIELD:\nAre you sure you want to change the live store address to:\n"${freshAddress}"?`)) {
      setCompanyAddress(freshAddress);
      if (addNotification) addNotification("■ Address Updated", `Store address has been changed to "${freshAddress}"`, "info");
    }
  };

  const handleBankChangeWithConfirmation = (field, val) => {
    if (window.confirm(`■■ CONFIGURATION UPDATE CHECK:\nModify field [${field}] to: "${val}"?`)) {
      setBankDetails({ ...bankDetails, [field]: val });
      if (addNotification) addNotification("■ Payment Node Update", `Bank details parameter [${field}] modified.`, "info");
    }
  };

  const handleProductChangeWithConfirmation = (id, field, val, currentProductName) => {
    let confirmMessage = `In "${currentProductName}", change [${field}] to "${val}" live on storefront?`;
    let notifTitle = "■ Inventory Managed";
    let notifMessage = `Product "${currentProductName}" updated: [${field}] -> ${val}`;
    
    if (field === 'isOnSale') {
      confirmMessage = val
        ? `■ DISCOUNT ALERT:\nAre you sure you want to activate SALE on "${currentProductName}"?`
        : `■ STANDARD RATE ALERT:\nAre you sure you want to remove SALE from "${currentProductName}"?`;
      notifTitle = val ? "■ Sale Activated Live!" : "■ Sale Deactivated";
      notifMessage = val
        ? `"${currentProductName}" is now on ACTIVE SALE status!`
        : `"${currentProductName}" returned to standard pricing.`;
    }

    if (window.confirm(`■ FINANCIAL CONTROL DIALOG:\n${confirmMessage}`)) {
      setProducts(products.map(p => {
        if (p.id === id) {
          if (field === 'sizes' || field === 'colors') {
            const arr = typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : val;
            return { ...p, [field]: arr };
          }
          return { ...p, [field]: val };
        }
        return p;
      }));
      if (addNotification) addNotification(notifTitle, notifMessage, field === 'isOnSale' && val ? "order" : "info");
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.images || newProduct.images.length === 0) {
      alert("■■ Please upload at least one product image!");
      return;
    }
    if (!window.confirm(`■ PUBLISH SHIELD:\nDo you confirm injecting "${newProduct.name}" into the live catalog grid?`)) {
      return;
    }

    const sizesArray = newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean);
    const colorsArray = newProduct.colors.split(',').map(c => c.trim()).filter(Boolean);

    const createdItem = {
      id: Date.now(),
      name: newProduct.name,
      originalPrice: Number(newProduct.originalPrice),
      salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : Number(newProduct.originalPrice),
      isOnSale: newProduct.isOnSale,
      saleLabel: newProduct.saleLabel,
      image: newProduct.images[0], // Main Fallback Image
      images: newProduct.images,   // Array of Images for Gallery
      sizes: sizesArray.length > 0 ? sizesArray : ['M'],
      colors: colorsArray.length > 0 ? colorsArray : ['Default'],
      storeAddress: newProduct.storeAddress || companyAddress
    };

    setProducts([...products, createdItem]);
    if (addNotification) addNotification("■ New Asset Live", `"${newProduct.name}" has been published into the public catalog.`, "info");
    
    setNewProduct({
      name: '',
      originalPrice: '',
      salePrice: '',
      isOnSale: false,
      saleLabel: 'Special Sale',
      images: [],
      sizes: 'S, M, L, XL',
      colors: 'Black, Brown, Gold',
      storeAddress: companyAddress || ''
    });
    
    if (document.getElementById('gallery-upload-input')) {
      document.getElementById('gallery-upload-input').value = '';
    }
    alert("■ Product published live with all variants & gallery!");
  };

  const handleDeleteProduct = (id, productName) => {
    if (window.confirm(`■ DECLINE DEPLOYMENT CHECK:\nAre you sure you want to completely erase "${productName}"?`)) {
      setProducts(products.filter(p => p.id !== id));
      if (addNotification) addNotification("■ Product Erased", `"${productName}" removed from store registry.`, "info");
    }
  };

  // NEW PRODUCT FEATURE: COPY PUBLIC PRODUCT LINK FROM ADMIN INVENTORY
  const handleCopyProductLink = async (product) => {
    const productUrl = `${window.location.origin}/product/${encodeURIComponent(product.id)}`;
    try {
      await navigator.clipboard?.writeText(productUrl);
      if (addNotification) addNotification('🔗 Product Link Copied', `${product.name} public link copied.`, 'info');
    } catch {
      window.prompt('Copy this product link:', productUrl);
    }
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!tempPassword.trim()) {
      alert("■■ Password khali nahi ho sakta!");
      return;
    }
    if (window.confirm(`■ SECURITY SHIELD ALERT:\nAre you sure you want to change Admin Access Passkey?`)) {
      setAdminPassword(tempPassword);
      if (addNotification) addNotification("■ Access Key Rotated", "Admin security passkey updated successfully.", "info");
      setTempPassword('');
      alert("■ Admin Master Passkey successfully updated!");
    }
  };

  // Filtered Orders Logic
  const filteredOrders = orders.filter(ord => {
    const matchesSearch = ord.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.trackingCode.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesFilter = orderFilter === 'ALL' || ord.status === orderFilter;
    return matchesSearch && matchesFilter;
  });

  const totalRevenue = orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

  return (
    <div className={`space-y-8 animate-in fade-in text-xs ${forceLightMode ? 'ma-admin-light' : ''}`}>
      {forceLightMode && <style>{`
        .ma-admin-light .bg\[\#121214\], .ma-admin-light .bg\[\#1A1A1D\], .ma-admin-light .bg-black\/20, .ma-admin-light .bg-black\/40 { background-color:#ffffff !important; color:#171717 !important; border-color:#e5e7eb !important; }
        .ma-admin-light .text-white, .ma-admin-light .text-gray-200, .ma-admin-light .text-gray-300 { color:#171717 !important; }
        .ma-admin-light .text-gray-400, .ma-admin-light .text-gray-500 { color:#4b5563 !important; }
        .ma-admin-light .border-white\/5, .ma-admin-light .border-white\/10 { border-color:#e5e7eb !important; }
        .ma-admin-light input, .ma-admin-light select { background-color:#ffffff !important; color:#171717 !important; border-color:#d1d5db !important; }
      `}</style>}
      <div>
        <h1 className="text-2xl font-serif text-[#E5C158]">Global Administration Master Terminal</h1>
        <p className="text-xs text-gray-500">Manage products, orders tracking, customer tickets & store security.</p>
      </div>

      {/* QUICK ANALYTICS STATS WIDGET */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121214] border border-[#BA963E]/30 p-4 rounded-2xl flex justify-between items-center shadow-lg">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Sales Revenue</p>
            <p className="text-xl font-bold font-mono text-[#E5C158]">PKR {totalRevenue.toLocaleString()}</p>
          </div>
          <span className="text-2xl">■</span>
        </div>
        <div className="bg-[#121214] border border-[#BA963E]/30 p-4 rounded-2xl flex justify-between items-center shadow-lg">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Customer Orders</p>
            <p className="text-xl font-bold text-white">{orders.length} <span className="text-xs text-amber-400">Orders</span></p>
          </div>
          <span className="text-2xl">■</span>
        </div>
        <div className="bg-[#121214] border border-emerald-500/30 p-4 rounded-2xl flex justify-between items-center shadow-lg">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Free Delivery Authority</p>
            <p className={`text-xl font-bold ${freeDeliveryAuthorityEnabled ? 'text-emerald-400' : 'text-red-400'}`}>{freeDeliveryAuthorityEnabled ? 'ON' : 'OFF'}</p>
          </div>
          <span className="text-2xl">🚚</span>
        </div>
      </div>

      {/* TABS HEADER */}
      <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button onClick={() => setActiveTab('all')} className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'all' ? 'bg-[#BA963E] text-black' : 'bg-white/5 text-gray-400'}`}>
          ■ Full Terminal
        </button>
        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-[#BA963E] text-black' : 'bg-white/5 text-gray-400'}`}>
          ■ Express Orders ({orders.length})
        </button>
        <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'inventory' ? 'bg-[#BA963E] text-black' : 'bg-white/5 text-gray-400'}`}>
          ■ Catalog & Controls
        </button>
        <button onClick={() => setActiveTab('operations')} className={`px-4 py-2 rounded-xl font-bold transition-all ${activeTab === 'operations' ? 'bg-[#BA963E] text-black' : 'bg-white/5 text-gray-400'}`}>
          🚚 Operations & History
        </button>
      </div>

      {/* ORDERS SECTION WITH STATUS SAVE, EXPORT CSV & BULK ACTION */}
      {(activeTab === 'all' || activeTab === 'orders') && (
        <div className="bg-[#121214] p-5 rounded-3xl border border-amber-500/20 space-y-4 shadow-xl">
          <div className="border-b border-white/5 pb-3 space-y-3">
            <h2 className="text-sm uppercase tracking-wider text-[#E5C158] font-bold flex justify-between items-center flex-wrap gap-2">
              <span>■ Customer Orders Manager</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">{orders.length} Orders</span>
                <button
                  onClick={handleExportCSV}
                  className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-black transition-all px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer"
                >
                  ■ Export CSV
                </button>
              </div>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <input
                type="text"
                placeholder="■ Quick Search Order ID or Tracking Code..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="bg-[#1A1A1D] border border-white/10 text-white p-2 rounded-xl text-xs focus:outline-none focus:border-[#BA963E]"
              />
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="bg-[#1A1A1D] border border-white/10 text-amber-400 p-2 rounded-xl text-xs focus:outline-none font-bold"
              >
                <option value="ALL">■ All Order Statuses</option>
                <option value="Pending">■ Pending Only</option>
                <option value="Processing">■■ Processing Only</option>
                <option value="In Transit">■ In Transit Only</option>
                <option value="Delivered">■ Delivered Only</option>
              </select>
              <select
                defaultValue=""
                onChange={(e) => { handleBulkStatusChange(e.target.value); e.target.value = ""; }}
                className="bg-[#1A1A1D] border border-[#BA963E]/40 text-[#E5C158] p-2 rounded-xl text-xs font-bold focus:outline-none"
              >
                <option value="" disabled>■ Bulk Change Filtered Status</option>
                <option value="Processing">Set ALL to Processing</option>
                <option value="In Transit">Set ALL to In Transit</option>
                <option value="Delivered">Set ALL to Delivered</option>
              </select>
            </div> 
          </div>
          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No matching orders found.</p>
            ) : (
              filteredOrders.map((ord) => (
                <div key={ord.id} className="bg-[#1A1A1D] p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#E5C158] text-sm">#{ord.id}</span>
                      <span className="text-gray-500">({ord.date})</span>
                      {ord.otpVerified && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/30 font-bold">✓ OTP Verified</span>
                      )}
                    </div>
                    <p className="text-gray-300">Customer: <span className="text-white font-bold">{ord.customer?.fullName || 'Guest Customer'}</span> ({ord.customer?.phone || 'N/A'})</p>
                    <p className="text-gray-300">Courier: <span className="text-white font-bold">{ord.courier}</span> • Tracking: <span className="font-mono text-[#E5C158]">{ord.trackingCode}</span></p>
                    <p className="text-white font-bold">Total: PKR {ord.total?.toLocaleString()} {ord.paymentType && <span className="text-[10px] text-amber-400">({ord.paymentType})</span>}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {ord.receiptScreenshot && (
                      <button
                        onClick={() => setViewScreenshot(ord.receiptScreenshot)}
                        className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500 hover:text-black font-bold p-2 rounded-xl transition-all cursor-pointer text-xs"
                      >
                        🔍 View Receipt SS
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedInvoice(ord)}
                      className="bg-[#BA963E]/10 border border-[#BA963E]/40 text-[#E5C158] hover:bg-[#BA963E] hover:text-black font-bold p-2 rounded-xl transition-all cursor-pointer text-xs"
                    >
                      ■ Print Invoice
                    </button>
                    <span className="text-gray-400">Status:</span>
                    <select
                      value={ord.status}
                      onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                      className="bg-[#121214] border border-[#BA963E]/40 text-white font-bold rounded-xl p-2 focus:outline-none focus:border-[#BA963E]"
                    >
                      <option value="Pending">■ Pending Approval</option>
                      <option value="Processing">■■ Processing</option>
                      <option value="In Transit">■ In Transit</option>
                      <option value="Out for Delivery">■ Out for Delivery</option>
                      <option value="Delivered">■ Delivered (OK)</option>
                      <option value="Cancelled">■ Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}


      {/* SECURITY ACCESS KEY SECTION */}
      {(activeTab === 'all' || activeTab === 'inventory') && (
        <> 
          <div className="bg-[#121214] p-5 rounded-3xl border border-red-900/20 space-y-4 shadow-xl">
            <h2 className="text-sm uppercase tracking-wider text-[#E5C158] font-bold border-b border-white/5 pb-2">
              ■ Security Encryption & Admin Passkey
            </h2>
            <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs items-end">
              <div className="md:col-span-2">
                <label className="text-gray-400 block mb-1">Set New Admin Terminal Password</label>
                <input
                  type="text"
                  placeholder="Enter new strong password"
                  value={tempPassword}
                  onChange={(e) => setTempPassword(e.target.value)}
                  className="w-full bg-[#1A1A1D] border border-white/5 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#BA963E]"
                  required
                />
              </div>
              <div>
                <button type="submit" className="w-full bg-gradient-to-r from-red-600/20 to-red-600/40 hover:from-red-600 hover:to-red-700 text-red-200 border border-red-500/30 font-bold py-2.5 rounded-xl uppercase tracking-wider cursor-pointer">
                  ■ Update Passkey
                </button>
              </div>
            </form>
            <p className="text-[10px] text-gray-500">Current Key Active: <span className="text-[#E5C158] font-mono">{adminPassword}</span></p>
          </div>

          {/* ADD PRODUCT WITH MULTI-IMAGE, SIZES, COLORS & STORE ADDRESS */}
          <div className="bg-[#121214] p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-3 gap-3">
              <h2 className="text-sm uppercase tracking-wider text-[#E5C158] font-bold">■ Add New Store Product</h2>
              <button
                type="button"
                onClick={triggerGallerySelector}
                className="bg-[#BA963E]/10 border border-[#BA963E]/40 text-[#E5C158] hover:bg-[#BA963E] hover:text-black transition-all px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                ■ Upload Pictures (Multiple)
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Product Title</label>
                <input type="text" placeholder="e.g. Leather Jacket" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#1A1A1D] border border-white/5 p-2.5 rounded-xl text-white focus:outline-none" required />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Retail Price (PKR)</label>
                <input type="number" placeholder="7500" value={newProduct.originalPrice} onChange={(e) => setNewProduct({...newProduct, originalPrice: e.target.value})} className="w-full bg-[#1A1A1D] border border-white/5 p-2.5 rounded-xl text-white focus:outline-none" required />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Sale Price (PKR)</label>
                <input type="number" placeholder="5500" value={newProduct.salePrice} onChange={(e) => setNewProduct({...newProduct, salePrice: e.target.value})} className="w-full bg-[#1A1A1D] border border-white/5 p-2.5 rounded-xl text-white focus:outline-none" />
              </div>

              {/* SIZES INPUT */}
              <div>
                <label className="text-gray-400 block mb-1">Available Sizes (Comma separated)</label>
                <input type="text" placeholder="S, M, L, XL" value={newProduct.sizes} onChange={(e) => setNewProduct({...newProduct, sizes: e.target.value})} className="w-full bg-[#1A1A1D] border border-white/5 p-2.5 rounded-xl text-white focus:outline-none" />
              </div>

              {/* COLORS INPUT */}
              <div>
                <label className="text-gray-400 block mb-1">Available Colors (Comma separated)</label>
                <input type="text" placeholder="Black, Brown, Tan" value={newProduct.colors} onChange={(e) => setNewProduct({...newProduct, colors: e.target.value})} className="w-full bg-[#1A1A1D] border border-white/5 p-2.5 rounded-xl text-white focus:outline-none" />
              </div>

              {/* DISPATCH ADDRESS FOR PRODUCT */}
              <div>
                <label className="text-gray-400 block mb-1">Warehouse / Dispatch Location</label>
                <input type="text" placeholder="Lahore Hub / Karachi Warehouse" value={newProduct.storeAddress} onChange={(e) => setNewProduct({...newProduct, storeAddress: e.target.value})} className="w-full bg-[#1A1A1D] border border-white/5 p-2.5 rounded-xl text-white focus:outline-none" />
              </div>

              {/* MULTI IMAGE UPLOAD BOX */}
              <div className="relative group md:col-span-2">
                <label className="text-gray-400 block mb-1">Product Gallery Pictures (Select Multiple)</label>
                <div onClick={triggerGallerySelector} className="w-full bg-[#1A1A1D] border border-dashed border-white/10 hover:border-[#BA963E]/50 p-2.5 rounded-xl text-gray-400 text-center cursor-pointer flex items-center justify-center">
                  <span className="text-[11px] text-gray-400">
                    {newProduct.images.length > 0 ? `■ ${newProduct.images.length} Image(s) Selected - Click to Add More` : "■ Click to Choose Multiple Images"}
                  </span>
                </div>
                <input id="gallery-upload-input" type="file" accept="image/*" multiple onChange={handleMultipleImageUpload} className="hidden" />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Discount Tag Text</label>
                <input type="text" value={newProduct.saleLabel} onChange={(e) => setNewProduct({...newProduct, saleLabel: e.target.value})} className="w-full bg-[#1A1A1D] border border-white/5 p-2.5 rounded-xl text-white focus:outline-none" />
              </div>

              <div className="flex items-center gap-3 pl-2 h-full pt-4 md:pt-0">
                <input type="checkbox" id="directSale" checked={newProduct.isOnSale} onChange={(e) => setNewProduct({...newProduct, isOnSale: e.target.checked})} className="scale-125 accent-[#BA963E]" />
                <label htmlFor="directSale" className="text-gray-300 font-medium cursor-pointer">Activate Discount Immediately</label>
              </div>

              {/* PREVIEW MULTIPLE IMAGES THUMBNAILS */}
              {newProduct.images.length > 0 && (
                <div className="md:col-span-3 bg-black/40 p-3 rounded-2xl border border-white/5 space-y-2">
                  <p className="text-[11px] text-emerald-400 font-bold">✓ {newProduct.images.length} Image(s) Linked to Product:</p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {newProduct.images.map((imgUrl, idx) => (
                      <div key={idx} className="relative group shrink-0">
                        <img src={imgUrl} className="w-16 h-16 object-cover rounded-xl border border-[#BA963E]/40" alt="Preview" />
                        <button
                          type="button"
                          onClick={() => removeSelectedImage(idx)}
                          className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] w-5 h-5 rounded-full font-bold flex items-center justify-center hover:bg-red-700 shadow-md"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="md:col-span-3 pt-2">
                <button type="submit" className="w-full bg-[#BA963E] text-black font-bold py-3.5 rounded-xl hover:bg-[#E5C158] uppercase tracking-wider text-xs cursor-pointer shadow-md">
                  ■ Publish Product
                </button>
              </div>
            </form>
          </div>

          {/* STORE LOCATION & ADDRESS */}
          <div className="bg-[#121214] p-5 rounded-3xl border border-white/5 space-y-4 shadow-xl">
            <h2 className="text-sm uppercase tracking-wider text-[#E5C158] font-bold border-b border-white/5 pb-2">■ Live Operational Store Address</h2>
            <div className="text-xs space-y-2">
              <input
                type="text"
                defaultValue={companyAddress}
                onBlur={handleAddressChangeWithConfirmation}
                className="w-full bg-[#1A1A1D] border border-[#BA963E]/20 p-3 rounded-xl text-white focus:outline-none focus:border-[#BA963E]"
                placeholder="Enter Address (Click outside to save)"
              />
            </div>
          </div>

          {/* PAYMENT DETAILS */}
          <div className="bg-[#121214] p-5 rounded-3xl border border-white/5 space-y-4 shadow-xl">
            <h2 className="text-sm uppercase tracking-wider text-[#E5C158] font-bold border-b border-white/5 pb-2">■ Payment Gateway Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3">
                <span className="text-[#E5C158] font-bold block border-b border-white/5 pb-1">Bank Account</span>
                <input type="text" defaultValue={bankDetails.bankName} onBlur={(e) => handleBankChangeWithConfirmation('bankName', e.target.value)} className="w-full bg-[#1A1A1D] border border-white/5 p-2 rounded-xl text-white" placeholder="Bank Name" />
                <input type="text" defaultValue={bankDetails.accountTitle} onBlur={(e) => handleBankChangeWithConfirmation('accountTitle', e.target.value)} className="w-full bg-[#1A1A1D] border border-white/5 p-2 rounded-xl text-white" placeholder="Account Title" />
                <input type="text" defaultValue={bankDetails.accountNumber} onBlur={(e) => handleBankChangeWithConfirmation('accountNumber', e.target.value)} className="w-full bg-[#1A1A1D] border border-white/5 p-2 rounded-xl text-white" placeholder="Account Number" />
                <input type="text" defaultValue={bankDetails.iban} onBlur={(e) => handleBankChangeWithConfirmation('iban', e.target.value)} className="w-full bg-[#1A1A1D] border border-white/5 p-2 rounded-xl text-white" placeholder="IBAN" />
              </div>
              <div className="bg-black/20 p-4 rounded-2xl border border-white/5 space-y-3">
                <span className="text-[#E5C158] font-bold block border-b border-white/5 pb-1">Mobile Wallet (Easypaisa/JazzCash)</span>
                <input type="text" defaultValue={bankDetails.easypaisaName} onBlur={(e) => handleBankChangeWithConfirmation('easypaisaName', e.target.value)} className="w-full bg-[#1A1A1D] border border-white/5 p-2 rounded-xl text-white" placeholder="Wallet Name" />
                <input type="text" defaultValue={bankDetails.easypaisaNumber} onBlur={(e) => handleBankChangeWithConfirmation('easypaisaNumber', e.target.value)} className="w-full bg-[#1A1A1D] border border-white/5 p-2 rounded-xl text-white" placeholder="Mobile Number" />
                <input type="text" defaultValue={bankDetails.easypaisaTitle} onBlur={(e) => handleBankChangeWithConfirmation('easypaisaTitle', e.target.value)} className="w-full bg-[#1A1A1D] border border-white/5 p-2 rounded-xl text-white" placeholder="Account Title" />
              </div>
            </div>
          </div>

          {/* INVENTORY TABLE ENHANCED WITH VARIANTS & LOCATION EDIT */}
          <div className="bg-[#121214] p-5 rounded-3xl border border-white/5 space-y-4 shadow-xl">
            <h2 className="text-sm uppercase tracking-wider text-[#E5C158] font-bold border-b border-white/5 pb-2">■ Inventory Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="py-2">Preview</th>
                    <th className="py-2">Product Name</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Sale Price</th>
                    <th className="py-2">Sizes</th>
                    <th className="py-2">Colors</th>
                    <th className="py-2">Dispatch Address</th>
                    <th className="py-2">Discount</th>
                    <th className="py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map(p => (
                    <tr key={p.id}>
                      <td className="py-3">
                        <img src={p.image || p.images?.[0]} className="w-10 h-10 object-cover rounded-lg border border-white/10" alt="" />
                      </td>
                      <td className="py-3">
                        <input type="text" defaultValue={p.name} onBlur={(e) => handleProductChangeWithConfirmation(p.id, 'name', e.target.value, p.name)} className="bg-[#1A1A1D] text-white p-1.5 rounded-lg border border-white/5 w-full max-w-[140px]" />
                      </td>
                      <td className="py-3 font-mono">
                        <input type="number" defaultValue={p.originalPrice} onBlur={(e) => handleProductChangeWithConfirmation(p.id, 'originalPrice', Number(e.target.value), p.name)} className="bg-[#1A1A1D] text-[#E5C158] font-bold p-1.5 border border-white/5 rounded-lg w-16" /> PKR
                      </td>
                      <td className="py-3 font-mono">
                        <input type="number" defaultValue={p.salePrice} onBlur={(e) => handleProductChangeWithConfirmation(p.id, 'salePrice', Number(e.target.value), p.name)} className="bg-[#1A1A1D] text-red-400 font-bold p-1.5 border border-white/5 rounded-lg w-16" /> PKR
                      </td>
                      <td className="py-3">
                        <input type="text" defaultValue={Array.isArray(p.sizes) ? p.sizes.join(', ') : p.sizes || ''} onBlur={(e) => handleProductChangeWithConfirmation(p.id, 'sizes', e.target.value, p.name)} className="bg-[#1A1A1D] text-gray-300 p-1.5 rounded-lg border border-white/5 w-24 text-[10px]" placeholder="S, M, L" />
                      </td>
                      <td className="py-3">
                        <input type="text" defaultValue={Array.isArray(p.colors) ? p.colors.join(', ') : p.colors || ''} onBlur={(e) => handleProductChangeWithConfirmation(p.id, 'colors', e.target.value, p.name)} className="bg-[#1A1A1D] text-gray-300 p-1.5 rounded-lg border border-white/5 w-24 text-[10px]" placeholder="Red, Black" />
                      </td>
                      <td className="py-3">
                        <input type="text" defaultValue={p.storeAddress || ''} onBlur={(e) => handleProductChangeWithConfirmation(p.id, 'storeAddress', e.target.value, p.name)} className="bg-[#1A1A1D] text-gray-300 p-1.5 rounded-lg border border-white/5 w-28 text-[10px]" placeholder="Warehouse Location" />
                      </td>
                      <td className="py-3">
                        <button onClick={() => handleProductChangeWithConfirmation(p.id, 'isOnSale', !p.isOnSale, p.name)} className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border ${p.isOnSale ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-gray-500/10 border-white/10 text-gray-400'}`}>
                          {p.isOnSale ? 'Active' : 'Standard'}
                        </button>
                      </td>
                      <td className="py-3 text-center">
                        <div className="flex flex-wrap justify-center gap-1.5">
                          <button onClick={() => handleCopyProductLink(p)} className="text-[#E5C158] hover:bg-[#BA963E]/20 border border-[#BA963E]/30 px-2 py-1 rounded-lg font-bold uppercase text-[10px]">
                            🔗 Link
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id, p.name)} className="text-red-500 hover:bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-lg font-bold uppercase text-[10px]">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* OPERATIONS / DELIVERY / NOTIFICATION HISTORY */}
      {(activeTab === 'all' || activeTab === 'operations') && (
        <div className="space-y-5">
          <div className="bg-[#121214] p-5 rounded-3xl border border-[#BA963E]/30 space-y-4 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
              <div>
                <h2 className="text-sm uppercase tracking-wider text-[#E5C158] font-bold">🚚 Delivery Authority Control</h2>
                <p className="text-[10px] text-gray-500 mt-1">Global permission first, then individual order overrides. Existing order records are not silently rewritten.</p>
              </div>
              <button onClick={onToggleFreeDeliveryAuthority} className={`px-4 py-2 rounded-xl font-bold text-xs ${freeDeliveryAuthorityEnabled ? 'bg-emerald-600 text-white' : 'bg-red-600/20 text-red-300 border border-red-500/30'}`}>
                {freeDeliveryAuthorityEnabled ? '✓ AUTHORITY ON' : '🔒 AUTHORITY OFF'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="bg-[#1A1A1D] rounded-2xl border border-white/5 p-4">
                <h3 className="font-bold text-xs text-[#E5C158] mb-2">Live Delivery Audit</h3>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {(parentOrders || orders).map(order => (
                    <div key={order.id} className="border border-white/5 rounded-xl p-3 flex flex-col sm:flex-row justify-between gap-2">
                      <div>
                        <p className="font-mono font-bold text-xs">#{order.id}</p>
                        <p className="text-[10px] text-gray-500">{order.freeDelivery ? 'FREE DELIVERY' : 'STANDARD DELIVERY'} • PKR {Number(order.deliveryFee || order.standardDeliveryFee || 0).toLocaleString()}</p>
                        <p className="text-[9px] text-gray-600">{(order.trackingTimeline || []).filter(e => String(e.status || '').toLowerCase().includes('delivery')).length} delivery timeline event(s)</p>
                      </div>
                      <button disabled={!freeDeliveryAuthorityEnabled} onClick={() => onToggleOrderFreeDelivery?.(order.id)} className="px-3 py-2 rounded-xl bg-[#BA963E] text-black font-bold text-[10px] disabled:opacity-40">
                        {order.freeDelivery ? 'Remove Free Delivery' : 'Grant Free Delivery'}
                      </button>
                    </div>
                  ))}
                  {!(parentOrders || orders).length && <p className="text-xs text-gray-500">No order delivery records yet.</p>}
                </div>
              </div>

              <div className="bg-[#1A1A1D] rounded-2xl border border-white/5 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-xs text-[#E5C158]">🔔 Notification History</h3>
                  <span className="text-[9px] text-gray-500">{notificationHistory.length} saved</span>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {notificationHistory.length ? notificationHistory.slice(0, 100).map(note => (
                    <div key={note.id} className="border border-white/5 rounded-xl p-2.5">
                      <div className="flex justify-between gap-2"><b className="text-[10px]">{note.title}</b><span className="text-[8px] text-gray-500">{note.time}</span></div>
                      <p className="text-[9px] text-gray-500 mt-1">{note.message}</p>
                    </div>
                  )) : <p className="text-xs text-gray-500">No notification history yet.</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#121214] p-5 rounded-3xl border border-white/5 shadow-xl">
            <h2 className="text-sm uppercase tracking-wider text-[#E5C158] font-bold mb-3">🧾 Completed Order Archive</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[720px]">
                <thead><tr className="border-b border-white/10 text-gray-500"><th className="py-2">Order</th><th className="py-2">Customer</th><th className="py-2">Status</th><th className="py-2">Delivery</th><th className="py-2">Total</th></tr></thead>
                <tbody className="divide-y divide-white/5">
                  {(orderHistory || []).map(order => (
                    <tr key={order.id}><td className="py-2 font-mono">{order.id}</td><td className="py-2">{order.customerName || order.customer?.fullName || 'Customer'}</td><td className="py-2">{order.status}</td><td className="py-2">{order.freeDelivery ? 'FREE' : `PKR ${Number(order.deliveryFee || order.standardDeliveryFee || 0).toLocaleString()}`}</td><td className="py-2 font-mono text-[#E5C158]">PKR {Number(order.total || 0).toLocaleString()}</td></tr>
                  ))}
                </tbody>
              </table>
              {!orderHistory?.length && <p className="text-xs text-gray-500 py-5 text-center">No completed orders archived yet.</p>}
            </div>
          </div>

          <div className="bg-[#121214] p-5 rounded-3xl border border-white/5 shadow-xl">
            <h2 className="text-sm uppercase tracking-wider text-[#E5C158] font-bold mb-3">💬 Support Connection</h2>
            <p className="text-[10px] text-gray-500 mb-3">Customer complaints/tickets are intentionally not used. Customers communicate through Live Support, and resolved conversations leave the active queue.</p>
            <button onClick={onOpenLiveChat} className="bg-[#BA963E] text-black font-bold px-4 py-2 rounded-xl text-xs">Open Live Support</button>
          </div>
        </div>
      )}

            {/* PAYMENT SCREENSHOT MODAL */}
      {viewScreenshot && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-[#BA963E]/40 w-full max-w-lg p-5 rounded-3xl space-y-4 shadow-2xl text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-sm font-bold text-[#E5C158] uppercase">📸 Customer Payment Receipt</h3>
              <button onClick={() => setViewScreenshot(null)} className="text-gray-400 hover:text-white font-bold text-lg">✕</button>
            </div>
            <div className="p-2 bg-black rounded-2xl flex items-center justify-center overflow-hidden max-h-[70vh]">
              <img src={viewScreenshot} alt="Payment Receipt" className="max-w-full max-h-[65vh] object-contain rounded-xl" />
            </div>
            <button
              onClick={() => setViewScreenshot(null)}
              className="w-full bg-[#BA963E] text-black font-bold py-2.5 rounded-xl hover:bg-[#E5C158] uppercase text-xs"
            >
              Close Viewer
            </button>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE SLIP MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121214] border border-[#BA963E]/40 w-full max-w-md p-6 rounded-3xl space-y-4 shadow-2xl text-white">
            <div className="border-b border-white/10 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-serif text-[#E5C158]">MA Products Official Receipt</h3>
                <p className="text-[10px] text-gray-400">Dispatch Order Slip</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="text-gray-400 hover:text-white font-bold text-base">✕</button>
            </div>
            <div className="space-y-2 text-xs font-mono bg-[#1A1A1D] p-4 rounded-2xl border border-white/5">
              <div className="flex justify-between">
                <span className="text-gray-400">Order Ref:</span>
                <span className="text-[#E5C158] font-bold">#{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span>{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Courier Partner:</span>
                <span>{selectedInvoice.courier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tracking Code:</span>
                <span className="text-[#E5C158] font-bold">{selectedInvoice.trackingCode}</span> 
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-sm">
                <span className="text-gray-300">Total Payable:</span>
                <span className="text-white font-bold">PKR {selectedInvoice.total?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-emerald-400 font-bold">{selectedInvoice.status}</span>
              </div>
            </div>
            <div className="text-[10px] text-gray-500 text-center">
              Store Address: {companyAddress || 'Main Operational Hub'}
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 bg-[#BA963E] text-black font-bold py-2.5 rounded-xl hover:bg-[#E5C158] uppercase cursor-pointer text-xs"
              >
                ■ Print / Save PDF
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="bg-white/10 text-gray-300 font-bold px-4 py-2.5 rounded-xl hover:bg-white/20 text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}