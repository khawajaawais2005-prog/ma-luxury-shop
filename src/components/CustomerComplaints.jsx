import React, { useState, useEffect } from 'react';

export default function CustomerComplaints({ addNotification }) {
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('ma_customer_complaints');
    return saved ? JSON.parse(saved) : [];
  });

  const [orderId, setOrderId] = useState('');
  const [issueType, setIssueType] = useState('Damaged Product');
  const [description, setDescription] = useState('');
  const [proofImage, setProofImage] = useState(null);
  
  // State for image zoom modal
  const [activeImageModal, setActiveImageModal] = useState(null);

  useEffect(() => {
    localStorage.setItem('ma_customer_complaints', JSON.stringify(complaints));
  }, [complaints]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProofImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitComplaint = (e) => {
    e.preventDefault();
    const newTicket = {
      id: `TICKET-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId,
      issueType,
      description,
      proofImage,
      date: new Date().toLocaleDateString(),
      status: 'Under Investigation'
    };

    setComplaints([newTicket, ...complaints]);
    if (addNotification) {
      addNotification("🚨 Ticket Generated", `Complaint logged for Order #${orderId}`, "info");
    }

    setOrderId('');
    setDescription('');
    setProofImage(null);
    alert("✅ Complaint registered successfully! Ticket archived in local storage.");
  };

  const handleWithdrawTicket = (ticketId) => {
    if (window.confirm(`Are you sure you want to withdraw ${ticketId}?`)) {
      setComplaints(prev => prev.filter(c => c.id !== ticketId));
      if (addNotification) {
        addNotification("🗑️ Ticket Withdrawn", `${ticketId} has been canceled.`, "info");
      }
    }
  };

  return (
    <div className="space-y-6 text-xs text-gray-200 font-sans">
      
      {/* FORM */}
      <form onSubmit={handleSubmitComplaint} className="bg-black/30 p-5 rounded-2xl border border-white/5 space-y-4 shadow-xl">
        <h3 className="font-bold text-[#E5C158] uppercase tracking-wider text-sm flex items-center gap-2">
          <span>⚠️</span> Lodge Official Support Complaint
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-1 font-medium">Order / Tracking ID</label>
            <input 
              type="text" 
              placeholder="e.g. MA-90821" 
              value={orderId} 
              onChange={(e) => setOrderId(e.target.value)} 
              className="w-full bg-[#1A1A1D] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#BA963E]" 
              required 
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-medium">Issue Category</label>
            <select 
              value={issueType} 
              onChange={(e) => setIssueType(e.target.value)} 
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
          <label className="block text-gray-400 mb-1 font-medium">Detailed Description</label>
          <textarea 
            rows="3" 
            placeholder="Explain what went wrong..." 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            className="w-full bg-[#1A1A1D] border border-white/10 p-2.5 rounded-xl text-white focus:outline-none focus:border-[#BA963E] resize-none" 
            required
          ></textarea>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 cursor-pointer text-gray-300 font-bold transition-all flex items-center gap-2">
            <span>📸</span> Attach Proof Photo
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
          {proofImage ? (
            <div className="flex items-center gap-2">
              <img src={proofImage} alt="Preview" className="w-8 h-8 object-cover rounded-lg border border-[#BA963E]" />
              <span className="text-emerald-400 font-mono text-[10px]">✓ Image Attached</span>
            </div>
          ) : (
            <span className="text-gray-500 text-[10px]">No image attached (Optional)</span>
          )}
        </div>

        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-lg">
          Register Ticket
        </button>
      </form>

      {/* TICKET ARCHIVE */}
      {complaints.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold text-[#E5C158] uppercase tracking-wider text-xs flex justify-between items-center">
            <span>Active Complaints Log</span>
            <span className="bg-white/5 text-gray-400 px-2 py-0.5 rounded-full text-[10px]">{complaints.length} Filed</span>
          </h4>

          {complaints.map((c) => (
            <div key={c.id} className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:border-white/10 transition-all">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-red-400">{c.id}</span>
                  <span className="text-gray-400">• Order #{c.orderId}</span>
                  <span className="text-gray-600 text-[9px]">• {c.date}</span>
                </div>
                <p className="font-bold text-white text-xs">{c.issueType}</p>
                <p className="text-gray-400 text-[11px] max-w-xl">{c.description}</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-white/5 pt-2 md:pt-0">
                {c.proofImage && (
                  <button 
                    type="button"
                    onClick={() => setActiveImageModal(c.proofImage)}
                    className="relative group cursor-pointer"
                  >
                    <img src={c.proofImage} alt="Proof" className="w-10 h-10 object-cover rounded-lg border border-white/10 group-hover:opacity-80 transition-all" />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] bg-black/60 opacity-0 group-hover:opacity-100 rounded-lg transition-all text-white font-bold">🔍</span>
                  </button>
                )}

                <span className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border ${
                  c.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  c.status === 'Closed' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {c.status}
                </span>

                <button 
                  type="button"
                  onClick={() => handleWithdrawTicket(c.id)}
                  className="text-gray-500 hover:text-red-400 text-xs px-2 py-1 rounded-lg transition-all cursor-pointer"
                  title="Withdraw Ticket"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULL-SCREEN IMAGE MODAL */}
      {activeImageModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveImageModal(null)}
        >
          <div className="relative max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <button 
              onClick={() => setActiveImageModal(null)}
              className="absolute top-3 right-3 bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-black transition-all cursor-pointer"
            >
              ✕
            </button>
            <img src={activeImageModal} alt="Enlarged Proof" className="w-full h-full object-contain max-h-[80vh]" />
          </div>
        </div>
      )}

    </div>
  );
}