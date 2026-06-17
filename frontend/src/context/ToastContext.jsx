import React, { createContext, useContext, useState, useCallback } from 'react';
import { Check, AlertTriangle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', title = '', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, title, duration }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Shortcut helpers
  const toast = {
    success: (message, title = 'Success', duration = 4000) => showToast(message, 'success', title, duration),
    error: (message, title = 'Error', duration = 4000) => showToast(message, 'error', title, duration),
    info: (message, title = 'Info', duration = 4000) => showToast(message, 'info', title, duration),
    warning: (message, title = 'Warning', duration = 4000) => showToast(message, 'warning', title, duration),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2.5 items-end max-w-md pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const { message, type } = toast;
  
  // Icon and badge styling configuration
  let Icon = Info;
  let badgeClass = 'bg-stone-800 text-white';
  
  if (type === 'success') {
    Icon = Check;
    badgeClass = 'bg-gemGreen text-white';
  } else if (type === 'error') {
    Icon = X;
    badgeClass = 'bg-gemRed text-white';
  } else if (type === 'warning') {
    Icon = AlertTriangle;
    badgeClass = 'bg-amber-500 text-white';
  } else if (type === 'info') {
    Icon = Info;
    badgeClass = 'bg-gemGold text-white';
  }

  return (
    <div className="pointer-events-auto bg-gemCard/95 backdrop-blur-sm border border-gemBorder/80 shadow-2xl py-2.5 px-4 rounded-lg flex items-center gap-3 w-fit max-w-sm transition-all duration-300 animate-toast-in">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${badgeClass}`}>
        <Icon size={12} strokeWidth={3} />
      </div>
      
      <span className="text-gemText text-xs font-semibold tracking-wide pr-1">
        {message}
      </span>
      
      <button 
        onClick={onClose} 
        className="text-stone-400 hover:text-gemText transition-colors cursor-pointer shrink-0 ml-1"
        aria-label="Close notification"
      >
        <X size={13} />
      </button>
    </div>
  );
}
