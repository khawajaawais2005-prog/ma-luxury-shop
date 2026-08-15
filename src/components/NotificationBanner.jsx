import React from 'react';

export default function NotificationBanner({ notifications, clearNotification }) {
  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full px-4 sm:px-0">
      {notifications.map((note) => (
        <div 
          key={note.id} 
          className={`p-4 rounded-2xl border backdrop-blur-md shadow-2xl flex justify-between items-start transition-all duration-300 ${
            note.type === 'order' 
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' 
              : note.type === 'error'
              ? 'bg-red-950/90 border-red-500/40 text-red-200'
              : 'bg-[#121214]/90 border-[#BA963E]/40 text-[#E5C158]'
          }`}
        >
          <div className="text-xs space-y-1 pr-2">
            <p className="font-bold uppercase tracking-wider">{note.title}</p>
            <p className="text-gray-300 text-[11px] leading-relaxed">{note.message}</p>
            {note.time && <p className="text-[9px] text-gray-500 font-mono">{note.time}</p>}
          </div>
          <button 
            type="button"
            onClick={() => clearNotification(note.id)}
            className="text-gray-400 hover:text-white font-bold text-sm ml-2 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}