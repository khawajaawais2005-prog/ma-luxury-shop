import React, { useState, useEffect } from 'react';

export default function CustomerSuite({ darkMode, addNotification }) {
  // --- 0. SUITE NAVIGATION TAB STATE ---
  const [activeTab, setActiveTab] = useState("showcase"); // 'showcase' | 'orders' | 'complaints' | 'security'

  // --- EXISTING STATES ---
  const [trackId, setTrackId] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [wishlist, setWishlist] = useState(["Oud Wood Luxury Mist"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVariants, setSelectedVariants] = useState({});

  // --- NEW FEATURES STATES (Saved to LocalStorage) ---
  const [orders] = useState(() => {
    const saved = localStorage.getItem('ma_customer_orders');
    return saved ? JSON.parse(saved) : [
      { id: 'MA-90821', date: '2026-08-10', total: 8500, status: 'In Transit', trackingCode: 'TCS-889102', courier: 'TCS Express', items: 2 },
      { id: 'MA-88120', date: '2026-07-28', total: 14200, status: 'Delivered', trackingCode: 'MNP-441029', courier: 'M&P Courier', items: 3 }
    ];
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('ma_customer_complaints');
    return saved ? JSON.parse(saved) : [];
  });

  const [complaintForm, setComplaintForm] = useState({
    orderId: '',
    issueType: 'Damaged Product',
    description: '',
    proofImage: null
  });

  const [securitySessions] = useState(() => {
    const saved = localStorage.getItem('ma_login_sessions');
    return saved ? JSON.parse(saved) : [
      { id: 1, device: 'Chrome / Windows 11', ip: '39.45.102.12', location: 'Islamabad, PK', time: '14 Aug 2026 - 10:27 AM', active: true },
      { id: 2, device: 'Mobile Safari / iPhone 14 Pro', ip: '182.185.12.90', location: 'Rawalpindi, PK', time: '11 Aug 2026 - 09:15 PM', active: false }
    ];
  });

  // Sync Complaints to LocalStorage
  useEffect(() => {
    localStorage.setItem('ma_customer_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Existing Sample Data
  const sampleProducts = [
    { 
      id: "prod-1",
      name: "Oud Wood Luxury Mist", 
      price: "8,900 PKR", 
      category: "Fragrance",
      images: [
        "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=500&q=80"
      ],
      colors: ["#BA963E", "#1A1A1A"],
      sizes: ["50ml", "100ml"]
    },
    { 
      id: "prod-2",
      name: "Chronograph Gold Watch", 
      price: "34,500 PKR", 
      category: "Accessories",
      images: [
        "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=500&q=80"
      ],
      colors: ["#BA963E"],
      sizes: ["Standard"]
    },
    { 
      id: "prod-3",
      name: "Leather Minimalist Wallet", 
      price: "4,200 PKR", 
      category: "Crafts",
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=80"
      ],
      colors: ["#8B4513", "#000000"],
      sizes: ["Slim", "Bi-Fold"]
    }
  ];

  // Handlers
  const handleTrackOrder = (e) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    setTrackingResult({
      id: trackId,
      status: "Dispatched",
      carrier: "TCS Luxury Delivery Node",
      eta: "3 Days"
    });
  };

  const updateProductVariant = (productId, key, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: { ...prev[productId], [key]: value }
    }));
  };

  const handleComplaintImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setComplaintForm(prev => ({ ...prev, proofImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleLodgeComplaint = (e) => {
    e.preventDefault();
    if (!complaintForm.orderId || !complaintForm.description) return;

    const newTicket = {
      id: `TICKET-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: complaintForm.orderId,
      issueType: complaintForm.issueType,
      description: complaintForm.description,
      proofImage: complaintForm.proofImage,
      date: new Date().toLocaleDateString(),
      status: 'Under Investigation'
    };

    setComplaints([newTicket, ...complaints]);
    if (addNotification) {
      addNotification("🚨 Ticket Generated", `Complaint logged for Order #${complaintForm.orderId}`, "info");
    }

    setComplaintForm({ orderId: '', issueType: 'Damaged Product', description: '', proofImage: null });
    alert("✅ Complaint registered successfully!");
  };

  const filteredProducts = sampleProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`p-6 rounded-3xl space-y-6 ${darkMode ? 'bg-[#0E0E10] text-white' : 'bg-white text-gray-900'}`}>
      
      {/* 🧭 NAVIGATION TAB BAR */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab('showcase')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'showcase' ? 'bg-[#BA963E] text-black shadow-lg' : 'bg-black/30 text-gray-400 hover:text-white'
          }`}
        >
          ✨ Store Showcase & Search
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'orders' ? 'bg-[#BA963E] text-black shadow-lg' : 'bg-black/30 text-gray-400 hover:text-white'
          }`}
        >
          📦 Order History & Tracker
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'complaints' ? 'bg-[#BA963E] text-black shadow-lg' : 'bg-black/30 text-gray-400 hover:text-white'
          }`}
        >
          ⚠️ Support & Complaints
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'security' ? 'bg-[#BA963E] text-black shadow-lg' : 'bg-black/30 text-gray-400 hover:text-white'
          }`}
        >
          🔒 Account Security
        </button>
      </div>

      {/* ==================== TAB 1: SHOWCASE & SEARCH ==================== */}
      {activeTab === 'showcase' && (
        <div className="space-y-6">
          {/* 🔍 TOP GLOBAL SEARCH ENGINE BLOCK */}
          <div className="bg-[#141417] border border-white/5 p-5 rounded-2xl shadow-xl">
            <div className="max-w-xl mx-auto text-center space-y-3">
              <label className="text-xs font-bold tracking-widest text-[#E5C158] uppercase block">
                What are you looking for today?
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400 text-sm">🔍</span>
                <input
                  type="text"
                  placeholder="Type product name, brand, or category here..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black border border-white/10 text-xs rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#BA963E] transition-colors shadow-inner"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")} 
                    className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white text-xs"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TRACKING & WISHLIST ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#141417] border border-white/5 p-5 rounded-2xl shadow-xl">
              <h3 className="text-xs font-bold tracking-widest text-[#E5C158] uppercase mb-3">❤️ Saved Curation ({wishlist.length})</h3>
              {wishlist.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-2 text-white">
                  <span>✨ {item}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#141417] border border-white/5 p-5 rounded-2xl shadow-xl">
              <h3 className="text-xs font-bold tracking-widest text-[#E5C158] uppercase mb-3">📦 Quick Track Package</h3>
              <form onSubmit={handleTrackOrder} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter Order ID..."
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  className="flex-1 bg-black border border-white/10 rounded-xl p-2 text-xs text-white focus:outline-none"
                />
                <button type="submit" className="bg-[#BA963E] text-black text-xs font-bold px-4 rounded-xl cursor-pointer">Track</button>
              </form>
              {trackingResult && (
                <div className="mt-3 p-2 bg-black/40 rounded-xl border border-white/5 text-[10px] space-y-1">
                  <p className="text-[#E5C158]">Status: <span className="text-white font-bold">{trackingResult.status}</span></p>
                  <p className="text-gray-400">Carrier: {trackingResult.carrier}</p>
                </div>
              )}
            </div>
          </div>

          {/* DYNAMIC EXHIBITION SHOWCASE */}
          <div className="bg-[#141417] border border-white/5 p-5 rounded-2xl shadow-xl space-y-4">
            <div>
              <h3 className="text-xs font-bold tracking-widest text-[#E5C158] uppercase">⚡ Premium Showcase</h3>
              {searchQuery && (
                <p className="text-[10px] text-gray-400 mt-1">
                  Showing results for: <span className="text-[#E5C158]">"{searchQuery}"</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p, i) => {
                  const currentImgIdx = selectedVariants[p.id]?.imgIndex || 0;
                  const activeImage = p.images[currentImgIdx] || p.images[0];
                  const activeColor = selectedVariants[p.id]?.color || (p.colors ? p.colors[0] : null);
                  const activeSize = selectedVariants[p.id]?.size || (p.sizes ? p.sizes[0] : null);

                  return (
                    <div key={i} className="bg-black/40 border border-white/5 p-4 rounded-2xl flex flex-col justify-between">
                      <div>
                        <div className="w-full h-40 bg-zinc-900 rounded-xl overflow-hidden mb-3 relative">
                          <img src={activeImage} alt={p.name} className="w-full h-full object-cover" />
                          {p.images.length > 1 && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 bg-black/50 px-2 py-1 rounded-full">
                              {p.images.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => updateProductVariant(p.id, 'imgIndex', idx)}
                                  className={`w-1.5 h-1.5 rounded-full ${currentImgIdx === idx ? 'bg-[#E5C158]' : 'bg-gray-500'}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <span className="text-[9px] uppercase tracking-wider text-gray-500">{p.category}</span>
                        <h4 className="text-xs font-bold text-white mt-1">{p.name}</h4>
                        
                        {/* Attributes View */}
                        <div className="mt-3 pt-2 border-t border-white/5 space-y-2">
                          {p.colors && (
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-gray-500 w-8">Color:</span>
                              <div className="flex gap-1">
                                {p.colors.map((hex, cIdx) => (
                                  <button
                                    key={cIdx}
                                    onClick={() => {
                                      updateProductVariant(p.id, 'color', hex);
                                      if (p.images[cIdx]) updateProductVariant(p.id, 'imgIndex', cIdx);
                                    }}
                                    style={{ backgroundColor: hex }}
                                    className={`w-3 h-3 rounded-full border ${activeColor === hex ? 'border-[#E5C158] scale-110' : 'border-white/20'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {p.sizes && (
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-gray-500 w-8">Size:</span>
                              <div className="flex gap-1">
                                {p.sizes.map((sz, sIdx) => (
                                  <button
                                    key={sIdx}
                                    onClick={() => updateProductVariant(p.id, 'size', sz)}
                                    className={`text-[9px] px-1.5 py-0.5 rounded border ${activeSize === sz ? 'bg-[#BA963E]/20 text-[#E5C158] border-[#BA963E]' : 'text-gray-400 border-white/10'}`}
                                  >
                                    {sz}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/5">
                        <span className="text-xs font-semibold text-[#E5C158]">{p.price}</span>
                        <button 
                          onClick={() => alert(`${p.name} Added!`)}
                          className="bg-white/5 hover:bg-[#BA963E] hover:text-black text-[10px] font-bold px-2.5 py-1 rounded-lg text-white transition-colors cursor-pointer"
                        >
                          + Buy
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-6 text-center text-xs text-gray-500">
                  No upscale products found matching "{searchQuery}".
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: ORDER HISTORY & TRACKER ==================== */}
      {activeTab === 'orders' && (
        <div className="space-y-4 text-xs text-gray-200 bg-[#141417] p-5 rounded-2xl border border-white/5">
          <h3 className="font-bold text-[#E5C158] uppercase tracking-wider text-sm">📦 Your Order History & Courier Tracker</h3>
          
          <div className="space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div>
                    <span className="font-mono text-[#E5C158] font-bold text-sm">Order #{ord.id}</span>
                    <span className="text-gray-500 text-[10px] block">{ord.date}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg font-bold font-mono text-[10px] ${
                    ord.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                  }`}>
                    ● {ord.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-gray-400">
                  <div>
                    <span className="block text-[10px] text-gray-500">Total Bill</span>
                    <span className="text-white font-bold">PKR {ord.total}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">Items</span>
                    <span className="text-white">{ord.items} Items</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">Courier</span>
                    <span className="text-white">{ord.courier}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500">Tracking Ref</span>
                    <span className="text-[#E5C158] font-mono font-bold">{ord.trackingCode}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB 3: COMPLAINTS CENTER ==================== */}
      {activeTab === 'complaints' && (
        <div className="space-y-6 text-xs text-gray-200 bg-[#141417] p-5 rounded-2xl border border-white/5">
          <form onSubmit={handleLodgeComplaint} className="bg-black/30 p-5 rounded-2xl border border-white/5 space-y-4">
            <h3 className="font-bold text-[#E5C158] uppercase tracking-wider text-sm">⚠️ Lodge Official Support Complaint</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-1">Order / Tracking ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. MA-90821" 
                  value={complaintForm.orderId} 
                  onChange={(e) => setComplaintForm({...complaintForm, orderId: e.target.value})} 
                  className="w-full bg-[#1A1A1D] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#BA963E]" 
                  required 
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">Issue Category</label>
                <select 
                  value={complaintForm.issueType} 
                  onChange={(e) => setComplaintForm({...complaintForm, issueType: e.target.value})} 
                  className="w-full bg-[#1A1A1D] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#BA963E]"
                >
                  <option value="Damaged Product">Damaged Product / Broken Seal</option>
                  <option value="Delayed Delivery">Delayed Delivery / Location Issue</option>
                  <option value="Wrong Size">Wrong Item / Size Exchange</option>
                  <option value="Payment Issue">Payment Verification Error</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-1">Detailed Description</label>
              <textarea 
                rows="3" 
                placeholder="Explain what went wrong..." 
                value={complaintForm.description} 
                onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})} 
                className="w-full bg-[#1A1A1D] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#BA963E]" 
                required
              ></textarea>
            </div>

            <div className="flex items-center gap-4">
              <label className="bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 cursor-pointer text-gray-300 font-bold">
                📸 Attach Proof Photo
                <input type="file" accept="image/*" onChange={handleComplaintImage} className="hidden" />
              </label>
              {complaintForm.proofImage && <span className="text-emerald-400 font-mono text-[10px]">✓ Image Attached</span>}
            </div>

            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl uppercase tracking-wider transition-all cursor-pointer">
              Register Ticket
            </button>
          </form>

          {complaints.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-[#E5C158] uppercase tracking-wider text-xs">Active Complaints Log</h4>
              {complaints.map((c) => (
                <div key={c.id} className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-red-400">{c.id}</span>
                      <span className="text-gray-400">• Order #{c.orderId}</span>
                    </div>
                    <p className="font-bold text-white">{c.issueType}</p>
                    <p className="text-gray-400 text-[11px]">{c.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {c.proofImage && <img src={c.proofImage} alt="Proof" className="w-10 h-10 object-cover rounded-lg border border-white/10" />}
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold">
                      {c.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================== TAB 4: SECURITY LOGS ==================== */}
      {activeTab === 'security' && (
        <div className="space-y-4 text-xs text-gray-200 bg-[#141417] p-5 rounded-2xl border border-white/5">
          <div className="border-b border-white/5 pb-2">
            <h3 className="font-bold text-[#E5C158] uppercase tracking-wider text-sm">🔒 Security & Active Login Logs</h3>
            <p className="text-gray-500 text-[11px]">Authorized devices and IP connections linked to your account.</p>
          </div>

          <div className="space-y-2">
            {securitySessions.map((s) => (
              <div key={s.id} className="bg-black/30 p-3.5 rounded-xl border border-white/5 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{s.device}</span>
                    {s.active && <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">CURRENT SESSION</span>}
                  </div>
                  <p className="text-gray-500 font-mono text-[10px]">IP Address: {s.ip} • {s.location}</p>
                  <p className="text-gray-600 text-[9px]">{s.time}</p>
                </div>
                
                <span className={`text-[10px] font-mono ${s.active ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {s.active ? '● Authorized' : 'Logged Out'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}