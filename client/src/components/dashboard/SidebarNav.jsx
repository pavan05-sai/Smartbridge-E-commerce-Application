import React from 'react';
import { BarChart3, Package, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SidebarNav({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'products', label: 'Products', icon: <Package size={18} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-surface border-r border-borderBlue flex flex-col min-h-screen">
      {/* Return to shop CTA */}
      <div className="p-6 border-b border-borderBlue/50">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-electric hover:text-accent-bright transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Shop
        </Link>
        <h2 className="mt-4 text-xl font-bold font-heading text-gradient">Seller Hub</h2>
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-accent-blue/15 text-accent-electric border-l-2 border-accent-blue font-semibold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-borderBlue/20'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
