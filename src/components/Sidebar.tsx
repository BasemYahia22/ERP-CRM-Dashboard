import React from "react";
import { useAppStore } from "../stores/store";
import { translations } from "../i18n/translations";
import {
  LayoutDashboard,
  Users,
  Coins,
  FileSpreadsheet,
  LogOut,
  X,
  CreditCard,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentRoute, navigateTo, logout, language, currentUser } =
    useAppStore();
  const t = translations[language];

  // Sidebar navigation options
  const menuItems = [
    { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
    { id: "customers", label: t.customers, icon: Users },
    { id: "sales", label: t.sales, icon: Coins },
    { id: "bills", label: t.bills, icon: FileSpreadsheet },
  ];

  const handleNav = (routeId: string) => {
    navigateTo(routeId);
    onClose(); // Close mobile drawer if open
  };

  const navStyles = (id: string) => {
    const isActive = currentRoute === id || currentRoute.startsWith(id + "-");
    if (isActive) {
      return "bg-indigo-600/25 text-indigo-400 font-semibold p-3 rounded-xl scale-[1.01] shadow-sm";
    }
    return "text-slate-400 hover:bg-slate-800/80 hover:text-white p-3 rounded-xl transition-all duration-150 font-medium";
  };

  return (
    <>
      {/* Mobile Backdrop / Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 z-40 flex w-64 flex-col border-e border-slate-800/80 bg-slate-900 text-white transition-all duration-300 lg:static lg:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : language === "ar"
                ? "translate-x-full lg:translate-x-0"
                : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/20">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white leading-none tracking-tight">
                COMPACT ERP
              </h1>
              <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase mt-0.5 block">
                ADMIN SYSTEM
              </span>
            </div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 lg:hidden cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* User Mini Profile */}
        {currentUser && (
          <div className="px-5 py-4 border-b border-slate-800/80 flex items-center gap-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="h-10 w-10 rounded-xl border border-slate-800 object-cover"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">
                {currentUser.name}
              </h4>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                {currentUser.email}
              </p>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1.5 px-4 py-5 overflow-y-auto">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl text-xs transition-all duration-150 cursor-pointer ${navStyles(
                  item.id,
                )}`}
              >
                <IconComponent className="h-4.5 w-4.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Log Out Button */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-150 cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
