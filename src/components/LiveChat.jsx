import React, { useState, useEffect, useRef } from 'react';

export default function LiveChat({ 
  isAdmin, 
  darkMode, 
  chatSessions, 
  setChatSessions, 
  onClose, 
  addNotification,
  // 🌟 NEW PROPS (Bina purana code tode naye features support karne ke liye)
  isOpen: externalIsOpen,
  autoOpenSession,
  initialMessage
}) {
  // 💾 LOCALSTORAGE INITIALIZERS
  const [localChatSessions, setLocalChatSessions] = useState(() => {
    const saved = localStorage.getItem('ma_chat_sessions');
    return saved ? JSON.parse(saved) : {};
  });

  const [activeSession, setActiveSession] = useState(null); 
  const [customerName, setCustomerName] = useState(""); 
  const [isRegistered, setIsRegistered] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(externalIsOpen ?? true);

  const [resolvedSessions, setResolvedSessions] = useState(() => {
    const saved = localStorage.getItem('ma_resolved_sessions');
    return saved ? JSON.parse(saved) : {};
  }); 

  const [selectedFile, setSelectedFile] = useState(null); 
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // Sync external open state if controlled from parent (e.g. Order Placed)
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen);
    }
  }, [externalIsOpen]);

  // Handle Auto-Session & Order Message Injection on Order Confirm
  useEffect(() => {
    if (autoOpenSession) {
      setCustomerName(autoOpenSession);
      setActiveSession(autoOpenSession);
      setIsRegistered(true);
      setIsOpen(true);

      if (initialMessage) {
        sendMessageStream(
          typeof initialMessage === 'object' ? initialMessage.text : initialMessage, 
          'Customer', 
          autoOpenSession, 
          null, 
          true // Mark as Order Message
        );
      }
    }
  }, [autoOpenSession, initialMessage]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('ma_chat_sessions', JSON.stringify(chatSessions || localChatSessions));
  }, [chatSessions, localChatSessions]);

  useEffect(() => {
    localStorage.setItem('ma_resolved_sessions', JSON.stringify(resolvedSessions));
  }, [resolvedSessions]);

  // Combined sessions target
  const currentChatData = chatSessions || localChatSessions;
  const sessionsList = Object.keys(currentChatData)
    .filter(name => !resolvedSessions[name])
    .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Auto Scroll to bottom on new messages
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentChatData, activeSession]);

  const customerFAQs = [
    { q: "What is your delivery time?", a: "Standard delivery takes 3 to 5 business days across Pakistan." },
    { q: "What is your return policy?", a: "We offer a 7-day hassle-free return policy for exchange or store credit." },
    { q: "Are your luxury products authentic?", a: "Yes, 100% genuine luxury curation with premium quality assurance." }
  ];

  // Image Upload Reader
  const handleImageAttach = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const initCustomerSession = (e) => {
    e.preventDefault();
    const formattedName = customerName.trim();
    if (!formattedName) return;
    
    setActiveSession(formattedName);
    setIsRegistered(true);

    const initStructure = (prev) => {
      const safePrev = prev || {};
      if (!safePrev[formattedName]) {
        return { ...safePrev, [formattedName]: [] };
      }
      return safePrev;
    };

    if (setChatSessions) setChatSessions(prev => initStructure(prev));
    setLocalChatSessions(prev => initStructure(prev));
  };

  const sendMessageStream = (textMsg, senderType, sessionTarget, imageMedia = null, isOrderMsg = false) => {
    const currentTimeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgObj = { 
      sender: senderType, 
      text: textMsg, 
      image: imageMedia, 
      timestamp: currentTimeString,
      isOrderMessage: isOrderMsg
    };

    const updateStructure = (prev) => {
      const safePrev = prev || {};
      const currentLogs = safePrev[sessionTarget] ? [...safePrev[sessionTarget]] : [];
      return {
        ...safePrev,
        [sessionTarget]: [...currentLogs, newMsgObj]
      };
    };

    if (setChatSessions) setChatSessions(prev => updateStructure(prev));
    setLocalChatSessions(prev => updateStructure(prev));

    // Increase unread count if widget is closed and admin sends message
    if (!isOpen && (senderType === 'admin' || senderType === 'Admin')) {
      setUnreadCount(prev => prev + 1);
    }

    if (addNotification) {
      addNotification(
        senderType.toLowerCase() === 'admin' ? "💬 Admin Message Sent" : "📩 Customer Message",
        `New activity in ${sessionTarget}'s chat session.`,
        "info"
      );
    }
  };

  const dispatchMessage = (e) => {
    e.preventDefault();
    if (!typedMessage.trim() && !selectedFile) return;

    const currentActive = isAdmin ? activeSession : activeSession || customerName.trim();
    if (!currentActive) return;

    sendMessageStream(typedMessage, isAdmin ? 'Admin' : 'Customer', currentActive, selectedFile);
    setTypedMessage("");
    setSelectedFile(null); 
  };

  const handleFAQClick = (faq) => {
    const sessionTag = activeSession || customerName.trim();
    if (!sessionTag) return;
    
    sendMessageStream(faq.q, 'Customer', sessionTag);
    setTimeout(() => {
      sendMessageStream(faq.a, 'Admin', sessionTag);
    }, 400);
  };

  const handleOpenChat = (name) => {
    setActiveSession(name);
  };

  const handleResolveIssue = () => {
    if (!activeSession) return;
    if (window.confirm(`⚠️ RESOLVE TICKET:\nClose session for "${activeSession}"?`)) {
      setResolvedSessions(prev => ({ ...prev, [activeSession]: true }));
      setActiveSession(null);
      if (addNotification) {
        addNotification("✅ Ticket Closed", "Chat session resolved successfully.", "info");
      }
    }
  };

  const activeChatLogs = activeSession ? (currentChatData[activeSession] || []) : [];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* FLOATING CHAT BUTTON WITH UNREAD BADGE */}
      {!isOpen && (
        <button 
          onClick={() => { setIsOpen(true); setUnreadCount(0); }}
          className="relative bg-[#BA963E] hover:bg-[#E5C158] text-black font-bold p-4 rounded-full shadow-2xl transition-all cursor-pointer flex items-center justify-center text-lg"
        >
          💬
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce border-2 border-black">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className={`w-[360px] sm:w-[400px] h-[540px] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${
          darkMode ? 'bg-[#121214] border-white/10 text-white' : 'bg-[#121214] border-white/10 text-white'
        }`}>
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-[#1A1A1D] to-black p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <div>
                <h3 className="text-xs tracking-widest text-[#E5C158] font-bold uppercase">💬 MA Store Live App Desk</h3>
                <p className="text-[10px] text-gray-400">{isAdmin ? "⚡ Operational Console" : "🔒 End-to-End Encryption"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && activeSession && (
                <button 
                  onClick={handleResolveIssue}
                  className="bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600 hover:text-white px-2 py-1 rounded-lg text-[9px] font-bold cursor-pointer"
                >
                  ✓ Resolve
                </button>
              )}
              <button onClick={() => { setIsOpen(false); if(onClose) onClose(); }} className="text-gray-400 hover:text-white text-sm bg-white/5 w-7 h-7 flex items-center justify-center rounded-full cursor-pointer">✕</button>
            </div>
          </div>

          {/* BODY ROUTER */}
          {isAdmin ? (
            <div className="flex-1 flex flex-col bg-[#17171A] overflow-hidden">
              {!activeSession ? (
                /* ADMIN LIST */
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-2.5 bg-black/40 border-b border-white/5">
                    <input type="text" placeholder="🔍 Search active streams..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#1A1A1D] border border-white/10 rounded-xl p-2 text-[11px] text-white focus:outline-none" />
                  </div>
                  <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                    {sessionsList.length === 0 ? (
                      <p className="text-center text-gray-500 text-xs p-6">No active unresolved chats.</p>
                    ) : (
                      sessionsList.map((name) => (
                        <div key={name} onClick={() => handleOpenChat(name)} className="p-4 cursor-pointer hover:bg-white/[0.04] flex justify-between items-center">
                          <p className="text-xs font-bold text-[#E5C158]">{name}</p>
                          <span className="bg-white/5 text-gray-400 text-[10px] px-2 py-0.5 rounded-full">{currentChatData[name]?.length || 0}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* ADMIN CHAT WINDOW */
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="p-3 border-b border-white/5 bg-black/30 flex justify-between items-center px-4">
                    <span className="text-xs font-bold text-white">{activeSession}</span>
                    <button onClick={() => setActiveSession(null)} className="bg-white/5 text-gray-300 text-[10px] font-bold px-2.5 py-1.5 rounded-xl cursor-pointer">⬅️ Back</button>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-3 text-[11px]">
                    {activeChatLogs.map((m, index) => {
                      const isAdminMsg = m.sender?.toLowerCase() === 'admin';
                      return (
                        <div key={index} className={`flex flex-col ${isAdminMsg ? 'items-end' : 'items-start'}`}>
                          <span className="text-[9px] text-gray-500 mb-0.5">{m.sender} • {m.timestamp}</span>
                          <div className={`p-3 rounded-2xl max-w-[85%] space-y-1 whitespace-pre-wrap leading-relaxed ${
                            m.isOrderMessage
                              ? 'bg-[#1A1A1D] border border-[#BA963E]/40 text-[#E5C158] font-mono'
                              : isAdminMsg
                              ? 'bg-[#BA963E] text-black font-medium'
                              : 'bg-[#26262B] text-white border border-white/10'
                          }`}>
                            {m.image && <img src={m.image} alt="Attachment" className="w-full max-h-36 object-cover rounded-xl mb-1" />}
                            {m.text && <p>{m.text}</p>}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* MEDIA PREVIEW */}
                  {selectedFile && (
                    <div className="px-4 py-1.5 bg-black/40 border-t border-white/5 flex items-center justify-between">
                      <img src={selectedFile} alt="Preview" className="w-7 h-7 object-cover rounded-md" />
                      <button onClick={() => setSelectedFile(null)} className="text-red-400 text-xs font-bold cursor-pointer">✕</button>
                    </div>
                  )}

                  <form onSubmit={dispatchMessage} className="p-3 bg-black/40 border-t border-white/5 flex gap-2 items-center">
                    <label className="bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/10 cursor-pointer">
                      📸
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageAttach} className="hidden" />
                    </label>
                    <input type="text" placeholder="Type message..." value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} className="flex-1 bg-[#1A1A1D] border border-white/5 text-white rounded-xl p-2.5 text-[11px] focus:outline-none" />
                    <button type="submit" className="bg-[#BA963E] text-black px-4 py-2.5 rounded-xl text-[11px] font-bold cursor-pointer">Send</button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            /* CUSTOMER VIEW */
            <div className="flex-1 flex flex-col justify-between bg-[#17171A] overflow-hidden">
              {!isRegistered ? (
                <form onSubmit={initCustomerSession} className="m-auto p-6 text-center space-y-4 w-full max-w-xs">
                  <p className="text-xs text-gray-400">Please enter your name to initiate live support connection:</p>
                  <input type="text" placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-[#1A1A1D] border border-[#BA963E]/30 text-center p-3 rounded-xl text-xs text-white focus:outline-none" required />
                  <button type="submit" className="w-full bg-[#BA963E] text-black font-bold py-2.5 rounded-xl text-xs uppercase cursor-pointer">Connect Terminal</button>
                </form>
              ) : (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="flex-1 p-4 overflow-y-auto space-y-2.5 text-[11px]">
                    {activeChatLogs.length === 0 ? (
                      <p className="text-center text-gray-500 my-auto">No messages yet. Try typing below or use Quick Questions!</p>
                    ) : (
                      activeChatLogs.map((m, index) => {
                        const isCustomerMsg = m.sender?.toLowerCase() === 'customer';
                        return (
                          <div key={index} className={`flex flex-col ${isCustomerMsg ? 'items-end' : 'items-start'}`}>
                            <span className="text-[9px] text-gray-500 mb-0.5">{m.sender} • {m.timestamp}</span>
                            <div className={`p-2.5 rounded-2xl max-w-[85%] space-y-1 whitespace-pre-wrap leading-relaxed ${
                              m.isOrderMessage
                                ? 'bg-[#1A1A1D] border border-[#BA963E]/40 text-[#E5C158] font-mono'
                                : isCustomerMsg
                                ? 'bg-[#BA963E] text-black font-medium'
                                : 'bg-[#26262B] text-white border border-white/10'
                            }`}>
                              {m.image && <img src={m.image} alt="Attachment" className="w-full max-h-36 object-cover rounded-xl mb-1" />}
                              {m.text && <p>{m.text}</p>}
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* QUICK QUESTIONS */}
                  <div className="p-2 bg-black/20 border-t border-white/5 space-y-1 px-3">
                    <p className="text-[8px] text-gray-500 uppercase font-bold">Quick Questions:</p>
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      {customerFAQs.map((faq, i) => (
                        <button key={i} type="button" onClick={() => handleFAQClick(faq)} className="text-[9px] bg-[#BA963E]/10 text-[#E5C158] px-2.5 py-1.5 rounded-lg border border-[#BA963E]/20 whitespace-nowrap cursor-pointer">{faq.q}</button>
                      ))}
                    </div>
                  </div>

                  {/* MEDIA PREVIEW */}
                  {selectedFile && (
                    <div className="px-4 py-1.5 bg-black/40 border-t border-white/5 flex items-center justify-between">
                      <img src={selectedFile} alt="Preview" className="w-7 h-7 object-cover rounded-md" />
                      <button onClick={() => setSelectedFile(null)} className="text-red-400 text-xs font-bold cursor-pointer">✕</button>
                    </div>
                  )}

                  {/* CHAT INPUT */}
                  <form onSubmit={dispatchMessage} className="p-3 bg-black/30 border-t border-white/5 flex gap-2 items-center">
                    <label className="bg-white/5 hover:bg-white/10 p-2 rounded-xl border border-white/10 cursor-pointer">
                      📸
                      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageAttach} className="hidden" />
                    </label>
                    <input type="text" placeholder="Type message here..." value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} className="flex-1 bg-[#1A1A1D] border border-white/5 text-white rounded-xl p-2.5 text-[11px] focus:outline-none" />
                    <button type="submit" className="bg-[#BA963E] text-black px-4 py-2.5 rounded-xl text-[11px] font-bold cursor-pointer">Send</button>
                  </form>
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
}