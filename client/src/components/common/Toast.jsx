import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

let toastTimeout;
export const showToast = (message, type = 'success') => {
  const event = new CustomEvent('app-toast', { detail: { message, type } });
  window.dispatchEvent(event);
};

export default function Toast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (e) => {
      setToast({
        message: e.detail.message,
        type: e.detail.type,
      });

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        setToast(null);
      }, 4000);
    };

    window.addEventListener('app-toast', handleToast);
    return () => {
      window.removeEventListener('app-toast', handleToast);
      if (toastTimeout) clearTimeout(toastTimeout);
    };
  }, []);

  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: '#f0fdf4',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
        };
      case 'error':
        return {
          bg: '#fef2f2',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
        };
      case 'warning':
        return {
          bg: '#fffbeb',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
        };
      default:
        return {
          bg: '#eff6ff',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: <Info className="h-5 w-5 text-blue-600" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in max-w-sm">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${style.border} shadow-lg`}
        style={{ backgroundColor: style.bg }}
      >
        {style.icon}
        <p className={`text-sm font-medium pr-4 ${style.text}`}>{toast.message}</p>
        <button
          onClick={() => setToast(null)}
          className="ml-auto text-text-secondary hover:text-text-primary transition-colors duration-150"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
