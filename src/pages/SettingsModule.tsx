import React, { useState } from "react";
import { useAppStore } from "../stores/store";
import { translations } from "../i18n/translations";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import {
  Building2,
  Percent,
  BellRing,
  Globe2,
  Sun,
  Moon,
  Database,
  ShieldAlert,
  Sliders,
} from "lucide-react";

export const SettingsModule: React.FC = () => {
  const { theme, toggleTheme, language, setLanguage, addToast, resetData } =
    useAppStore();
  const t = translations[language];

  const [companyName, setCompanyName] = useState("COMPACT GLOBAL CO.");
  const [vatRate, setVatRate] = useState(15);
  const [currency, setCurrency] = useState("USD");
  const [fiscalYear, setFiscalYear] = useState("2026");
  const [notifSound, setNotifSound] = useState(true);
  const [notifInbound, setNotifInbound] = useState(true);
  const [notifLogs, setNotifLogs] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast(
      language === "ar"
        ? "تم حفظ إعدادات النظام الإدارية بنجاح!"
        : "Administrative system settings saved successfully!",
      "success",
    );
  };

  const handleResetData = () => {
    if (
      window.confirm(
        language === "ar"
          ? "هل أنت متأكد تمامًا من إعادة ضبط النظام للتعبئة التلقائية؟ سيتم مسح التغييرات الحالية وتثبيت بيانات نموذجية."
          : "Are you sure you want to reset the system to demo defaults? All current logs will be re-initialized.",
      )
    ) {
      if (resetData) {
        resetData();
      } else {
        // Fallback clear localStorage
        localStorage.clear();
        window.location.reload();
      }
      addToast(
        language === "ar"
          ? "تم استعادة قاعدة بيانات النموذج بنجاح!"
          : "Demo database restored and indexed successfully.",
        "success",
      );
    }
  };

  const isAr = language === "ar";

  return (
    <div className="space-y-6 animate-fade-in-up" dir={isAr ? "rtl" : "ltr"}>
      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          {isAr ? "إرشادات وإعدادات النظام" : "System Configuration"}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {isAr
            ? "اضبط معايير ومعدلات الضرائب وضوابط لوحات المبيعات السريعة والعملات الكلية للـ ERP"
            : "Configure taxes, currencies, dashboard triggers, and local database nodes"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick Actions & State Toggles */}
        <div className="lg:col-span-1 space-y-6">
          <Card
            title={isAr ? "المظهر واللغة" : "Appearance & Localization"}
            subtitle={
              isAr
                ? "إجراءات سريعة لتعديل العرض والأداء"
                : "Quick dials to adjust presentation details"
            }
          >
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-105 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center gap-3">
                  {theme === "dark" ? (
                    <Moon className="h-4.5 w-4.5 text-indigo-400" />
                  ) : (
                    <Sun className="h-4.5 w-4.5 text-amber-500" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {isAr ? "تأثير المظهر العام" : "Dark Mode Theme"}
                    </h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">
                      {theme === "dark"
                        ? isAr
                          ? "ممكن حالياً"
                          : "Dark mode active"
                        : isAr
                          ? "مغلق حالياً"
                          : "Light mode active"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3.5 py-1.5 text-[10px] font-bold text-white bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl cursor-pointer"
                >
                  {isAr ? "تبديل" : "Toggle"}
                </button>
              </div>

              {/* Language Selector */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-105 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center gap-3">
                  <Globe2 className="h-4.5 w-4.5 text-blue-500" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {isAr
                        ? "لغة واجهة النظام المكتوبة"
                        : "Active System Language"}
                    </h4>
                    <p className="text-[10px] text-slate-450 mt-0.5">
                      {language === "ar"
                        ? "العربية نشطة"
                        : "English language enabled"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newLang = language === "ar" ? "en" : "ar";
                    setLanguage(newLang);
                    addToast(
                      newLang === "ar"
                        ? "تم اختيار العربية بنجاح"
                        : "English layout enabled successfully.",
                      "success",
                    );
                  }}
                  className="px-3.5 py-1.5 text-[10px] font-bold text-slate-700 bg-white border border-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-700 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  {language === "ar" ? "English" : "العربية"}
                </button>
              </div>
            </div>
          </Card>

          <Card
            title={isAr ? "إجراءات صيانة البيانات" : "Data Maintenance"}
            subtitle={
              isAr
                ? "إشعارات التهيئة والنسخ الاحتياطي اليدوي والتفريغ"
                : "Reset modules and sync database clusters"
            }
          >
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-950/40 bg-red-50/20 dark:bg-red-955/10">
                <div className="flex gap-3">
                  <ShieldAlert className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-red-650 dark:text-red-400">
                      {isAr
                        ? "تهيئة قاعدة البيانات الإدارية"
                        : "Full Database Reset"}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      {isAr
                        ? "سيقوم هذا المسح بإعادة تهيئة جميع جداول العملاء، الفواتير، وسجلات المبيعات إلى حالتها النموذجية الأصلية على الفور."
                        : "This destructive function wipes all customer logs, invoice templates, and cashbooks to default values."}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetData}
                  className="w-full mt-3 flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-650 hover:bg-red-700 rounded-xl cursor-pointer"
                >
                  <Database className="h-3.5 w-3.5" />
                  <span>
                    {isAr
                      ? "استعادة قاعدة البيانات المرجعية"
                      : "Restore Demo Database"}
                  </span>
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: General Settings Form & Notification Dials */}
        <div className="lg:col-span-2 space-y-6">
          <Card
            title={isAr ? "معايير النظام العامة" : "General Ledger Parameters"}
            subtitle={
              isAr
                ? "تعديل المعاملات والمعدلات الحسابية الكلية للشركة"
                : "Manage legal business entity and tax registers"
            }
          >
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={
                    isAr
                      ? "اسم الشركة التجاري الرئيسي"
                      : "Trading Legal Entity Name"
                  }
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  leftIcon={<Building2 className="h-4 w-4 text-slate-400" />}
                />

                <Input
                  label={
                    isAr
                      ? "رقم السنة المالية الحسابية"
                      : "Accounting Fiscal Year"
                  }
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(e.target.value)}
                  leftIcon={<Sliders className="h-4 w-4 text-slate-400" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={
                    isAr
                      ? "معدل ضريبة القيمة المضافة (%)"
                      : "VAT / Tax Rate (%)"
                  }
                  type="number"
                  min={0}
                  max={100}
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  leftIcon={<Percent className="h-4 w-4 text-slate-400" />}
                />

                <Select
                  label={
                    isAr
                      ? "عملة التداول النقدية الموحدة"
                      : "Default Currency Base"
                  }
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  options={[
                    {
                      value: "USD",
                      label: isAr ? "دولار أمريكي ($)" : "USD / Dollars ($)",
                    },
                    {
                      value: "EUR",
                      label: isAr ? "يورو (€)" : "EUR / Euros (€)",
                    },
                    {
                      value: "SAR",
                      label: isAr
                        ? "ريال سعودي (SAR)"
                        : "SAR / Saudi Riyal (SAR)",
                    },
                    {
                      value: "EGP",
                      label: isAr
                        ? "جنيه مصري (EGP)"
                        : "EGP / Egyptian Pound (EGP)",
                    },
                  ]}
                />
              </div>

              <div className="w-full border-t border-slate-100 dark:border-slate-800/80 my-5" />

              <h3 className="text-xs font-extrabold text-slate-900 dark:text-white mb-3">
                {isAr
                  ? "تفضيلات التنبيهات وإشعارات لوحة التحكم"
                  : "Alert & Core Push Preferences"}
              </h3>

              <div className="space-y-3.5">
                <label className="flex items-center justify-between text-xs text-slate-650 dark:text-slate-300 font-medium">
                  <span className="flex items-center gap-2.5">
                    <BellRing className="h-4 w-4 text-slate-400" />
                    <span>
                      {isAr
                        ? "تفعيل أصوات تنبيه الفواتير الجديدة"
                        : "In-app alert chime sound"}
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={notifSound}
                    onChange={(e) => setNotifSound(e.target.checked)}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-650 dark:text-slate-300 font-medium">
                  <span className="flex items-center gap-2.5">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    <span>
                      {isAr
                        ? "إرسال ملخص مالي يومي تلقائياً"
                        : "Automatic daily ledger reports email"}
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={notifInbound}
                    onChange={(e) => setNotifInbound(e.target.checked)}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                </label>

                <label className="flex items-center justify-between text-xs text-slate-650 dark:text-slate-300 font-medium">
                  <span className="flex items-center gap-2.5">
                    <Sliders className="h-4 w-4 text-slate-400" />
                    <span>
                      {isAr
                        ? "الاحتفاظ بسجلات الأخطاء البرمجية في المتصفح"
                        : "Debug console execution log tracker"}
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={notifLogs}
                    onChange={(e) => setNotifLogs(e.target.checked)}
                    className="h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                </label>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" variant="primary">
                  {t.save}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
