import React from "react";
import { useAppStore } from "../stores/store";
import { translations } from "../i18n/translations";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import {
  Users,
  Coins,
  FileSpreadsheet,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react";

export const HomeDashboard: React.FC = () => {
  const { customers, sales, bills, language, navigateTo, addToast } =
    useAppStore();

  const t = translations[language];

  // Calculations
  const totalCustomersCount = customers.length;
  const totalSalesCount = sales.length;

  const completedSales = sales.filter((s) => s.status === "Completed");
  const totalRevenueSum = completedSales.reduce(
    (acc, s) => acc + s.totalAmount,
    0,
  );

  const totalBillsSum = bills
    .filter((b) => b.status === "Paid")
    .reduce((acc, b) => acc + b.amount, 0);
  const outstandingBillsSum = bills
    .filter((b) => b.status !== "Paid")
    .reduce((acc, b) => acc + b.amount, 0);

  // Take top 5 recent sales
  const recentSales = [...sales].slice(0, 5);
  // Take top 4 latest customers
  const recentCustomers = [...customers].slice(0, 4);

  // Status badging helper
  const getSaleStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "danger";
      default:
        return "neutral";
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-US" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Upper Grid Cards: Stat summary logs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Customers */}
        <Card className="hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/45 text-indigo-650 dark:text-indigo-400">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full select-none">
              <ArrowUpRight className="h-3 w-3" />
              <span>+12.8%</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
              {t.total_customers}
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalCustomersCount}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              +3 {t.vs_last_month}
            </p>
          </div>
        </Card>

        {/* Total Sales */}
        <Card className="hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/45 text-emerald-650 dark:text-emerald-400">
              <Coins className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full select-none">
              <ArrowUpRight className="h-3 w-3" />
              <span>+8.4%</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
              {t.total_sales}
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalSalesCount}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              +1 {t.vs_last_month}
            </p>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/45 text-violet-650 dark:text-violet-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full select-none">
              <ArrowDownRight className="h-3 w-3" />
              <span>-2.1%</span>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
              {t.total_revenue}
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {formatCurrency(totalRevenueSum)}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              {language === "ar"
                ? "سجل الإيرادات النقدية المكتملة"
                : "completed cash ledger"}
            </p>
          </div>
        </Card>

        {/* Total Bills / Net flow */}
        <Card className="hover:-translate-y-0.5 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/45 text-sky-650 dark:text-sky-400">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div className="text-[10px] text-amber-655 dark:text-amber-450 font-bold bg-amber-50 dark:bg-amber-50/20 px-2.5 py-0.5 rounded-full">
              {formatCurrency(outstandingBillsSum)}{" "}
              {language === "ar" ? "غير مدفوع" : "Unpaid"}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wider">
              {t.total_bills}
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {formatCurrency(totalBillsSum)}
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              {language === "ar"
                ? "سجل المصروفات المدفوعة الكلي"
                : "paid expenditures log"}
            </p>
          </div>
        </Card>
      </div>

      {/* Charts visual grid section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive SVG Monthly Sales Bar Card */}
        <Card
          className="lg:col-span-2"
          title={t.sales_over_time}
          subtitle={
            language === "ar"
              ? "مخطط مقارنة لمبيعات الفصول المنصرمة"
              : "Comparison chart for past calendar quarters"
          }
        >
          <div className="mt-4 h-64 w-full flex flex-col justify-end">
            <div className="flex items-end justify-between h-48 w-full px-2 gap-4">
              {[
                { month: "Jan", sales: 2500, labelAr: "كانون ثان" },
                { month: "Feb", sales: 4800, labelAr: "شباط" },
                { month: "Mar", sales: 3200, labelAr: "آذار" },
                { month: "Apr", sales: 7400, labelAr: "نيسان" },
                { month: "May", sales: 13100, labelAr: "أيار" },
                { month: "Jun", sales: 12500, labelAr: "حزيران" },
              ].map((bar, idx) => {
                // calculate bar height ratio
                const maxVal = 14000;
                const percentage = (bar.sales / maxVal) * 100;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group cursor-pointer relative"
                  >
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all bg-slate-900 dark:bg-slate-800 text-white rounded px-2.5 py-1 text-[10px] font-bold z-10 shadow-lg whitespace-nowrap">
                      {formatCurrency(bar.sales)}
                    </div>
                    {/* Bar Frame */}
                    <div className="w-full bg-slate-50 dark:bg-slate-850 rounded-t-lg h-40 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${percentage}%` }}
                        className="w-full bg-linear-to-t from-indigo-500/80 to-indigo-600 rounded-t-lg group-hover:from-indigo-600 group-hover:to-indigo-500 transition-all duration-300 shadow-[0_0_12px_rgba(79,70,229,0.3)]"
                      />
                    </div>
                    {/* Axis labels */}
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-semibold">
                      {language === "ar" ? bar.labelAr : bar.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Customer growth linear gradient card & Revenue breakdown doughnut */}
        <Card
          title={t.customer_growth}
          subtitle={
            language === "ar"
              ? "مقياس تدريجي للشركاء المسجلين حديثاً"
              : "Progressive scale of newly registered profiles"
          }
        >
          <div className="mt-4 flex flex-col justify-between h-64">
            {/* Visual vector area scale */}
            <div className="relative h-32 w-full mt-2">
              <svg
                className="w-full h-full overflow-visible"
                viewBox="0 0 100 50"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area path */}
                <path
                  d="M 0 50 L 0 45 Q 25 35 35 25 T 70 15 T 100 5 L 100 50 Z"
                  fill="url(#areaGrad)"
                  className="transition-all duration-500"
                />
                {/* Line path */}
                <path
                  d="M 0 45 Q 25 35 35 25 T 70 15 T 100 5"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="1.5"
                  className="transition-all duration-500"
                />
                {/* Dots along paths */}
                <circle cx="35" cy="25" r="1.5" fill="#4f46e5" />
                <circle cx="70" cy="15" r="1.5" fill="#4f46e5" />
                <circle
                  cx="100"
                  cy="5"
                  r="1.5"
                  fill="#6366f1"
                  className="animate-ping"
                />
                <circle cx="100" cy="5" r="1.5" fill="#4f46e5" />
              </svg>
            </div>

            {/* Statistics details */}
            <div className="border-t border-slate-50 dark:border-slate-800/60 pt-4 flex items-center justify-between text-xs mt-2 select-none">
              <div>
                <p className="text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wide">
                  {language === "ar" ? "مستهدف الربع الأول" : "Q1 Target Match"}
                </p>
                <p className="text-sm font-bold text-slate-850 dark:text-white mt-1">
                  {language === "ar" ? "١٤٥٪ منجز" : "145% Met"}
                </p>
              </div>
              <div className="text-end">
                <p className="text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wide">
                  {language === "ar" ? "المتوسط الشهري" : "Monthly average"}
                </p>
                <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                  {language === "ar" ? "+٣.٢ عملاء" : "+3.2 Customers"}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid of recent tables & customers list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent sales table card */}
        <Card
          className="lg:col-span-2"
          title={t.recent_sales}
          subtitle={
            language === "ar"
              ? "عرض آخر ٥ فواتير تم قيدها بنجاح"
              : "Showing latest 5 invoices recorded"
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo("sales")}
              className="text-xs"
            >
              {t.view_all}
            </Button>
          }
        >
          <div className="overflow-x-auto mt-4 rounded-xl border border-slate-50 dark:border-slate-800/50">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3 text-start">{t.invoice_number}</th>
                  <th className="px-4 py-3 text-start">{t.customer_name}</th>
                  <th className="px-4 py-3 text-start">{t.total_amount}</th>
                  <th className="px-4 py-3 text-start">{t.status}</th>
                  <th className="px-4 py-3 text-center">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-105/50 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                {recentSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-slate-805 dark:text-slate-100">
                      {sale.invoiceNumber}
                    </td>
                    <td className="px-4 py-3 font-semibold truncate max-w-35">
                      {sale.customerName}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                      {formatCurrency(sale.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getSaleStatusVariant(sale.status)}>
                        {sale.status === "Completed"
                          ? t.completed
                          : sale.status === "Pending"
                            ? t.pending
                            : t.cancelled}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => navigateTo("sale-details", sale.id)}
                        className="text-xs font-semibold text-indigo-650 hover:underline cursor-pointer dark:text-indigo-400"
                      >
                        {t.view}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Latest customers list card */}
        <Card
          title={t.latest_customers}
          subtitle={
            language === "ar"
              ? "مراجعة أحدث المسجلين بالدليل"
              : "Recent customer registrations"
          }
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateTo("customers")}
              className="text-xs"
            >
              {t.view_all}
            </Button>
          }
        >
          <div className="mt-4 flex flex-col gap-4">
            {recentCustomers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => navigateTo("customer-details", cust.id)}
                className="flex items-center gap-3.5 p-2 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30 cursor-pointer"
              >
                {/* Avatar graphic placeholder with initial */}
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-450 font-black flex items-center justify-center uppercase select-none text-xs">
                  {cust.fullName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {cust.fullName}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {cust.email}
                  </p>
                </div>
                <Badge variant="neutral">
                  <ChevronRight className="h-3 w-3 text-slate-400 dark:text-slate-500 rtl:rotate-180" />
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
