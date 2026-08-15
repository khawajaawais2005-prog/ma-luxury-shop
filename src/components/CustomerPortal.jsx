import React, { useState, useEffect } from 'react';

export default function CustomerPortal({ addNotification }) {
  const [activeTab, setActiveTab] = useState('track');
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [foundOrder, setFoundOrder] = useState(null);

  // Complaints form state
  const [complaintForm, setComplaintForm] = useState({
    orderId: '',
    email: '',
    issueType: 'Delayed Shipment',
    description: ''
  });

  // LocalStorage se data read karna (Admin ke updates sync honge)
  const [orders, setOrders] = useState([]);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const loadSharedData = () => {
      const savedOrders = localStorage.getItem('ma_customer_orders');
      const savedComplaints = localStorage.getItem('ma_customer_complaints');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedComplaints) setComplaints(JSON.parse(savedComplaints));
    };

    loadSharedData();
    // Live polling/sync test
    const interval = setInterval(loadSharedData, 2000);
    return () => clearInterval(interval);
  }, []);

  // Order Track handler
  const handleTrackOrder = (e) => {
    e.preventDefault();
    const query = searchTrackingId.trim().toUpperCase();
    if (!query) return;

    const match = orders.find(o => o.id.toUpperCase() === query || o.trackingCode.toUpperCase() === query);
    if (match) {
      setFoundOrder(match);
    } else {
      setFoundOrder('NOT_FOUND');
    }
  };

  // Complaint Submit handler
  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    if (!complaintForm.orderId || !complaintForm.description) {
      alert("⚠️ Request fields fill karein!");
      return;
    }

    const newTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: complaintForm.orderId,
      issueType: complaintForm.issueType,
      description: complaintForm.description,
      email: complaintForm.email,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    const updatedComplaints = [newTicket, ...complaints];
    setComplaints(updatedComplaints);
    localStorage.setItem('ma_customer_complaints', JSON.stringify(updatedComplaints));

    if (addNotification) {
      addNotification("⚠️ Support Ticket Logged", `Ticket #${newTicket.id} has been submitted to Admin.`, "info");
    }

    alert(`✅ Complaint Submitted! Your Ticket ID is #${newTicket.id}`);
    setComplaintForm({ orderId: '', email: '', issueType: 'Delayed Shipment', description: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-xs text-white">
      {/* Header */}
      <div className="bg-[#121214] p-6 rounded-3xl border border-white/5 shadow-xl">
        <h1 className="text-xl font-serif text-[#E5C158]">MA Products Customer Express Hub</h1>
        <p className="text-gray-400 mt-1">Track your orders and view support ticket statuses live.</p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        <button 
          onClick={() => setActiveTab('track')}
          className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
            activeTab === 'track' ? 'bg-[#BA963E] text-black shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          🔍 Live Order Tracking
        </button>
        <button 
          onClick={() => setActiveTab('complaint')}
          className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
            activeTab === 'complaint' ? 'bg-[#BA963E] text-black shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          ⚠️ Register Support Ticket
        </button>
        <button 
          onClick={() => setActiveTab('my_tickets')}
          className={`px-4 py-2 rounded-xl font-bold cursor-pointer transition-all ${
            activeTab === 'my_tickets' ? 'bg-[#BA963E] text-black shadow-md' : 'bg-white/5 text-gray-400 hover:text-white'
          }`}
        >
          📄 My Tickets Status ({complaints.length})
        </button>
      </div>

      {/* TAB 1: ORDER TRACKING */}
      {activeTab === 'track' && (
        <div className="bg-[#121214] p-6 rounded-3xl border border-white/5 space-y-5 shadow-xl">
          <h2 className="text-sm font-bold text-[#E5C158] uppercase tracking-wider">Search Order Status</h2>
          <form onSubmit={handleTrackOrder} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Enter Order ID (e.g. ORD-9821) or Courier Code"
              value={searchTrackingId}
              onChange={(e) => setSearchTrackingId(e.target.value)}
              className="flex-1 bg-[#1A1A1D] border border-white/10 p-3 rounded-xl text-white focus:outline-none focus:border-[#BA963E]"
            />
            <button type="submit" className="bg-[#BA963E] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#E5C158] transition-all cursor-pointer">
              Search
            </button>
          </form>

          {/* Search Results */}
          {foundOrder === 'NOT_FOUND' && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-center">
              ❌ No order found matching this Order/Tracking ID. Please verify your reference number.
            </div>
          )}

          {foundOrder && foundOrder !== 'NOT_FOUND' && (
            <div className="bg-[#1A1A1D] p-5 rounded-2xl border border-[#BA963E]/30 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <span className="text-[#E5C158] font-mono font-bold text-base">#{foundOrder.id}</span>
                  <p className="text-gray-400 text-[10px]">Date: {foundOrder.date}</p>
                </div>
                <span className={`px-3 py-1.5 rounded-full font-bold uppercase text-[10px] ${
                  foundOrder.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {foundOrder.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-300">
                <div>
                  <span className="text-gray-500 block">Courier:</span>
                  <p className="font-bold text-white">{foundOrder.courier}</p>
                </div>
                <div>
                  <span className="text-gray-500 block">Tracking Code:</span>
                  <p className="font-mono text-[#E5C158] font-bold">{foundOrder.trackingCode}</p>
                </div>
                <div>
                  <span className="text-gray-500 block">Order Total:</span>
                  <p className="font-bold text-white">PKR {foundOrder.total?.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: REGISTER SUPPORT TICKET */}
      {activeTab === 'complaint' && (
        <div className="bg-[#121214] p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-[#E5C158] uppercase tracking-wider">File a Complaint / Issue</h2>
          <form onSubmit={handleSubmitComplaint} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 block mb-1">Order Reference ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. ORD-9821" 
                  value={complaintForm.orderId}
                  onChange={(e) => setComplaintForm({...complaintForm, orderId: e.target.value})}
                  className="w-full bg-[#1A1A1D] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#BA963E]"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Your Contact Email / Phone</label>
                <input 
                  type="text" 
                  placeholder="customer@gmail.com" 
                  value={complaintForm.email}
                  onChange={(e) => setComplaintForm({...complaintForm, email: e.target.value})}
                  className="w-full bg-[#1A1A1D] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#BA963E]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Issue Category</label>
              <select 
                value={complaintForm.issueType}
                onChange={(e) => setComplaintForm({...complaintForm, issueType: e.target.value})}
                className="w-full bg-[#1A1A1D] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#BA963E]"
              >
                <option value="Delayed Shipment">Delayed Shipment</option>
                <option value="Damaged Item Received">Damaged Item Received</option>
                <option value="Wrong Item Shipped">Wrong Item Shipped</option>
                <option value="Payment Issue">Payment Verification Issue</option>
                <option value="Other Query">Other Query</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Explain Details</label>
              <textarea 
                rows="3" 
                placeholder="Describe your issue clearly..."
                value={complaintForm.description}
                onChange={(e) => setComplaintForm({...complaintForm, description: e.target.value})}
                className="w-full bg-[#1A1A1D] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#BA963E]"
                required
              ></textarea>
            </div>

            <button type="submit" className="w-full bg-[#BA963E] text-black font-bold py-3 rounded-xl hover:bg-[#E5C158] transition-all uppercase tracking-wider cursor-pointer">
              🚀 Submit Ticket to Admin
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: TICKETS STATUS LIST */}
      {activeTab === 'my_tickets' && (
        <div className="bg-[#121214] p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-[#E5C158] uppercase tracking-wider">Filed Support Tickets & Admin Responses</h2>

          {complaints.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No support tickets found.</p>
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="bg-[#1A1A1D] p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <div>
                      <span className="font-mono text-[#E5C158] font-bold">Ticket #{c.id}</span>
                      <span className="text-gray-500 text-[10px] block">Order Ref: {c.orderId}</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                      c.status === 'Resolved (OK)' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                  <p className="text-white font-bold">{c.issueType}</p>
                  <p className="text-gray-400">{c.description}</p>
                  <div className="text-[10px] text-gray-500 pt-1 border-t border-white/5">
                    Submitted Date: {c.date}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}