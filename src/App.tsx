import React, { useState, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAppStore } from "./stores/store";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { Sidebar } from "./components/Sidebar";
import { Navbar } from "./components/Navbar";
import { HomeDashboard } from "./pages/HomeDashboard";
import { CustomersModule } from "./pages/CustomersModule";
import { SalesModule } from "./pages/SalesModule";
import { BillsModule } from "./pages/BillsModule";
import { ProfileModule } from "./pages/ProfileModule";
import { SettingsModule } from "./pages/SettingsModule";
import {
  X,
  CheckCircle,
  AlertOctagon,
  Info,
  AlertTriangle,
} from "lucide-react";

const ToastItem: React.FC<{
  toast: any;
  removeToast: (id: string) => void;
  language: string;
}> = ({ toast, removeToast, language }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  const isAr = language === "ar";
  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-305 anim-slide-in
        ${toast.type === "success" ? "border-s-4 border-s-emerald-500" : ""}
        ${toast.type === "error" ? "border-s-4 border-s-red-500" : ""}
        ${toast.type === "warning" ? "border-s-4 border-s-amber-500" : ""}
        ${toast.type === "info" ? "border-s-4 border-s-indigo-500" : ""}`}
    >
      <div className="shrink-0 mt-0.5">
        {toast.type === "success" && (
          <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
        )}
        {toast.type === "error" && (
          <AlertOctagon className="h-4.5 w-4.5 text-red-500" />
        )}
        {toast.type === "warning" && (
          <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
        )}
        {toast.type === "info" && (
          <Info className="h-4.5 w-4.5 text-indigo-500" />
        )}
      </div>

      <div className={`flex-1 ${isAr ? "text-right" : "text-left"}`}>
        <p className="font-bold text-slate-900 dark:text-white">
          {toast.type === "success"
            ? isAr
              ? "نجاح"
              : "SUCCESS"
            : toast.type === "error"
              ? isAr
                ? "خطأ"
                : "ERROR"
              : toast.type === "warning"
                ? isAr
                  ? "تحذير"
                  : "WARNING"
                : isAr
                  ? "معلومة"
                  : "INFO"}
        </p>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-semibold">
          {toast.message}
        </p>
      </div>

      <button
        onClick={() => removeToast(toast.id)}
        className="text-slate-400 hover:text-slate-650 cursor-pointer p-0.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentRoute, currentUser, toasts, removeToast, language } =
    useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Reset search term when switching main modules, to assure clear grids
  useEffect(() => {
    setSearchTerm("");
  }, [currentRoute]);

  // Handle auth screen routes using React Router matching when unauthenticated
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Sidebar - responsive container */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Layout Container */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Header Module */}
        <Navbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {/* Scrollable page body with standard decalarative router routes */}
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route path="/dashboard" element={<HomeDashboard />} />
              <Route
                path="/customers"
                element={<CustomersModule searchTerm={searchTerm} />}
              />
              <Route
                path="/customer-details/:id"
                element={<CustomersModule searchTerm={searchTerm} />}
              />
              <Route
                path="/sales"
                element={<SalesModule searchTerm={searchTerm} />}
              />
              <Route
                path="/sale-details/:id"
                element={<SalesModule searchTerm={searchTerm} />}
              />
              <Route
                path="/bills"
                element={<BillsModule searchTerm={searchTerm} />}
              />
              <Route
                path="/bill-details/:id"
                element={<BillsModule searchTerm={searchTerm} />}
              />
              <Route path="/profile" element={<ProfileModule />} />
              <Route path="/settings" element={<SettingsModule />} />
              <Route
                path="/login"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route
                path="/signup"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Floated Toasts Portal Container */}
      <div
        className="fixed bottom-5 z-50 flex flex-col gap-3 max-w-sm w-full select-none"
        style={{
          insetInlineEnd: "1.25rem",
        }}
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            removeToast={removeToast}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </HashRouter>
  );
}
