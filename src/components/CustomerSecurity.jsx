import React, { useState, useEffect } from 'react';

export default function CustomerSecurity({ addNotification }) {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('ma_login_sessions');
    return saved ? JSON.parse(saved) : [
      { id: 1, device: 'Chrome / Windows 11', ip: '39.45.102.12', location: 'Islamabad, PK', time: '14 Aug 2026 - 10:27 AM', active: true },
      { id: 2, device: 'Mobile Safari / iPhone 14 Pro', ip: '182.185.12.90', location: 'Rawalpindi, PK', time: '11 Aug 2026 - 09:15 PM', active: false }
    ];
  });

  useEffect(() => {
    localStorage.setItem('ma_login_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Handle single session termination
  const handleTerminateSession = (id, deviceName) => {
    setSessions(prev =>
      prev.map(s => (s.id === id ? { ...s, active: false } : s))
    );
    if (addNotification) {
      addNotification("🔒 Security Alert", `Logged out device: ${deviceName}`, "info");
    }
  };

  // Terminate all other non-current sessions
  const handleLogoutAllOthers = () => {
    if (window.confirm("Are you sure you want to log out all other active sessions?")) {
      setSessions(prev =>
        prev.map(s => (s.active && s.id !== 1 ? { ...s, active: false } : s))
      );
      if (addNotification) {
        addNotification("🛡️ Security Action", "Terminated all other active sessions.", "info");
      }
    }
  };

  const otherActiveSessionsCount = sessions.filter(s => s.active && s.id !== 1).length;

  return (
    <div className="space-y-4 text-xs text-gray-200 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div>
          <h3 className="font-bold text-[#E5C158] uppercase tracking-wider text-sm flex items-center gap-2">
            <span>🔒</span> Security & Active Login Logs
          </h3>
          <p className="text-gray-500 text-[11px]">Authorized devices and IP connections linked to your account.</p>
        </div>

        {otherActiveSessionsCount > 0 && (
          <button
            type="button"
            onClick={handleLogoutAllOthers}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider transition-all cursor-pointer self-start sm:self-auto"
          >
            Log Out Other Devices ({otherActiveSessionsCount})
          </button>
        )}
      </div>

      <div className="space-y-2">
        {sessions.map((s) => (
          <div 
            key={s.id} 
            className="bg-black/30 p-3.5 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-white/10 transition-all"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">{s.device}</span>
                {s.active && s.id === 1 ? (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border border-emerald-500/30">
                    THIS DEVICE
                  </span>
                ) : s.active ? (
                  <span className="bg-amber-500/20 text-amber-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold border border-amber-500/30">
                    ACTIVE SESSION
                  </span>
                ) : null}
              </div>
              <p className="text-gray-500 font-mono text-[10px]">
                IP Address: <span className="text-gray-300">{s.ip}</span> • Location: <span className="text-gray-300">{s.location}</span>
              </p>
              <p className="text-gray-600 text-[9px]">{s.time}</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
              <span className={`text-[10px] font-mono font-bold ${s.active ? 'text-emerald-400' : 'text-gray-500'}`}>
                {s.active ? '● Authorized' : 'Logged Out'}
              </span>

              {s.active && s.id !== 1 && (
                <button
                  type="button"
                  onClick={() => handleTerminateSession(s.id, s.device)}
                  className="bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 px-2 py-1 rounded-lg text-[10px] transition-all cursor-pointer"
                >
                  Terminate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}