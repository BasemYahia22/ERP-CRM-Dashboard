import React, { useState } from "react";
import { useAppStore } from "../stores/store";
import { translations } from "../i18n/translations";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Modal } from "../components/Modal";
import { ConfirmDelete } from "../components/ConfirmDelete";
import { EmptyState } from "../components/EmptyState";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Edit3,
  Eye,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";

interface CustomersModuleProps {
  searchTerm: string;
}

export const CustomersModule: React.FC<CustomersModuleProps> = ({
  searchTerm,
}) => {
  const {
    customers,
    sales,
    bills,
    currentRoute,
    activeId,
    language,
    navigateTo,
    addCustomer,
    editCustomer,
    deleteCustomer,
    addToast,
  } = useAppStore();

  const t = translations[language];

  // Component states
  const [innerSearch, setInnerSearch] = useState("");
  const [filterSort, setFilterSort] = useState("newest"); // 'newest' | 'oldest' | 'alphabetical'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Add/Edit Modals states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Delete State
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Error validations
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form fields
  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setNotes("");
    setErrors({});
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = t.required_field;
    if (!email.trim()) {
      errs.email = t.required_field;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = "Invalid email format";
    }
    if (!phone.trim()) errs.phone = t.required_field;

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    addCustomer({ fullName, email, phone, address, notes });
    setIsAddOpen(false);
    resetForm();
    addToast(t.toast_customer_added, "success");
  };

  const handleOpenEdit = (customer: any) => {
    setSelectedCustomerId(customer.id);
    setFullName(customer.fullName);
    setEmail(customer.email);
    setPhone(customer.phone);
    setAddress(customer.address);
    setNotes(customer.notes);
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedCustomerId) return;

    editCustomer(selectedCustomerId, {
      fullName,
      email,
      phone,
      address,
      notes,
    });
    setIsEditOpen(false);
    resetForm();
    addToast(t.toast_customer_updated, "success");
  };

  const handleOpenDelete = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteCustomer(deleteTargetId);
      addToast(t.toast_customer_deleted, "success");
    }
  };

  // Combining search terms
  const activeSearch = (searchTerm || innerSearch).toLowerCase();

  // Filter & Search records
  const filteredCustomers = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(activeSearch) ||
      c.email.toLowerCase().includes(activeSearch) ||
      c.phone.toLowerCase().includes(activeSearch) ||
      c.address.toLowerCase().includes(activeSearch),
  );

  // Sorting
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (filterSort === "alphabetical") {
      return a.fullName.localeCompare(b.fullName);
    } else if (filterSort === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Pagination bounds
  const totalItems = sortedCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = sortedCustomers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat(language === "ar" ? "ar-US" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // -------------------------------------------------------------
  // RENDER CUSTOMER DETAILS VIEW
  // -------------------------------------------------------------
  if (currentRoute === "customer-details" && activeId) {
    const customer = customers.find((c) => c.id === activeId);
    if (!customer) {
      return (
        <div className="p-8 text-center Card">
          <p className="text-sm font-bold text-slate-500">Resource not found</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigateTo("customers")}
          >
            Back to Directory
          </Button>
        </div>
      );
    }

    // Filter relevant invoices/saless and bills
    const customerSales = sales.filter((s) => s.customerId === customer.id);
    const customerBills = bills.filter((b) => b.customerId === customer.id);

    // total lifetime spent
    const totalSpent = customerSales
      .filter((s) => s.status === "Completed")
      .reduce((sum, s) => sum + s.totalAmount, 0);
    const totalOut = customerBills
      .filter((b) => b.status !== "Paid")
      .reduce((sum, b) => sum + b.amount, 0);

    return (
      <div className="space-y-6 animate-fade-in-up">
        {/* Back navigation header bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo("customers")}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          >
            {language === "ar" ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
            <span>{t.customer_list}</span>
          </button>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleOpenEdit(customer)}
            >
              <Edit3 className="h-3.5 w-3.5 me-1.5" />
              {t.edit}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleOpenDelete(customer.id)}
            >
              <Trash2 className="h-3.5 w-3.5 me-1.5" />
              {t.delete}
            </Button>
          </div>
        </div>

        {/* Profile Card Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main profile brief Card */}
          <Card className="lg:col-span-1">
            <div className="flex flex-col items-center text-center py-4">
              <div className="h-16 w-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/45 text-indigo-650 dark:text-indigo-400 font-extrabold text-2xl flex items-center justify-center uppercase select-none shadow-sm mb-4">
                {customer.fullName.charAt(0)}
              </div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                {customer.fullName}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customer ID: {customer.id}
              </p>

              <div className="w-full border-t border-slate-50 dark:border-slate-800/40 my-4 text-start pt-4 space-y-3">
                <div className="flex gap-3 text-xs leading-none">
                  <Mail className="h-4 w-4 text-slate-405 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 select-all truncate">
                    {customer.email}
                  </span>
                </div>
                <div className="flex gap-3 text-xs leading-none items-center">
                  <Phone className="h-4 w-4 text-slate-405 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 select-all">
                    {customer.phone}
                  </span>
                </div>
                <div className="flex gap-3 text-xs leading-relaxed">
                  <MapPin className="h-4 w-4 text-slate-405 shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">
                    {customer.address || "No address indexed"}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick numbers cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
            <Card className="flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-650 flex items-center justify-center">
                  <TrendingUp className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-slate-500 text-xs font-bold tracking-wider mt-4 uppercase">
                  LIFETIME VOLUME VALUE
                </h4>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  {formatCurrency(totalSpent)}
                </p>
              </div>
              <div className="text-[10px] text-slate-400 mt-4 leading-none">
                Sum of successfully completed client transactions
              </div>
            </Card>

            <Card className="flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-550 flex items-center justify-center">
                  <FileSpreadsheet className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-slate-500 text-xs font-bold tracking-wider mt-4 uppercase">
                  OUTSTANDING LIABILITIES
                </h4>
                <p className="text-2xl font-black text-rose-650 dark:text-rose-400 mt-1">
                  {formatCurrency(totalOut)}
                </p>
              </div>
              <div className="text-[10px] text-slate-400 mt-4 leading-none">
                Total outstanding in unpaid invoice vouchers
              </div>
            </Card>
          </div>
        </div>

        {/* Notes & ledger lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1" title={t.notes}>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic whitespace-pre-wrap">
              {customer.notes ||
                "No notes annotated for this customer profile."}
            </p>
          </Card>

          {/* Sales History Log */}
          <Card className="lg:col-span-2" title={t.recent_sales}>
            {customerSales.length === 0 ? (
              <div className="text-center py-6 text-slate-405 text-xs">
                No invoices issued for this client.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-50 dark:border-slate-800">
                <table className="w-full text-xs text-start">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-350">
                    <tr>
                      <th className="px-3.5 py-2 text-start">
                        {t.invoice_number}
                      </th>
                      <th className="px-3.5 py-2 text-start">{t.product}</th>
                      <th className="px-3.5 py-2 text-start">
                        {t.total_amount}
                      </th>
                      <th className="px-3.5 py-2 text-start">{t.status}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-105/50 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                    {customerSales.map((sale) => (
                      <tr
                        key={sale.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20"
                      >
                        <td className="px-3.5 py-2.5 font-mono font-bold text-slate-805 dark:text-white">
                          {sale.invoiceNumber}
                        </td>
                        <td className="px-3.5 py-2.5 font-medium">
                          {sale.product}
                        </td>
                        <td className="px-3.5 py-2.5 font-bold">
                          {formatCurrency(sale.totalAmount)}
                        </td>
                        <td className="px-3.5 py-2.5">
                          <span
                            className={`inline-block h-2 w-2 rounded-full me-1.5
                            ${sale.status === "Completed" ? "bg-emerald-500" : sale.status === "Pending" ? "bg-amber-500" : "bg-red-500"}`}
                          />
                          <span>{sale.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Inner Confirm deletion logic */}
        <ConfirmDelete
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            handleConfirmDelete();
            navigateTo("customers");
          }}
        />

        {/* Dynamic Edit Modal */}
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title={t.edit_customer}
        >
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <Input
              label={t.customer_name}
              placeholder="e.g. Apex Industries Corp"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              id="cust-edit-name"
            />
            <Input
              label={t.email}
              type="email"
              placeholder="e.g. billing@apex.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              id="cust-edit-email"
            />
            <Input
              label={t.phone}
              placeholder="e.g. +1 (555) 0192-384"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={errors.phone}
              id="cust-edit-ph"
            />
            <Input
              label={t.address}
              placeholder="e.g. 129 Corporate Drive, Sector 4, WA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              id="cust-edit-addr"
            />
            <div className="flex flex-col gap-1">
              <label
                htmlFor="cust-edit-notes"
                className="text-xs font-semibold text-slate-700 dark:text-slate-350"
              >
                {t.notes}
              </label>
              <textarea
                id="cust-edit-notes"
                rows={3}
                className="w-full text-sm rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                placeholder="Write relationship notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

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
            {t.customer_list}
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">
            {t.customer_list_description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Add Customer button click */}
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
            {t.add_customer}
          </Button>
        </div>
      </div>

      {/* Directory filtering layout */}
      <Card>
        <div className="sm:flex items-center justify-between gap-4 flex flex-col sm:flex-row">
          {/* Internal search wrapper */}
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 inset-s-3 pointer-events-none text-slate-400 flex items-center">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder={t.search_customers}
              value={innerSearch}
              onChange={(e) => {
                setInnerSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-205 dark:border-slate-800 text-slate-900 dark:text-white px-3 py-2 ps-10 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Sorters and helpers */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <Select
              className="py-1.5 min-w-35"
              options={[
                {
                  value: "newest",
                  label:
                    language === "ar"
                      ? "تاريخ الإضافة (الأحدث)"
                      : "AddedDate (Newest)",
                },
                {
                  value: "oldest",
                  label:
                    language === "ar"
                      ? "تاريخ الإضافة (الأقدم)"
                      : "AddedDate (Oldest)",
                },
                {
                  value: "alphabetical",
                  label: language === "ar" ? "الترتيب الأبجدي" : "Alphabetical",
                },
              ]}
              value={filterSort}
              onChange={(e) => {
                setFilterSort(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Customers table records */}
        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-50 dark:border-slate-800/60">
          {paginatedCustomers.length === 0 ? (
            <EmptyState
              title={t.no_customers}
              description="No customer records match active constraints. Try updating your directory search phrase."
              action={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setInnerSearch("");
                    setCurrentPage(1);
                  }}
                >
                  Clear Search
                </Button>
              }
            />
          ) : (
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-start">{t.customer_name}</th>
                  <th className="px-4 py-3 text-start">{t.email}</th>
                  <th className="px-4 py-3 text-start">{t.phone}</th>
                  <th className="px-4 py-3 text-start">{t.address}</th>
                  <th className="px-4 py-3 text-center">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-105/50 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                {paginatedCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8.5 w-8.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-black text-xs flex shrink-0 items-center justify-center uppercase">
                          {cust.fullName.charAt(0)}
                        </div>
                        <span className="truncate">{cust.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium">
                      {cust.email}
                    </td>
                    <td className="px-4 py-3 font-medium select-all">
                      {cust.phone}
                    </td>
                    <td className="px-4 py-3 max-w-37.5 truncate">
                      {cust.address || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() =>
                            navigateTo("customer-details", cust.id)
                          }
                          className="p-1.5 text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 rounded-md hover:bg-slate-105/60 dark:hover:bg-slate-800"
                          title={t.view}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 text-slate-400 hover:text-indigo-655 dark:hover:text-indigo-400 rounded-md hover:bg-slate-105/60 dark:hover:bg-slate-800"
                          title={t.edit}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(cust.id)}
                          className="p-1.5 text-slate-400 hover:text-red-650 rounded-md hover:bg-slate-105/60 dark:hover:bg-slate-800"
                          title={t.delete}
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

      {/* Dynamic Add Customer Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={t.add_customer}
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label={t.customer_name}
            placeholder="e.g. Apex Industries Corp"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            id="cust-add-name"
          />
          <Input
            label={t.email}
            type="email"
            placeholder="e.g. billing@apex.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            id="cust-add-email"
          />
          <Input
            label={t.phone}
            placeholder="e.g. +1 (555) 0192-384"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            id="cust-add-ph"
          />
          <Input
            label={t.address}
            placeholder="e.g. 129 Corporate Drive, Sector 4, WA"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            id="cust-add-addr"
          />
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cust-add-notes"
              className="text-xs font-semibold text-slate-700 dark:text-slate-350"
            >
              {t.notes}
            </label>
            <textarea
              id="cust-add-notes"
              rows={3}
              className="w-full text-sm rounded-lg border bg-white dark:bg-slate-900 border-slate-202 dark:border-slate-800 text-slate-900 dark:text-white p-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Write relationship notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

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

      {/* Dynamic Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={t.edit_customer}
      >
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <Input
            label={t.customer_name}
            placeholder="e.g. Apex Industries Corp"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={errors.fullName}
            id="cust-list-edit-name"
          />
          <Input
            label={t.email}
            type="email"
            placeholder="e.g. billing@apex.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            id="cust-list-edit-email"
          />
          <Input
            label={t.phone}
            placeholder="e.g. +1 (555) 0192-384"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={errors.phone}
            id="cust-list-edit-ph"
          />
          <Input
            label={t.address}
            placeholder="e.g. 129 Corporate Drive, Sector 4, WA"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            id="cust-list-edit-addr"
          />
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cust-list-edit-notes"
              className="text-xs font-semibold text-slate-700 dark:text-slate-350"
            >
              {t.notes}
            </label>
            <textarea
              id="cust-list-edit-notes"
              rows={3}
              className="w-full text-sm rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white p-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Write relationship notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

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
