import React, { useEffect, useMemo, useRef, useState } from 'react';
 
// ============================================================================
// MA PRODUCTS - LIVE CUSTOMER SUPPORT CHAT
// ============================================================================
// This component is intentionally self-contained so it can be dropped into
// the existing project without removing the current storefront logic.
//
// Storage behavior:
//   - Messages are persisted in localStorage.
//   - BroadcastChannel + storage events make open tabs/windows update quickly.
//   - A future server adapter can replace the storage functions without
//     changing the chat UI.
//
// Important production note:
//   localStorage is browser-local. For customer and admin on different devices,
//   connect the marked persistence functions to the existing backend/database.
//   The UI and data shape below are already designed for that upgrade.
// ============================================================================
 
const CHAT_STORAGE_KEY = 'ma_live_chat_sessions';
const CHAT_CHANNEL_NAME = 'ma_live_chat_channel';
const CUSTOMER_ID_KEY = 'ma_chat_customer_id';
const MAX_FILE_SIZE = 8 * 1024 * 1024;
 
const makeId = (prefix = 'ID') =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
 
const getStableCustomerId = () => {
  const existing = localStorage.getItem(CUSTOMER_ID_KEY);
  if (existing) return existing;
  const created = makeId('CUS');
  localStorage.setItem(CUSTOMER_ID_KEY, created);
  return created;
};
 
const readSessions = () => {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};
 
const writeSessions = (sessions) => {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(sessions));
};
 
const formatTime = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};
 
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
 
const createSession = (customerId) => ({
  id: makeId('CHAT'),
  customerId,
  customerName: localStorage.getItem('ma_customer_name') || 'Customer',
  status: 'open',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  unreadForAdmin: 0,
  unreadForCustomer: 0,
  messages: []
});
 
const createMessage = ({ sender, text = '', attachment = null, product = null }) => ({
  id: makeId('MSG'),
  sender,
  text: text.trim(),
  attachment,
  product,
  createdAt: Date.now()
});
 
const getLastMessage = (session) => {
  const messages = session?.messages || [];
  return messages.length ? messages[messages.length - 1] : null;
};
 
const getSessionPreview = (session) => {
  const last = getLastMessage(session);
  if (!last) return 'No messages yet';
  if (last.text) return last.text;
  if (last.product) return 'Product shared';
  if (last.attachment?.kind === 'image') return 'Image sent';
  if (last.attachment?.kind === 'video') return 'Video sent';
  return 'Attachment sent';
};
 
export default function LiveChat({
  isOpen = true,
  isAdmin = false,
  darkMode = true,
  products = [],
  customerId,
  onClose,
  roboticQuestions = [],
  roboticAnswers = {}
}) {
  const resolvedCustomerId = customerId || getStableCustomerId();
  const [sessions, setSessions] = useState(() => readSessions());
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [search, setSearch] = useState('');
  const [isAttachmentMenuOpen, setIsAttachmentMenuOpen] = useState(false);
  const [isFaqMenuOpen, setIsFaqMenuOpen] = useState(false);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [adminTab, setAdminTab] = useState('active');
  const [isTyping, setIsTyping] = useState(false);
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('ma_customer_name') || 'Customer');
  const [showCustomerNameEditor, setShowCustomerNameEditor] = useState(false);
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);
 
  const panelClass = darkMode
    ? 'bg-[#101011] text-white border-white/10'
    : 'bg-white text-gray-900 border-gray-200';
 
  const inputClass = darkMode
    ? 'bg-[#1A1A1D] border-white/10 text-white placeholder:text-gray-500'
    : 'bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-500';
 
  // --------------------------------------------------------------------------
  // LIVE STORAGE / CHANNEL SYNC
  // --------------------------------------------------------------------------
  useEffect(() => {
    const refresh = () => setSessions(readSessions());
 
    const handleStorage = (event) => {
      if (event.key === CHAT_STORAGE_KEY) refresh();
    };
 
    window.addEventListener('storage', handleStorage);
 
    if ('BroadcastChannel' in window) {
      channelRef.current = new BroadcastChannel(CHAT_CHANNEL_NAME);
      channelRef.current.onmessage = refresh;
    }
 
    return () => {
      window.removeEventListener('storage', handleStorage);
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, []);
 
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 20);
    return () => clearTimeout(timer);
  }, [isOpen, activeSessionId, sessions, isTyping]);
 
  const broadcast = () => {
    try {
      channelRef.current?.postMessage({ type: 'chat-updated', at: Date.now() });
    } catch {
      // BroadcastChannel is optional. localStorage remains the source of truth.
    }
  };
 
  const persist = (nextSessions) => {
    setSessions(nextSessions);
    writeSessions(nextSessions);
    broadcast();
  };
 
  // --------------------------------------------------------------------------
  // CUSTOMER SESSION SELECTION
  // --------------------------------------------------------------------------
  const customerSessions = useMemo(() => {
    return Object.values(sessions)
      .filter(session => session.customerId === resolvedCustomerId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [sessions, resolvedCustomerId]);
 
  const customerActiveSession = useMemo(() => {
    return customerSessions.find(session => session.status === 'open') || null;
  }, [customerSessions]);
 
  const adminSessions = useMemo(() => {
    const list = Object.values(sessions).sort((a, b) => b.updatedAt - a.updatedAt);
    return list.filter(session => {
      const matchesTab = adminTab === 'active' ? session.status === 'open' : session.status === 'resolved';
      const q = search.toLowerCase().trim();
      const matchesSearch = !q ||
        session.id.toLowerCase().includes(q) ||
        session.customerId.toLowerCase().includes(q) ||
        String(session.customerName || '').toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [sessions, adminTab, search]);
 
  const activeSession = useMemo(() => {
    if (isAdmin) {
      if (activeSessionId && sessions[activeSessionId]) return sessions[activeSessionId];
      return adminSessions[0] || null;
    }
    if (activeSessionId && sessions[activeSessionId] && sessions[activeSessionId].customerId === resolvedCustomerId) {
      return sessions[activeSessionId];
    }
    return customerActiveSession;
  }, [isAdmin, activeSessionId, sessions, adminSessions, resolvedCustomerId, customerActiveSession]);
 
  // --------------------------------------------------------------------------
  // CREATE / SELECT SESSION
  // --------------------------------------------------------------------------
  const ensureCustomerSession = () => {
    const current = customerSessions.find(session => session.status === 'open');
    if (current) {
      setActiveSessionId(current.id);
      return current;
    }
 
    const created = createSession(resolvedCustomerId);
    created.customerName = customerName || 'Customer';
    const next = { ...sessions, [created.id]: created };
    persist(next);
    setActiveSessionId(created.id);
    return created;
  };
 
  const openAdminSession = (sessionId) => {
    setActiveSessionId(sessionId);
    const selected = sessions[sessionId];
    if (!selected) return;
    const next = {
      ...sessions,
      [sessionId]: { ...selected, unreadForAdmin: 0 }
    };
    persist(next);
  };
 
  useEffect(() => {
    if (!isAdmin && isOpen && !activeSessionId && customerActiveSession) {
      setActiveSessionId(customerActiveSession.id);
    }
    if (isAdmin && isOpen && !activeSessionId && adminSessions[0]) {
      setActiveSessionId(adminSessions[0].id);
    }
  }, [isAdmin, isOpen, activeSessionId, customerActiveSession, adminSessions]);
 
  // --------------------------------------------------------------------------
  // CUSTOMER NAME
  // --------------------------------------------------------------------------
  const saveCustomerName = () => {
    const safeName = customerName.trim() || 'Customer';
    setCustomerName(safeName);
    localStorage.setItem('ma_customer_name', safeName);
    if (!activeSession) return;
    const next = {
      ...sessions,
      [activeSession.id]: {
        ...activeSession,
        customerName: safeName,
        updatedAt: Date.now()
      }
    };
    persist(next);
    setShowCustomerNameEditor(false);
  };
 
  // --------------------------------------------------------------------------
  // ATTACHMENT HANDLING
  // --------------------------------------------------------------------------
  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
 
  const handleFileSelected = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
 
    if (file.size > MAX_FILE_SIZE) {
      alert('Please choose a file smaller than 8 MB.');
      return;
    }
 
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      alert('Only image and video files can be shared in this chat.');
      return;
    }
 
    setIsSending(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setSelectedFile({
        kind: isImage ? 'image' : 'video',
        name: file.name,
        mimeType: file.type,
        size: file.size,
        dataUrl
      });
      setIsAttachmentMenuOpen(false);
    } catch {
      alert('The selected file could not be prepared.');
    } finally {
      setIsSending(false);
    }
  };
 
  const clearAttachments = () => {
    setSelectedFile(null);
    setSelectedProduct(null);
  };
 
  // --------------------------------------------------------------------------
  // SEND MESSAGE
  // --------------------------------------------------------------------------
  const sendMessage = () => {
    const text = messageText.trim();
    if (!text && !selectedFile && !selectedProduct) return;
 
    const session = isAdmin ? activeSession : (activeSession || ensureCustomerSession());
    if (!session) return;
 
    if (session.status === 'resolved') {
      if (isAdmin) {
        alert('This conversation is already resolved. Re-open it from the customer side to create a new active conversation.');
      } else {
        alert('This conversation has been resolved. Start a new conversation to contact support again.');
      }
      return;
    }
 
    const sender = isAdmin ? 'admin' : 'customer';
    const message = createMessage({
      sender,
      text,
      attachment: selectedFile,
      product: selectedProduct
    });
 
    const nextSession = {
      ...session,
      updatedAt: message.createdAt,
      messages: [...(session.messages || []), message],
      unreadForAdmin: sender === 'customer' ? (session.unreadForAdmin || 0) + 1 : 0,
      unreadForCustomer: sender === 'admin' ? (session.unreadForCustomer || 0) + 1 : 0
    };
 
    const next = { ...sessions, [session.id]: nextSession };
    persist(next);
    setActiveSessionId(session.id);
    setMessageText('');
    clearAttachments();
    setIsAttachmentMenuOpen(false);
    setIsProductPickerOpen(false);
  };
 
  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };
 
  // --------------------------------------------------------------------------
  // QUICK Q&A / ROBOT ASSISTANT
  // Questions are stored as normal chat messages so the conversation reads
  // naturally and the admin can see exactly what the customer asked.
  // --------------------------------------------------------------------------
  const askQuickQuestion = (question) => {
    const answer = roboticAnswers?.[question];
    if (!question || !answer) return;

    const session = activeSession || ensureCustomerSession();
    if (!session || session.status === 'resolved') return;

    const questionMessage = createMessage({
      sender: 'customer',
      text: question
    });

    const answerMessage = {
      ...createMessage({
        sender: 'bot',
        text: answer
      }),
      botForQuestion: question
    };

    const nextSession = {
      ...session,
      updatedAt: answerMessage.createdAt,
      messages: [...(session.messages || []), questionMessage, answerMessage],
      unreadForAdmin: (session.unreadForAdmin || 0) + 1
    };

    persist({ ...sessions, [session.id]: nextSession });
    setActiveSessionId(session.id);
    setIsFaqMenuOpen(false);
  };

  // --------------------------------------------------------------------------
  // RESOLVE / REOPEN
  // --------------------------------------------------------------------------
  const resolveSession = (sessionId) => {
    const session = sessions[sessionId];
    if (!session) return;
 
    const systemMessage = createMessage({
      sender: 'system',
      text: 'Support marked this conversation as resolved.'
    });
 
    const nextSession = {
      ...session,
      status: 'resolved',
      updatedAt: Date.now(),
      unreadForAdmin: 0,
      unreadForCustomer: 0,
      resolvedAt: Date.now(),
      messages: [...(session.messages || []), systemMessage]
    };
 
    persist({ ...sessions, [sessionId]: nextSession });
    setActiveSessionId(null);
  };
 
  const reopenSession = (sessionId) => {
    const session = sessions[sessionId];
    if (!session) return;
    const reopened = {
      ...session,
      status: 'open',
      updatedAt: Date.now(),
      resolvedAt: null,
      unreadForAdmin: 0,
      unreadForCustomer: 0
    };
    persist({ ...sessions, [sessionId]: reopened });
    setActiveSessionId(sessionId);
    setAdminTab('active');
  };
 
  // --------------------------------------------------------------------------
  // PRODUCT SHARING
  // --------------------------------------------------------------------------
  const productOptions = products.slice(0, 30);
 
  const chooseProduct = (product) => {
    setSelectedProduct({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.isOnSale ? Number(product.salePrice) : Number(product.originalPrice),
      category: product.category,
      isOnSale: Boolean(product.isOnSale)
    });
    setIsProductPickerOpen(false);
    setIsAttachmentMenuOpen(false);
  };
 
  // --------------------------------------------------------------------------
  // RENDER HELPERS
  // --------------------------------------------------------------------------
  const renderAttachment = (attachment) => {
    if (!attachment) return null;
 
    if (attachment.kind === 'image') {
      return (
        <a href={attachment.dataUrl} target="_blank" rel="noreferrer" className="block mt-2">
          <img src={attachment.dataUrl} alt={attachment.name || 'Shared image'} className="max-w-[220px] max-h-[260px] rounded-xl object-cover border border-white/10" />
        </a>
      );
    }
 
    if (attachment.kind === 'video') {
      return (
        <video controls className="max-w-[240px] max-h-[260px] rounded-xl mt-2 border border-white/10">
          <source src={attachment.dataUrl} type={attachment.mimeType || 'video/mp4'} />
        </video>
      );
    }
 
    return null;
  };
 
  const renderProductCard = (product, compact = false) => {
    if (!product) return null;
    return (
      <div className={`mt-2 rounded-xl border border-white/10 overflow-hidden ${darkMode ? 'bg-black/20' : 'bg-white/70'} ${compact ? 'max-w-[220px]' : 'max-w-[260px]'}`}>
        {product.image && <img src={product.image} alt={product.name} className="w-full h-28 object-cover" />}
        <div className="p-2.5">
          <p className="font-bold text-xs">{product.name}</p>
          <p className="text-[10px] opacity-60">{product.category || 'Product'}</p>
          <p className="font-mono text-[#E5C158] font-bold mt-1">PKR {Number(product.price || 0).toLocaleString()}</p>
        </div>
      </div>
    );
  };
 
  const renderMessage = (message) => {
    const isMine = message.sender === (isAdmin ? 'admin' : 'customer');
    const isSystem = message.sender === 'system';
    const isBot = message.sender === 'bot';

    if (isSystem) {
      return (
        <div key={message.id} className="flex justify-center my-3">
          <span className="text-[9px] px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">{message.text}</span>
        </div>
      );
    }

    return (
      <div key={message.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`max-w-[82%] rounded-2xl px-3 py-2 shadow-sm ${
          isMine
            ? 'bg-[#BA963E] text-black rounded-br-md'
            : isBot
              ? (darkMode ? 'bg-[#151A1B] text-white border border-[#BA963E]/30 rounded-bl-md' : 'bg-amber-50 text-gray-900 border border-amber-200 rounded-bl-md')
              : darkMode
                ? 'bg-[#202023] text-white border border-white/5 rounded-bl-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}>
          {isBot && <p className={`text-[8px] font-bold uppercase tracking-wide mb-1 ${darkMode ? 'text-[#E5C158]' : 'text-[#9A761F]'}`}>🤖 Quick Assistant</p>}
          {message.text && <p className="text-xs whitespace-pre-wrap break-words">{message.text}</p>}
          {message.product && renderProductCard(message.product, true)}
          {message.attachment && renderAttachment(message.attachment)}
          <div className={`text-[8px] mt-1 text-right ${isMine ? 'text-black/60' : 'text-gray-500'}`}>{formatTime(message.createdAt)}</div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;
 
  // --------------------------------------------------------------------------
  // ADMIN INBOX
  // --------------------------------------------------------------------------
  const renderAdmin = () => (
    <div className={`w-full h-[min(78vh,680px)] rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${panelClass}`}>
      <div className="bg-gradient-to-r from-[#BA963E] to-[#E5C158] text-black px-4 py-3 flex items-center justify-between">
        <div>
          <p className="font-black text-sm tracking-wide">CUSTOMER CHAT INBOX</p>
          <p className="text-[9px] opacity-70">Live conversations • saved automatically</p>
        </div>
        <button onClick={onClose} className="text-black/70 hover:text-black text-lg font-bold cursor-pointer">✕</button>
      </div>
 
      <div className={`grid grid-cols-2 border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <button onClick={() => setAdminTab('active')} className={`py-2 text-[10px] font-bold ${adminTab === 'active' ? 'bg-[#BA963E] text-black' : 'opacity-70'}`}>Active Chats</button>
        <button onClick={() => setAdminTab('resolved')} className={`py-2 text-[10px] font-bold ${adminTab === 'resolved' ? 'bg-[#BA963E] text-black' : 'opacity-70'}`}>Resolved</button>
      </div>
 
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-[135px_1fr]">
        <div className={`border-r ${darkMode ? 'border-white/10' : 'border-gray-200'} overflow-y-auto p-2 space-y-2`}>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className={`w-full rounded-xl border px-2 py-2 text-[9px] outline-none ${inputClass}`} />
          {adminSessions.length === 0 ? (
            <p className="text-[9px] text-gray-500 text-center py-6">No {adminTab} chats.</p>
          ) : adminSessions.map(session => {
            const last = getLastMessage(session);
            const selected = activeSession?.id === session.id;
            return (
              <button key={session.id} onClick={() => openAdminSession(session.id)} className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer ${selected ? 'bg-[#BA963E]/20 border-[#BA963E]/50' : darkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-1.5">
                  <span className="w-7 h-7 rounded-full bg-[#BA963E] text-black flex items-center justify-center text-[10px] font-black">{String(session.customerName || 'C').slice(0, 1).toUpperCase()}</span>
                  <span className="truncate text-[9px] font-bold">{session.customerName || 'Customer'}</span>
                </div>
                <p className="text-[8px] opacity-50 mt-1 truncate">{getSessionPreview(session)}</p>
                {last?.sender === 'customer' && session.unreadForAdmin > 0 && <span className="inline-flex mt-1 text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded-full">{session.unreadForAdmin}</span>}
              </button>
            );
          })}
        </div>
 
        <div className="min-h-0 flex flex-col">
          {!activeSession ? (
            <div className="flex-1 flex items-center justify-center p-6 text-center">
              <div><div className="text-4xl mb-2">💬</div><p className="text-sm font-bold">Select a customer chat</p><p className="text-[10px] opacity-50 mt-1">New customer messages appear in Active Chats.</p></div>
            </div>
          ) : (
            <>
              <div className={`px-3 py-2 border-b flex items-center justify-between ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div><p className="text-xs font-bold">{activeSession.customerName || 'Customer'}</p><p className="text-[8px] opacity-50">{activeSession.id} • {formatDate(activeSession.createdAt)}</p></div>
                <div className="flex gap-1.5">
                  {activeSession.status === 'open' ? <button onClick={() => resolveSession(activeSession.id)} className="px-2.5 py-1.5 bg-emerald-500 text-black rounded-lg text-[9px] font-bold cursor-pointer">✓ Resolve</button> : <button onClick={() => reopenSession(activeSession.id)} className="px-2.5 py-1.5 bg-[#BA963E] text-black rounded-lg text-[9px] font-bold cursor-pointer">Re-open</button>}
                  <button onClick={onClose} className="px-2 py-1.5 bg-white/5 rounded-lg text-[9px] cursor-pointer">✕</button>
                </div>
              </div>
 
              <div className="flex-1 overflow-y-auto p-3">
                {(activeSession.messages || []).map(renderMessage)}
                <div ref={messagesEndRef} />
              </div>
 
              {activeSession.status === 'open' && renderComposer()}
            </>
          )}
        </div>
      </div>
    </div>
  );
 
  // --------------------------------------------------------------------------
  // COMPOSER
  // --------------------------------------------------------------------------
  function renderComposer() {
    return (
      <div className={`border-t p-2 ${darkMode ? 'border-white/10 bg-[#0C0C0D]' : 'border-gray-200 bg-white'}`}>
        {(selectedFile || selectedProduct) && (
          <div className="mb-2 flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
            {selectedFile?.kind === 'image' && <img src={selectedFile.dataUrl} alt="Attachment" className="w-10 h-10 object-cover rounded-lg" />}
            {selectedFile?.kind === 'video' && <span className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center">🎬</span>}
            {selectedProduct && <div className="w-10 h-10 rounded-lg overflow-hidden">{selectedProduct.image && <img src={selectedProduct.image} alt="" className="w-full h-full object-cover" />}</div>}
            <div className="min-w-0 flex-1"><p className="text-[9px] font-bold truncate">{selectedFile?.name || selectedProduct?.name}</p><p className="text-[8px] opacity-50">Ready to send</p></div>
            <button onClick={clearAttachments} className="text-xs opacity-60 hover:opacity-100 cursor-pointer">✕</button>
          </div>
        )}
 
        {isAttachmentMenuOpen && (
          <div className={`mb-2 flex flex-wrap gap-2 p-2 rounded-xl border ${darkMode ? 'border-white/10 bg-[#171719]' : 'border-gray-200 bg-gray-50'}`}>
            <label className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold cursor-pointer hover:bg-[#BA963E] hover:text-black">
              📷 Image / Video
              <input type="file" accept="image/*,video/*" onChange={handleFileSelected} className="hidden" />
            </label>
            <button onClick={() => { setIsProductPickerOpen(true); setIsAttachmentMenuOpen(false); }} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold cursor-pointer hover:bg-[#BA963E] hover:text-black">🛍️ Share Product</button>
          </div>
        )}
 
        {isProductPickerOpen && (
          <div className={`mb-2 max-h-44 overflow-y-auto rounded-xl border p-2 ${darkMode ? 'border-white/10 bg-[#171719]' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex justify-between items-center mb-2"><span className="text-[9px] font-bold">Select a product</span><button onClick={() => setIsProductPickerOpen(false)} className="text-[10px] cursor-pointer">✕</button></div>
            <div className="grid grid-cols-2 gap-2">
              {productOptions.map(product => (
                <button key={product.id} onClick={() => chooseProduct(product)} className="text-left p-1.5 rounded-lg border border-white/10 hover:border-[#BA963E] cursor-pointer">
                  <div className="flex gap-2 items-center">{product.image && <img src={product.image} alt="" className="w-8 h-8 rounded-md object-cover" />}<span className="text-[8px] font-bold line-clamp-2">{product.name}</span></div>
                </button>
              ))}
            </div>
          </div>
        )}
 
        {isFaqMenuOpen && (
          <div className={`mb-2 rounded-2xl border p-2 ${darkMode ? 'border-[#BA963E]/30 bg-[#171719]' : 'border-amber-200 bg-amber-50'}`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-[9px] font-bold uppercase tracking-wide ${darkMode ? 'text-[#E5C158]' : 'text-[#9A761F]'}`}>
                🤖 Quick Questions
              </span>
              <button
                onClick={() => setIsFaqMenuOpen(false)}
                className="text-[9px] opacity-60 hover:opacity-100 cursor-pointer"
              >
                Hide
              </button>
            </div>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {(roboticQuestions || []).map((question) => (
                <button
                  key={question}
                  onClick={() => askQuickQuestion(question)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl border text-[9px] font-medium transition-colors cursor-pointer ${
                    darkMode
                      ? 'bg-white/5 border-white/10 text-gray-200 hover:bg-[#BA963E]/20 hover:border-[#BA963E]/40'
                      : 'bg-white border-amber-200 text-gray-800 hover:bg-amber-100'
                  }`}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end gap-2">
          <button
            onClick={() => {
              setIsFaqMenuOpen(open => !open);
              setIsAttachmentMenuOpen(false);
              setIsProductPickerOpen(false);
            }}
            className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm cursor-pointer transition-colors ${
              isFaqMenuOpen
                ? 'bg-[#BA963E] text-black border-[#BA963E]'
                : 'bg-white/5 border-white/10 hover:bg-[#BA963E] hover:text-black'
            }`}
            title="Quick Questions"
            aria-label="Open quick questions"
          >
            ＋
          </button>
          <button
            onClick={() => {
              setIsAttachmentMenuOpen(open => !open);
              setIsFaqMenuOpen(false);
              setIsProductPickerOpen(false);
            }}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm cursor-pointer hover:bg-[#BA963E] hover:text-black"
            title="Attachments"
            aria-label="Open attachments"
          >
            📎
          </button>
          <textarea value={messageText} onChange={(e) => setMessageText(e.target.value)} onKeyDown={handleComposerKeyDown} rows={1} placeholder="Type a message..." className={`flex-1 resize-none rounded-2xl border px-3 py-2 text-xs outline-none focus:border-[#BA963E] ${inputClass}`} />
          <button disabled={isSending} onClick={sendMessage} className="w-9 h-9 rounded-full bg-[#BA963E] text-black flex items-center justify-center font-black cursor-pointer disabled:opacity-50">➤</button>
        </div>
        <div className="flex justify-between px-1 pt-1"><span className="text-[7px] opacity-40">Enter to send • Shift+Enter for new line</span>{isSending && <span className="text-[7px] opacity-50">Preparing attachment…</span>}</div>
      </div>
    );
  }
 
  // --------------------------------------------------------------------------
  // CUSTOMER CHAT
  // --------------------------------------------------------------------------
  const renderCustomer = () => {
    const session = activeSession;
    return (
      <div className={`w-full h-[min(78vh,680px)] rounded-3xl border shadow-2xl overflow-hidden flex flex-col ${panelClass}`}>
        <div className="bg-gradient-to-r from-[#BA963E] to-[#E5C158] text-black px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center font-black">MA</div>
            <div><p className="font-black text-sm">Live Support</p><p className="text-[9px] opacity-70">We usually reply quickly</p></div>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowCustomerNameEditor(v => !v)} className="text-[9px] font-bold px-2 py-1 rounded-lg bg-black/10 cursor-pointer">{customerName}</button>
            <button onClick={onClose} className="text-black/70 hover:text-black text-lg font-bold cursor-pointer">✕</button>
          </div>
        </div>
 
        {showCustomerNameEditor && (
          <div className="p-2 border-b border-white/10 flex gap-2">
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={`flex-1 border rounded-xl px-2 py-1.5 text-[10px] outline-none ${inputClass}`} placeholder="Your name" />
            <button onClick={saveCustomerName} className="px-3 py-1.5 rounded-xl bg-[#BA963E] text-black text-[9px] font-bold cursor-pointer">Save</button>
          </div>
        )}
 
        {!session ? (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div>
              <div className="text-5xl mb-3">💬</div>
              <h3 className="font-bold text-sm">Chat with our support team</h3>
              <p className="text-[10px] opacity-50 mt-2 max-w-[260px]">Ask about an order, product, delivery, payment, return, or any issue.</p>
              <button onClick={ensureCustomerSession} className="mt-4 px-5 py-2.5 rounded-xl bg-[#BA963E] text-black text-xs font-bold cursor-pointer">Start Chat</button>
            </div>
          </div>
        ) : (
          <>
            <div className="px-3 py-2 border-b border-white/10 flex justify-between items-center">
              <div><p className="text-[10px] font-bold">Support conversation</p><p className="text-[8px] opacity-50">#{session.id}</p></div>
              {session.status === 'resolved' && <span className="text-[8px] px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Resolved</span>}
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {(session.messages || []).map(renderMessage)}
              <div ref={messagesEndRef} />
            </div>
            {session.status === 'open' ? renderComposer() : (
              <div className="p-3 border-t border-white/10 text-center">
                <p className="text-[9px] opacity-50 mb-2">This conversation is resolved and has been removed from the active support queue.</p>
                <button onClick={() => { setActiveSessionId(null); ensureCustomerSession(); }} className="px-4 py-2 rounded-xl bg-[#BA963E] text-black text-[10px] font-bold cursor-pointer">Start New Conversation</button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };
 
  return isAdmin ? renderAdmin() : renderCustomer();
}