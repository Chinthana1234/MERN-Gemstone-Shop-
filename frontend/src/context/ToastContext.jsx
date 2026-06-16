import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

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
      <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-3 max-w-md w-[calc(100%-2rem)] sm:w-96 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }) {
  const { message, type, title } = toast;
  
  // Icon and border configuration mapping
  let Icon = Info;
  let iconColor = 'text-gemGold';
  let borderStyle = 'border-l-4 border-l-gemGold';
  
  if (type === 'success') {
    Icon = CheckCircle2;
    iconColor = 'text-emerald-500';
    borderStyle = 'border-l-4 border-l-emerald-500';
  } else if (type === 'error') {
    Icon = AlertCircle;
    iconColor = 'text-gemRed';
    borderStyle = 'border-l-4 border-l-gemRed';
  } else if (type === 'warning') {
    Icon = AlertTriangle;
    iconColor = 'text-amber-500';
    borderStyle = 'border-l-4 border-l-amber-500';
  }

  return (
    <div className={`pointer-events-auto bg-stone-900/95 border border-stone-850 backdrop-blur-md shadow-2xl p-4 rounded-md flex items-start gap-3 w-full transition-all duration-300 animate-toast-in ${borderStyle}`}>
      <div className={`${iconColor} shrink-0 mt-0.5`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-white font-serif font-bold text-xs tracking-wider uppercase mb-1">
            {title}
          </h4>
        )}
        <p className="text-stone-300 text-xs font-light tracking-wide leading-relaxed">
          {message}
        </p>
      </div>
      <button 
        onClick={onClose} 
        className="text-stone-500 hover:text-white transition-colors cursor-pointer shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
