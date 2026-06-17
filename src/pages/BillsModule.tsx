import React, { useState } from "react";
import { useAppStore } from "../stores/store";
import { translations } from "../i18n/translations";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Modal } from "../components/Modal";
import { ConfirmDelete } from "../components/ConfirmDelete";
import { Badge } from "../components/Badge";
import { EmptyState } from "../components/EmptyState";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Edit3,
  Eye,
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { BillStatus } from "../types";

interface BillsModuleProps {
  searchTerm: string;
}

export const BillsModule: React.FC<BillsModuleProps> = ({ searchTerm }) => {
  const {
    bills,
    customers,
    currentRoute,
    activeId,
    language,
    navigateTo,
    addBill,
    editBill,
    deleteBill,
    addToast,
  } = useAppStore();

  const t = translations[language];

  // List filter states
  const [innerSearch, setInnerSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // 'All' | 'Paid' | 'Unpaid' | 'Overdue'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<string | null>(null);

  // Forms Fields
  const [billNumber, setBillNumber] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [amount, setAmount] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<BillStatus>("Unpaid");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");

  // Deletion logic
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form error validations
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateBillNum = () => {
    return "BIL-2026-" + Math.floor(800 + Math.random() * 199);
  };

  const resetForm = () => {
    setBillNumber(generateBillNum());
    setCustomerId(customers[0]?.id || "");
    setAmount(0);
    setDueDate(
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    ); // +14 days default
    setStatus("Unpaid");
    setPaymentMethod("Bank Transfer");
    setErrors({});
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!billNumber.trim()) errs.billNumber = t.required_field;
    if (!customerId) errs.customerId = "Please select a customer/partner";
    if (amount <= 0) errs.amount = "Must be greater than 0";
    if (!dueDate) errs.dueDate = t.required_field;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedCust = customers.find((c) => c.id === customerId);
    if (!selectedCust) return;

    addBill({
      billNumber,
      customerId,
      customerName: selectedCust.fullName,
      amount,
      dueDate,
      status,
      paymentMethod,
    });

    setIsAddOpen(false);
    resetForm();
    addToast(t.toast_bill_added, "success");
  };

  const handleOpenEdit = (bill: any) => {
    setSelectedBillId(bill.id);
    setBillNumber(bill.billNumber);
    setCustomerId(bill.customerId);
    setAmount(bill.amount);
    setDueDate(bill.dueDate);
    setStatus(bill.status);
    setPaymentMethod(bill.paymentMethod);
    setErrors({});
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedBillId) return;

    const selectedCust = customers.find((c) => c.id === customerId);
    if (!selectedCust) return;

    editBill(selectedBillId, {
      billNumber,
      customerId,
      customerName: selectedCust.fullName,
      amount,
      dueDate,
      status,
      paymentMethod,
    });

    setIsEditOpen(false);
    resetForm();
    addToast(t.toast_bill_updated, "success");
  };

  const handleOpenDelete = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteBill(deleteTargetId);
      addToast(t.toast_bill_deleted, "success");
    }
  };

  const activeSearch = (searchTerm || innerSearch).toLowerCase();

  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.billNumber.toLowerCase().includes(activeSearch) ||
      b.customerName.toLowerCase().includes(activeSearch);
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredBills.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBills = filteredBills.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getBillStatusVariant = (status: string) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Unpaid":
        return "warning";
      case "Overdue":
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

  // -------------------------------------------------------------
  // DETAILS SUB-PAGE (WITH INTERACTIVE SET-PAID ACTION)
  // -------------------------------------------------------------
  if (currentRoute === "bill-details" && activeId) {
    const bill = bills.find((b) => b.id === activeId);
    if (!bill) {
      return (
        <div className="p-8 text-center Card">
          <p className="text-sm font-bold text-slate-500">
            Bill record not found
          </p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigateTo("bills")}
          >
            Back to Accounts
          </Button>
        </div>
      );
    }

    const isPendingOrOverdue = bill.status !== "Paid";

    return (
      <div className="space-y-6 animate-fade-in-up">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo("bills")}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          >
            {language === "ar" ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
            <span>{t.bills_list}</span>
          </button>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleOpenEdit(bill)}
            >
              <Edit3 className="h-3.5 w-3.5 me-1.5" />
              {t.edit}
            </Button>
          </div>
        </div>

        {/* Informative warning header banner depending on state */}
        {bill.status === "Overdue" && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3.5 text-red-700 animate-pulse-slow">
            <AlertTriangle className="h-5 w-5 text-red-650 shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold block">
                ATTENTION REQUIRED: Overdue Account Payable
              </span>
              <span>
                This bill has exceeded its scheduled payment threshold. Settle
                immediate balance to maintain strategic partnerships.
              </span>
            </div>
          </div>
        )}

        {bill.status === "Unpaid" && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-3.5 text-amber-700">
            <Clock className="h-5 w-5 text-amber-600 shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold block">
                CREDIT PERIOD ACTIVE: Scheduled payment pending
              </span>
              <span>
                This voucher is currently unsettled. Settle invoice parameters
                before due date on {bill.dueDate}.
              </span>
            </div>
          </div>
        )}

        {bill.status === "Paid" && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3.5 text-emerald-700">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-extrabold block">
                TRANSACTION SETTLED: Accounts Payable Reconciled
              </span>
              <span>
                Financial log completed. Capital has been correctly transfered
                via {bill.paymentMethod}.
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main detail card */}
          <Card className="lg:col-span-2" title={t.bill_details}>
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-50 dark:border-slate-800/40 pb-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    Bill ID Number
                  </span>
                  <span className="font-mono font-bold text-slate-850 dark:text-white block mt-1">
                    {bill.billNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    {t.status}
                  </span>
                  <span className="mt-1 block">
                    <Badge variant={getBillStatusVariant(bill.status)}>
                      {bill.status === "Paid"
                        ? t.paid
                        : bill.status === "Unpaid"
                          ? t.unpaid
                          : t.overdue}
                    </Badge>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-slate-50 dark:border-slate-800/40 pb-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    Vendor Partner
                  </span>
                  <span
                    className="font-semibold text-slate-805 dark:text-white hover:underline cursor-pointer block mt-1"
                    onClick={() =>
                      navigateTo("customer-details", bill.customerId)
                    }
                  >
                    {bill.customerName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    {t.payment_method}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mt-1">
                    {bill.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    Voucher Total Amount
                  </span>
                  <span className="font-black text-slate-905 dark:text-white block font-mono text-base mt-1">
                    {formatCurrency(bill.amount)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase text-[10px]">
                    {t.due_date}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block mt-1">
                    {bill.dueDate}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick settlement action card */}
          <Card className="lg:col-span-1" title="Ledger Operations">
            <div className="space-y-4 pt-2">
              <p className="text-xs text-slate-450 dark:text-slate-400 leading-relaxed">
                Control the liability statuses instantly. Setting the bill to
                "Paid" simulates instant ERP capital balancing, modifying
                related cash flow parameters in real time.
              </p>

              {isPendingOrOverdue ? (
                <Button
                  variant="success"
                  className="w-full font-bold rounded-xl py-2.5 text-xs"
                  onClick={() => {
                    editBill(bill.id, { status: "Paid" });
                    addToast(
                      "Bill payment verified and processed successfully!",
                      "success",
                    );
                  }}
                >
                  <CreditCard className="h-4 w-4 me-1.5" />
                  Mark as Paid (Settle)
                </Button>
              ) : (
                <div className="text-center p-4 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/20 text-emerald-600 text-xs font-bold">
                  Payment Reconciled
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Edit modal */}
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title={t.edit_bill}
        >
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <Input
              label={t.bill_number}
              placeholder="e.g. BIL-2026-001"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              error={errors.billNumber}
              id="bill-edit-num"
            />

            <Select
              label={t.customer_name}
              options={customers.map((c) => ({
                value: c.id,
                label: c.fullName,
              }))}
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              id="bill-edit-cust"
            />

            <Input
              label={t.total_amount}
              type="number"
              min={0}
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              error={errors.amount}
              id="bill-edit-val"
            />

            <Input
              label={t.due_date}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              error={errors.dueDate}
              id="bill-edit-date"
            />

            <Select
              label={t.payment_method}
              options={[
                { value: "Bank Transfer", label: "Bank Transfer" },
                { value: "Credit Card", label: "Credit Card" },
                { value: "Bank Wire", label: "Bank Wire" },
                { value: "PayPal", label: "PayPal" },
                { value: "Cash", label: "Cash" },
              ]}
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              id="bill-edit-meth"
            />

            <Select
              label={t.status}
              options={[
                { value: "Paid", label: t.paid },
                { value: "Unpaid", label: t.unpaid },
                { value: "Overdue", label: t.overdue },
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value as BillStatus)}
              id="bill-edit-st"
            />

            <div className="flex justify-end gap-2.5 mt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditOpen(false)}
              >
                {t.cancel}
              </Button>
              <Button type="submit" variant="primary">
                {t.save}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LIST VIEW
  // -------------------------------------------------------------
  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header controls layout bar */}
      <div className="sm:flex sm:items-center sm:justify-between sm:gap-4 flex flex-col sm:flex-row gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-white tracking-tight">
            {t.bills_list}
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">
            {t.bills_list_description}
          </p>
        </div>

        {/* Dynamic add registration button click */}
        <div className="flex items-center gap-2">
          {customers.length === 0 ? (
            <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-955/35 p-2 rounded-lg font-bold">
              Add at least 1 customer profile to register bills.
            </span>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                resetForm();
                setIsAddOpen(true);
              }}
              className="font-bold"
            >
              <Plus className="h-4 w-4 me-1.5" />
              {t.add_bill}
            </Button>
          )}
        </div>
      </div>

      {/* Grid filtering parameters */}
      <Card>
        <div className="sm:flex items-center justify-between gap-4 flex flex-col sm:flex-row">
          {/* Inner Search block */}
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 inset-s-3 pointer-events-none text-slate-400 flex items-center">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder={t.search_bills}
              value={innerSearch}
              onChange={(e) => {
                setInnerSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-205 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2 ps-10 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Status selecting filter dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <Select
              className="py-1.5 min-w-35"
              options={[
                {
                  value: "All",
                  label: language === "ar" ? "جميع المستحقات" : "All Bills",
                },
                { value: "Paid", label: t.paid },
                { value: "Unpaid", label: t.unpaid },
                { value: "Overdue", label: t.overdue },
              ]}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Ledger Table */}
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-50 dark:border-slate-800/60">
          {paginatedBills.length === 0 ? (
            <EmptyState
              title={t.no_bills}
              description="No accounts payable match active filters. Settle existing bills or add a new voucher."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setInnerSearch("");
                    setStatusFilter("All");
                    setCurrentPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-start">{t.bill_number}</th>
                  <th className="px-4 py-3 text-start">{t.customer_name}</th>
                  <th className="px-4 py-3 text-start">{t.total_amount}</th>
                  <th className="px-4 py-3 text-start">{t.due_date}</th>
                  <th className="px-4 py-3 text-start">{t.status}</th>
                  <th className="px-4 py-3 text-center">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-105/50 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300 font-medium">
                {paginatedBills.map((bill) => (
                  <tr
                    key={bill.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-slate-805 dark:text-white">
                      {bill.billNumber}
                    </td>
                    <td
                      className="px-4 py-3 font-semibold hover:underline cursor-pointer"
                      onClick={() =>
                        navigateTo("customer-details", bill.customerId)
                      }
                    >
                      {bill.customerName}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white font-mono">
                      {formatCurrency(bill.amount)}
                    </td>
                    <td className="px-4 py-3 text-slate-550 dark:text-slate-400">
                      {bill.dueDate}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getBillStatusVariant(bill.status)}>
                        {bill.status === "Paid"
                          ? t.paid
                          : bill.status === "Unpaid"
                            ? t.unpaid
                            : t.overdue}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigateTo("bill-details", bill.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 rounded-md hover:bg-slate-105/60 dark:hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(bill)}
                          className="p-1.5 text-slate-400 hover:text-indigo-655 dark:hover:text-indigo-400 rounded-md hover:bg-slate-105/60 dark:hover:bg-slate-800"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(bill.id)}
                          className="p-1.5 text-slate-400 hover:text-red-650 rounded-md hover:bg-slate-105/60 dark:hover:bg-slate-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Panel Footer */}
        {totalItems > 0 && (
          <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800/40 pt-4 mt-4 text-xs">
            <span className="text-slate-500">
              {t.page_showing}{" "}
              <span className="font-bold text-slate-805 dark:text-slate-200">
                {startIndex + 1}
              </span>
              -
              <span className="font-bold text-slate-805 dark:text-slate-200">
                {Math.min(startIndex + itemsPerPage, totalItems)}
              </span>{" "}
              {t.page_of}{" "}
              <span className="font-bold text-slate-805 dark:text-slate-200">
                {totalItems}
              </span>
            </span>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {t.page_prev}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                {t.page_next}
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Dynamic Add Bill Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={t.add_bill}
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label={t.bill_number}
            placeholder="e.g. BIL-2026-102"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
            error={errors.billNumber}
            id="bill-add-num"
          />

          <Select
            label={t.customer_name}
            options={customers.map((c) => ({ value: c.id, label: c.fullName }))}
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            id="bill-add-cust"
          />

          <Input
            label={t.total_amount}
            type="number"
            min={0}
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            error={errors.amount}
            id="bill-add-val"
          />

          <Input
            label={t.due_date}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={errors.dueDate}
            id="bill-add-date"
          />

          <Select
            label={t.payment_method}
            options={[
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Credit Card", label: "Credit Card" },
              { value: "Bank Wire", label: "Bank Wire" },
              { value: "PayPal", label: "PayPal" },
              { value: "Cash", label: "Cash" },
            ]}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            id="bill-add-meth"
          />

          <Select
            label={t.status}
            options={[
              { value: "Paid", label: t.paid },
              { value: "Unpaid", label: t.unpaid },
              { value: "Overdue", label: t.overdue },
            ]}
            value={status}
            onChange={(e) => setStatus(e.target.value as BillStatus)}
            id="bill-add-st"
          />

          <div className="flex justify-end gap-2.5 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAddOpen(false)}
            >
              {t.cancel}
            </Button>
            <Button type="submit" variant="primary">
              {t.add}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dynamic Deletion Confirm Modal */}
      <ConfirmDelete
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
      {/* Dynamic edite Confirm Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={t.edit_bill}
      >
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <Input
            label={t.bill_number}
            placeholder="e.g. BIL-2026-001"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
            error={errors.billNumber}
            id="bill-edit-num"
          />

          <Select
            label={t.customer_name}
            options={customers.map((c) => ({
              value: c.id,
              label: c.fullName,
            }))}
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            id="bill-edit-cust"
          />

          <Input
            label={t.total_amount}
            type="number"
            min={0}
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            error={errors.amount}
            id="bill-edit-val"
          />

          <Input
            label={t.due_date}
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={errors.dueDate}
            id="bill-edit-date"
          />

          <Select
            label={t.payment_method}
            options={[
              { value: "Bank Transfer", label: "Bank Transfer" },
              { value: "Credit Card", label: "Credit Card" },
              { value: "Bank Wire", label: "Bank Wire" },
              { value: "PayPal", label: "PayPal" },
              { value: "Cash", label: "Cash" },
            ]}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            id="bill-edit-meth"
          />

          <Select
            label={t.status}
            options={[
              { value: "Paid", label: t.paid },
              { value: "Unpaid", label: t.unpaid },
              { value: "Overdue", label: t.overdue },
            ]}
            value={status}
            onChange={(e) => setStatus(e.target.value as BillStatus)}
            id="bill-edit-st"
          />

          <div className="flex justify-end gap-2.5 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditOpen(false)}
            >
              {t.cancel}
            </Button>
            <Button type="submit" variant="primary">
              {t.save}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
