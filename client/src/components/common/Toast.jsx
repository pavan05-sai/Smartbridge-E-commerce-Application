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
          bg: 'rgba(16, 185, 129, 0.1)',
          border: 'border-success',
          text: 'text-success',
          icon: <CheckCircle2 className="h-5 w-5 text-success" />,
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.1)',
          border: 'border-error',
          text: 'text-error',
          icon: <AlertCircle className="h-5 w-5 text-error" />,
        };
      case 'warning':
        return {
          bg: 'rgba(245, 158, 11, 0.1)',
          border: 'border-warning',
          text: 'text-warning',
          icon: <AlertCircle className="h-5 w-5 text-warning" />,
        };
      default:
        return {
          bg: 'rgba(37, 99, 235, 0.1)',
          border: 'border-accent-blue',
          text: 'text-accent-electric',
          icon: <Info className="h-5 w-5 text-accent-electric" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in max-w-sm">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${style.border} card-glass shadow-lg`}
        style={{ backgroundColor: style.bg }}
      >
        {style.icon}
        <p className="text-sm font-medium text-text-primary pr-4">{toast.message}</p>
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
