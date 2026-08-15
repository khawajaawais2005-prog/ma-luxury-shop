import React, { useState, useEffect, useRef } from 'react';

export default function AdminConsole({ darkMode }) {
  const [orders, setOrders] = useState([
    { id: "MA-9941", customer: "Awais Tahir", items: "Premium Luxury Pack", total: "14,500 PKR", status: "Processing", date: "2026-08-14" },
    { id: "MA-9942", customer: "Zain Ali", items: "Oud Al-Arab Perfume", total: "8,900 PKR", status: "Pending", date: "2026-08-14" }
  ]);
  const [coupons, setCoupons] = useState([
    { code: "MAVIP20", discount: "20%", status: "Active" },
    { code: "FREESHIP", discount: "Free Delivery", status: "Active" }
  ]);
  const [newCoupon, setNewCoupon] = useState("");
  const [newDiscount, setNewDiscount] = useState("");

  // 1. Search filter engine state for order stream row
  const [orderSearch, setOrderSearch] = useState("");

  // 2. New Product Entry Form Management state variables
  const [productPayload, setProductPayload] = useState({
    name: "", price: "", category: "Fragrance", imageLinks: "", colors: "", sizes: "", description: ""
  });

  // 3. LIVE CHAT ADMIN TERMINAL STATES
  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem('ma_chat_sessions');
    return saved ? JSON.parse(saved) : {};
  });
  const [resolvedSessions, setResolvedSessions] = useState(() => {
    const saved = localStorage.getItem('ma_resolved_sessions');
    return saved ? JSON.parse(saved) : {};
  });
  const [adminActiveSession, setAdminActiveSession] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const chatAdminEndRef = useRef(null);

  // Sync Live Chat with LocalStorage
  useEffect(() => {
    const interval = setInterval(() => {
      const savedChats = localStorage.getItem('ma_chat_sessions');
      const savedResolved = localStorage.getItem('ma_resolved_sessions');
      if (savedChats) setChatSessions(JSON.parse(savedChats));
      if (savedResolved) setResolvedSessions(JSON.parse(savedResolved));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatAdminEndRef.current) {
      chatAdminEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatSessions, adminActiveSession]);

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon) return;
    setCoupons([...coupons, { code: newCoupon.toUpperCase(), discount: newDiscount || "10%", status: "Active" }]);
    setNewCoupon(""); setNewDiscount("");
  };

  // Filter existing active order tracking array rows safely via text match query
  const filteredOrders = orders.filter(o => 
    o.customer.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.items.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const handleCreateProduct = (e) => {
    e.preventDefault();
    const processedImagesArray = productPayload.imageLinks.split(",").map(url => url.trim()).filter(Boolean);
    const processedColorsArray = productPayload.colors.split(",").map(c => c.trim()).filter(Boolean);
    const processedSizesArray = productPayload.sizes.split(",").map(s => s.trim()).filter(Boolean);

    alert(`✨ Product "${productPayload.name}" cataloged!\n📸 Images Saved: ${processedImagesArray.length}\n🎨 Colors Filtered: ${processedColorsArray.join(', ')}\n📏 Sizes Tracked: ${processedSizesArray.join(', ')}`);
    
    setProductPayload({ name: "", price: "", category: "Fragrance", imageLinks: "", colors: "", sizes: "", description: "" });
  };

  // Admin Live Chat Functions
  const sendAdminReply = (e) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !adminActiveSession) return;

    const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgObj = { sender: 'admin', text: adminReplyText, timestamp: currentTimeString };

    const updated = {
      ...chatSessions,
      [adminActiveSession]: [...(chatSessions[adminActiveSession] || []), newMsgObj]
    };

    setChatSessions(updated);
    localStorage.setItem('ma_chat_sessions', JSON.stringify(updated));
    setAdminReplyText("");
  };

  const markSessionResolved = (customerName) => {
    if (window.confirm(`Mark support session for "${customerName}" as Resolved?`)) {
      const updatedResolved = { ...resolvedSessions, [customerName]: true };
      setResolvedSessions(updatedResolved);
      localStorage.setItem('ma_resolved_sessions', JSON.stringify(updatedResolved));
      if (adminActiveSession === customerName) setAdminActiveSession(null);
    }
  };

  const activeUnresolvedChats = Object.keys(chatSessions).filter(name => !resolvedSessions[name]);

  return (
    <div className={`p-6 rounded-3xl space-y-8 ${darkMode ? 'bg-[#0E0E10] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* SECTION 1: ANALYTICS & REVENUE HERO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#1A1A1D] to-black p-6 rounded-2xl border border-white/5 shadow-xl">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Gross Revenue</p>
          <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BA963E] to-[#E5C158] mt-2">
            245,800 PKR
          </h2>
          <p className="text-[10px] text-green-400 mt-1">▲ +12% Growth this week</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1A1D] to-black p-6 rounded-2xl border border-white/5 shadow-xl">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Active Orders</p>
          <h2 className="text-3xl font-bold text-white mt-2">{orders.length} Units</h2>
          <p className="text-[10px] text-[#E5C158] mt-1">⚡ 1 Pending approval</p>
        </div>
        <div className="bg-gradient-to-br from-[#1A1A1D] to-black p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden">
          <p className="text-xs text-gray-400 uppercase tracking-widest">Inventory Alerts</p>
          <h2 className="text-3xl font-bold text-red-500 mt-2 animate-pulse">2 Items Low</h2>
          <p className="text-[10px] text-gray-400 mt-1">Oud Variant & Gold Edition Cufflinks</p>
        </div>
      </div>

      {/* NEW INTEGRATED SECTION: LIVE CUSTOMER SUPPORT TERMINAL */}
      <div className="bg-[#141417] p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <div>
            <h3 className="text-sm font-bold tracking-wider text-[#E5C158] uppercase flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              💬 Admin Live Support Terminal
            </h3>
            <p className="text-[10px] text-gray-400">Respond to customer inquiries in real-time</p>
          </div>
          <span className="bg-white/5 text-xs text-[#E5C158] px-3 py-1 rounded-full font-bold">
            {activeUnresolvedChats.length} Active Sessions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-80">
          {/* Chat List Column */}
          <div className="bg-black/40 rounded-xl border border-white/5 p-3 overflow-y-auto space-y-2">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-2">Customer Streams</p>
            {activeUnresolvedChats.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-8">No active chats requiring attention.</p>
            ) : (
              activeUnresolvedChats.map(name => (
                <div 
                  key={name}
                  onClick={() => setAdminActiveSession(name)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex justify-between items-center border ${
                    adminActiveSession === name ? 'bg-[#BA963E]/20 border-[#BA963E]' : 'bg-white/5 border-transparent hover:bg-white/10'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-white">{name}</p>
                    <p className="text-[9px] text-gray-400">{chatSessions[name]?.length || 0} messages</p>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); markSessionResolved(name); }}
                    className="text-[9px] bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white px-2 py-1 rounded-lg transition-all"
                  >
                    ✓ Resolve
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Active Chat Conversation Panel */}
          <div className="md:col-span-2 bg-black/40 rounded-xl border border-white/5 flex flex-col overflow-hidden">
            {adminActiveSession ? (
              <>
                <div className="p-3 bg-white/5 border-b border-white/5 flex justify-between items-center px-4">
                  <span className="text-xs font-bold text-[#E5C158]">{adminActiveSession}</span>
                  <button onClick={() => markSessionResolved(adminActiveSession)} className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg hover:opacity-90 cursor-pointer">
                    ✓ Close Ticket
                  </button>
                </div>

                <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
                  {(chatSessions[adminActiveSession] || []).map((m, idx) => (
                    <div key={idx} className={`flex flex-col ${m.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                      <div className={`p-2.5 rounded-xl max-w-[80%] ${m.sender === 'admin' ? 'bg-[#BA963E] text-black font-medium' : 'bg-white/10 text-white'}`}>
                        {m.image && <img src={m.image} alt="Attachment" className="max-h-28 rounded mb-1" />}
                        {m.text && <p>{m.text}</p>}
                      </div>
                      <span className="text-[8px] text-gray-500 mt-0.5">{m.timestamp}</span>
                    </div>
                  ))}
                  <div ref={chatAdminEndRef} />
                </div>

                <form onSubmit={sendAdminReply} className="p-2 border-t border-white/5 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type official admin response..." 
                    value={adminReplyText} 
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    className="flex-1 bg-black border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                  <button type="submit" className="bg-[#BA963E] text-black font-bold px-4 py-2 rounded-xl text-xs hover:opacity-90">
                    Send
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-xs">
                Select a customer stream from the left side to start responding.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE ORDER TRACKING & STATUS CONTROLLER WITH SEARCH FILTERS */}
      <div className="bg-[#141417] p-6 rounded-2xl border border-white/5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className="text-sm font-bold tracking-wider text-[#E5C158] uppercase">📦 Luxury Order Stream</h3>
          
          <input
            type="text"
            placeholder="Search Order ID, Customer..."
            value={orderSearch}
            onChange={(e) => setOrderSearch(e.target.value)}
            className="bg-black border border-white/10 rounded-xl p-2 text-[11px] text-white focus:outline-none w-full sm:w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 uppercase tracking-tight">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-mono font-bold text-[#E5C158]">{order.id}</td>
                    <td className="py-3 font-medium text-white">{order.customer}</td>
                    <td className="py-3">{order.total}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'Processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>{order.status}</span>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <select 
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-black text-[10px] text-gray-300 border border-white/10 rounded px-2 py-1 focus:outline-none"
                        defaultValue={order.status}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                      </select>
                      <button 
                        onClick={() => alert(`Generating Slip for ${order.id} - Invoice dispatched.`)}
                        className="bg-[#BA963E] text-black font-bold text-[10px] px-2.5 py-1 rounded hover:scale-105 transition-all cursor-pointer"
                      >
                        📄 Invoice
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500 text-xs">No records found matching tracking constraints.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: MULTI-IMAGE VARIANT PRODUCT CREATION MANAGER FORM */}
      <div className="bg-[#141417] p-6 rounded-2xl border border-white/5 shadow-xl">
        <h3 className="text-sm font-bold tracking-wider text-[#E5C158] uppercase mb-4">✨ Advanced Variant Product Provisioner</h3>
        
        <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-[10px] uppercase font-bold">Item Display Name</label>
              <input 
                type="text" required placeholder="e.g. Royal Silver Cufflinks"
                value={productPayload.name} onChange={(e) => setProductPayload({...productPayload, name: e.target.value})}
                className="bg-black border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-[10px] uppercase font-bold">Retail Price</label>
                <input 
                  type="text" required placeholder="e.g. 5,500 PKR"
                  value={productPayload.price} onChange={(e) => setProductPayload({...productPayload, price: e.target.value})}
                  className="bg-black border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-[10px] uppercase font-bold">Category Group</label>
                <select 
                  value={productPayload.category} onChange={(e) => setProductPayload({...productPayload, category: e.target.value})}
                  className="bg-black border border-white/10 rounded-xl p-2.5 text-gray-300 focus:outline-none text-xs"
                >
                  <option value="Fragrance">Fragrance</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Crafts">Crafts</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-[10px] uppercase font-bold">Product Media Array (URLs split by comma ",")</label>
              <textarea 
                rows="2" required placeholder="https://image1.jpg , https://image2.jpg (Add multiple pics for colors/angles)"
                value={productPayload.imageLinks} onChange={(e) => setProductPayload({...productPayload, imageLinks: e.target.value})}
                className="bg-black border border-white/10 rounded-xl p-2 text-white focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="space-y-3 flex flex-col justify-between">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-[10px] uppercase font-bold">Color Hex List (split by ",")</label>
                <input 
                  type="text" placeholder="#BA963E, #000000, #FFFFFF"
                  value={productPayload.colors} onChange={(e) => setProductPayload({...productPayload, colors: e.target.value})}
                  className="bg-black border border-white/10 rounded-xl p-2.5 text-white focus:outline-none font-mono"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-gray-400 text-[10px] uppercase font-bold">Size Metrics Sheet (split by ",")</label>
                <input 
                  type="text" placeholder="50ml, 100ml OR S, M, L"
                  value={productPayload.sizes} onChange={(e) => setProductPayload({...productPayload, sizes: e.target.value})}
                  className="bg-black border border-white/10 rounded-xl p-2.5 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-gray-400 text-[10px] uppercase font-bold">Curation Description Summary</label>
              <textarea 
                rows="2" placeholder="Describe variants details..."
                value={productPayload.description} onChange={(e) => setProductPayload({...productPayload, description: e.target.value})}
                className="bg-black border border-white/10 rounded-xl p-2 text-white focus:outline-none resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-[#BA963E] text-black font-bold text-xs py-2.5 rounded-xl hover:opacity-90 transition-all uppercase tracking-wider cursor-pointer">
              Publish Multi-Variant Stock Asset
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: COUPON ENGINE */}
      <div className="bg-[#141417] p-6 rounded-2xl border border-white/5 shadow-xl">
        <h3 className="text-sm font-bold tracking-wider text-[#E5C158] uppercase mb-4">🎫 Campaign & Coupon Manager</h3>
        <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <input 
            type="text" 
            placeholder="CODE (e.g. EXTRA15)" 
            value={newCoupon} 
            onChange={(e) => setNewCoupon(e.target.value)}
            className="bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
          <input 
            type="text" 
            placeholder="Discount Value (e.g. 15%)" 
            value={newDiscount} 
            onChange={(e) => setNewDiscount(e.target.value)}
            className="bg-black border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none"
          />
          <button type="submit" className="bg-[#BA963E] text-black font-bold text-xs rounded-xl hover:opacity-90 cursor-pointer">
            Launch Promo
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {coupons.map((c, i) => (
            <span key={i} className="text-[10px] font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-gray-300">
              🏷️ <strong className="text-white">{c.code}</strong> ({c.discount})
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}