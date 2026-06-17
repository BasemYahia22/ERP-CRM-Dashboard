import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "../stores/store";
import { translations } from "../i18n/translations";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Globe,
  Settings,
  User,
  LogOut,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from "lucide-react";

interface NavbarProps {
  onMenuToggle: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMenuToggle,
  searchTerm,
  onSearchChange,
}) => {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    currentUser,
    logout,
    currentRoute,
    activeId,
    customers,
    sales,
    bills,
    navigateTo,
    notifications,
    markNotificationsRead,
    addToast,
  } = useAppStore();

  const t = translations[language];

  // UI state
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  // Refs for click outside
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Language change handler
  const handleLanguageSwitch = (lang: "en" | "ar") => {
    setLanguage(lang);
    setLangOpen(false);
    addToast(translations[lang].toast_language_switched, "success");
  };

  // Breadcrumbs builder
  const getBreadcrumbs = () => {
    const path = [{ label: t.breadcrumbs_home, route: "dashboard" }];

    switch (currentRoute) {
      case "dashboard":
        path.push({ label: t.dashboard, route: "dashboard" });
        break;
      case "customers":
        path.push({ label: t.customers, route: "customers" });
        break;
      case "customer-details":
        path.push({ label: t.customers, route: "customers" });
        const custName =
          customers.find((c) => c.id === activeId)?.fullName ||
          t.customer_details;
        path.push({ label: custName, route: "customer-details" });
        break;
      case "sales":
        path.push({ label: t.sales, route: "sales" });
        break;
      case "sale-details":
        path.push({ label: t.sales, route: "sales" });
        const invNum =
          sales.find((s) => s.id === activeId)?.invoiceNumber || t.sale_details;
        path.push({ label: invNum, route: "sale-details" });
        break;
      case "bills":
        path.push({ label: t.bills, route: "bills" });
        break;
      case "bill-details":
        path.push({ label: t.bills, route: "bills" });
        const billNum =
          bills.find((b) => b.id === activeId)?.billNumber || t.bill_details;
        path.push({ label: billNum, route: "bill-details" });
        break;
      case "profile":
        path.push({ label: t.profile, route: "profile" });
        break;
      case "settings":
        path.push({ label: t.settings, route: "settings" });
        break;
      default:
        break;
    }

    return path;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-100 bg-white/80 dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur-md px-6">
      {/* Left section: Hamburger & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 lg:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop Breadcrumbs */}
        <nav className="hidden sm:flex items-center text-xs text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && (
                <span className="mx-2.5 text-slate-350 dark:text-slate-600">
                  {language === "ar" ? (
                    <ChevronLeft className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </span>
              )}
              <button
                onClick={() =>
                  navigateTo(
                    crumb.route,
                    crumb.route.endsWith("-details") ? activeId : null,
                  )
                }
                className={`hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer p-0
                  ${idx === breadcrumbs.length - 1 ? "font-bold text-slate-805 dark:text-slate-100 pointer-events-none" : ""}`}
              >
                {crumb.label}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Center Search Bar */}
      <div className="mx-4 flex max-w-md flex-1 items-center justify-center">
        {["dashboard", "customers", "sales", "bills"].includes(
          currentRoute,
        ) && (
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 inset-s-3 flex items-center text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder={
                currentRoute === "customers"
                  ? t.search_customers
                  : currentRoute === "sales"
                    ? t.search_sales
                    : currentRoute === "bills"
                      ? t.search_bills
                      : t.search_placeholder
              }
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200 outline-none focus:ring-1 focus:ring-indigo-500 py-2.5 ps-10 pe-4"
            />
          </div>
        )}
      </div>

      {/* Right controls: Language, Theme, Notification, Profile */}
      <div className="flex items-center gap-2">
        {/* Language dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center"
            title="Switch Language"
          >
            <Globe className="h-4.5 w-4.5" />
          </button>

          {langOpen && (
            <div className="absolute inset-e-0 mt-2 w-40 origin-top-right rounded-xl border border-slate-100 bg-white p-1.5 shadow-lg dark:border-slate-850 dark:bg-slate-900 anim-fade-in">
              <button
                onClick={() => handleLanguageSwitch("en")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer
                  ${language === "en" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-semibold" : "text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800"}`}
              >
                <span>English (US)</span>
                {language === "en" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                )}
              </button>
              <button
                onClick={() => handleLanguageSwitch("ar")}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors cursor-pointer
                  ${language === "ar" ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400 font-semibold" : "text-slate-600 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800"}`}
              >
                <span>العربية (مصر)</span>
                {language === "ar" && (
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Theme toggler */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center animate-pulse-slow"
          title={theme === "dark" ? t.theme_light : t.theme_dark}
        >
          {theme === "dark" ? (
            <Sun className="h-4.5 w-4.5 text-amber-550" />
          ) : (
            <Moon className="h-4.5 w-4.5 text-indigo-655" />
          )}
        </button>

        {/* Notifications dropdown */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              markNotificationsRead();
            }}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-center"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 inset-e-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-650 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute inset-e-0 mt-2 w-80 origin-top-right rounded-2xl border border-slate-100 bg-white shadow-lg dark:border-slate-850 dark:bg-slate-900 overflow-hidden anim-fade-in">
              <div className="p-4 border-b border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.notifications}
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-semibold text-red-650 px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/20">
                    {unreadCount} {t.unread_notifications}
                  </span>
                )}
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800/40">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    {t.no_notifications}
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 flex gap-3 text-xs transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30
                        ${!notif.read ? "bg-indigo-50/15 dark:bg-indigo-950/10" : ""}`}
                    >
                      <div className="mt-0.5 text-indigo-650 dark:text-indigo-400 shrink-0">
                        {notif.titleEn.includes("due") ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : notif.titleEn.includes("maintenance") ? (
                          <HelpCircle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-850 dark:text-slate-205 leading-relaxed truncate-2-lines text-[11px]">
                          {language === "ar" ? notif.titleAr : notif.titleEn}
                        </p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {notif.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div
          className="relative border-s border-slate-100 dark:border-slate-801 ps-2 ms-0.5"
          ref={profileRef}
        >
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-1.5 rounded-lg p-1 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <img
              src={
                currentUser?.avatarUrl ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              }
              alt="Avatar"
              className="h-8.5 w-8.5 rounded-xl border border-slate-100 dark:border-slate-800 object-cover"
            />
            <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-slate-450 dark:text-slate-500" />
          </button>

          {profileOpen && (
            <div className="absolute inset-e-0 mt-2 w-48 origin-top-right rounded-2xl border border-slate-100 bg-white p-1.5 shadow-lg dark:border-slate-850 dark:bg-slate-900 anim-fade-in">
              <div className="px-3.5 py-2.5 border-b border-slate-50 dark:border-slate-800/40">
                <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                  {currentUser?.name}
                </p>
                <p className="text-[10px] text-slate-450 dark:text-slate-450 truncate mt-0.5">
                  {currentUser?.email}
                </p>
              </div>
              <div className="space-y-0.5 mt-1.5">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigateTo("profile");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-350 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>{t.profile}</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigateTo("settings");
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-350 dark:hover:bg-slate-800 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  <span>{t.settings}</span>
                </button>
                <div className="border-t border-slate-50 dark:border-slate-800/40 my-1.5" />
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t.logout}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
