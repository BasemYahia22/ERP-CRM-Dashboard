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
  Printer,
} from "lucide-react";
import { SaleStatus } from "../types";

interface SalesModuleProps {
  searchTerm: string;
}

export const SalesModule: React.FC<SalesModuleProps> = ({ searchTerm }) => {
  const {
    sales,
    customers,
    currentRoute,
    activeId,
    language,
    navigateTo,
    addSale,
    editSale,
    deleteSale,
    addToast,
  } = useAppStore();

  const t = translations[language];

  // List filter states
  const [innerSearch, setInnerSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // 'All' | 'Completed' | 'Pending' | 'Cancelled'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  // Forms Fields
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState<SaleStatus>("Pending");

  // Deletion logic
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Error boundary tracker
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateInvoiceNum = () => {
    return "INV-2026-" + Math.floor(100 + Math.random() * 900);
  };

  const resetForm = () => {
    setInvoiceNumber(generateInvoiceNum());
    setCustomerId(customers[0]?.id || "");
    setProduct("");
    setQuantity(1);
    setPrice(0);
    setStatus("Pending");
    setErrors({});
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!invoiceNumber.trim()) errs.invoiceNumber = t.required_field;
    if (!customerId) errs.customerId = "Please select a customer";
    if (!product.trim()) errs.product = t.required_field;
    if (quantity <= 0) errs.quantity = "Must be greater than 0";
    if (price < 0) errs.price = "Cannot be negative";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const selectedCust = customers.find((c) => c.id === customerId);
    if (!selectedCust) return;

    addSale({
      invoiceNumber,
      customerId,
      customerName: selectedCust.fullName,
      product,
      quantity,
      price,
      status,
    });

    setIsAddOpen(false);
    resetForm();
    addToast(t.toast_sale_added, "success");
  };

  const handleOpenEdit = (sale: any) => {
    setSelectedSaleId(sale.id);
    setInvoiceNumber(sale.invoiceNumber);
    setCustomerId(sale.customerId);
    setProduct(sale.product);
    setQuantity(sale.quantity);
    setPrice(sale.price);
    setStatus(sale.status);
    setErrors({});
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !selectedSaleId) return;

    const selectedCust = customers.find((c) => c.id === customerId);
    if (!selectedCust) return;

    editSale(selectedSaleId, {
      invoiceNumber,
      customerId,
      customerName: selectedCust.fullName,
      product,
      quantity,
      price,
      status,
    });

    setIsEditOpen(false);
    resetForm();
    addToast(t.toast_sale_updated, "success");
  };

  const handleOpenDelete = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteSale(deleteTargetId);
      addToast(t.toast_sale_deleted, "success");
    }
  };

  const activeSearch = (searchTerm || innerSearch).toLowerCase();

  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.invoiceNumber.toLowerCase().includes(activeSearch) ||
      s.customerName.toLowerCase().includes(activeSearch) ||
      s.product.toLowerCase().includes(activeSearch);
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredSales.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSales = filteredSales.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

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

  // -------------------------------------------------------------
  // DETAILS PAGE (INVOICE GENERATOR PRINT MOCK)
  // -------------------------------------------------------------
  if (currentRoute === "sale-details" && activeId) {
    const sale = sales.find((s) => s.id === activeId);
    const client = customers.find((c) => c.id === sale?.customerId);

    if (!sale) {
      return (
        <div className="p-8 text-center Card">
          <p className="text-sm font-bold text-slate-500">Invoice not found</p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigateTo("sales")}
          >
            Back to Journal
          </Button>
        </div>
      );
    }

    const valueSubtotal = sale.totalAmount;
    const valueVatTax = valueSubtotal * 0.05; // 5% VAT
    const valueGrandTotal = valueSubtotal + valueVatTax;

    return (
      <div className="space-y-6 animate-fade-in-up">
        {/* Navigation row details */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateTo("sales")}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer"
          >
            {language === "ar" ? (
              <ArrowRight className="h-4 w-4" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
            <span>{t.sales_list}</span>
          </button>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                addToast(
                  "Formatting layout parameters... Sending document to systems print server.",
                  "success",
                );
              }}
            >
              <Printer className="h-3.5 w-3.5 me-1.5" />
              Print Invoice
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleOpenEdit(sale)}
            >
              <Edit3 className="h-3.5 w-3.5 me-1.5" />
              {t.edit}
            </Button>
          </div>
        </div>

        {/* High visual invoice document Card container */}
        <Card className="shadow-lg border border-slate-100 max-w-4xl mx-auto rounded-xl p-8 sm:p-12 overflow-hidden bg-white dark:bg-slate-900">
          {/* Top Banner layout */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 dark:border-slate-800/80 pb-8 select-none">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8.5 w-8.5 rounded-lg bg-indigo-650 text-white flex items-center justify-center font-bold">
                  E
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-sm">
                  COMPACT ERP SYSTEMS LTD
                </span>
              </div>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-2 leading-relaxed">
                Block C, Business Bay Towers, Dubai, UAE <br />
                VAT IN: AE-10928318 <br />
                support@compact-erp.com
              </p>
            </div>

            <div className="text-start sm:text-end">
              <span className="text-xs uppercase font-extrabold text-indigo-600 dark:text-indigo-400 tracking-wider">
                COMMERCIAL SALES INVOICE
              </span>
              <h1 className="text-xl font-mono font-black text-slate-900 dark:text-white mt-1">
                {sale.invoiceNumber}
              </h1>
              <div className="mt-4 space-y-1 text-[10px] text-slate-500">
                <p>
                  <span className="font-bold">Issue Date:</span> {sale.date}
                </p>
                <p>
                  <span className="font-bold">Due Period:</span> Immediate Cash
                  Ledger
                </p>
                <div className="mt-2.5">
                  <Badge variant={getSaleStatusVariant(sale.status)}>
                    {sale.status === "Completed"
                      ? t.completed
                      : sale.status === "Pending"
                        ? t.pending
                        : t.cancelled}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Client contact parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 my-8 pt-2">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                CLIENT BILL TO:
              </h4>
              <p
                className="text-xs font-bold text-slate-900 dark:text-white hover:underline cursor-pointer"
                onClick={() => navigateTo("customer-details", sale.customerId)}
              >
                {sale.customerName}
              </p>
              <p className="text-[10px] text-slate-450 dark:text-slate-400 leading-relaxed mt-2">
                {client?.address || "Address registry omitted."} <br />
                Tel: {client?.phone || "Omitted"} <br />
                Email: {client?.email || "Omitted"}
              </p>
            </div>
          </div>

          {/* Table Breakdown of Product Line Items */}
          <div className="overflow-x-auto rounded-lg border border-slate-50 dark:border-slate-800">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 font-bold tracking-wider uppercase">
                <tr>
                  <th className="px-4 py-2.5">Product Descriptor</th>
                  <th className="px-4 py-2.5 text-center">Unit Price</th>
                  <th className="px-4 py-2.5 text-center">Quantity</th>
                  <th className="px-4 py-2.5 text-end">Extended Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-105/50 dark:divide-slate-800/50 text-slate-700 dark:text-slate-350">
                <tr>
                  <td className="px-4 py-4 font-semibold">
                    <p className="text-slate-900 dark:text-white">
                      {sale.product}
                    </p>
                    <span className="text-[10px] text-slate-450 mt-1 block">
                      ERP registered SaaS parameters index
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center font-mono">
                    {formatCurrency(sale.price)}
                  </td>
                  <td className="px-4 py-4 text-center">{sale.quantity}</td>
                  <td className="px-4 py-4 text-end font-bold text-slate-900 dark:text-white font-mono">
                    {formatCurrency(sale.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom summaries layout */}
          <div className="flex flex-col sm:flex-row justify-end mt-8">
            <div className="w-full sm:w-64 space-y-2 text-xs border-t border-slate-50 dark:border-slate-800 pt-4">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal Value:</span>
                <span className="font-bold text-slate-805 dark:text-slate-200 font-mono">
                  {formatCurrency(valueSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Standard VAT (5%):</span>
                <span className="font-bold text-slate-805 dark:text-slate-200 font-mono">
                  {formatCurrency(valueVatTax)}
                </span>
              </div>
              <div className="border-t border-slate-50 dark:border-slate-800 py-1" />
              <div className="flex justify-between text-slate-900 text-sm font-extrabold bg-slate-50 dark:bg-slate-850 px-3 py-2 rounded-xl">
                <span>Grand Total:</span>
                <span className="font-mono">
                  {formatCurrency(valueGrandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer credentials */}
          <div className="text-center text-[10px] text-slate-400 mt-16 border-t border-slate-50 dark:border-slate-800/80 pt-4">
            Thank you for your commercial cooperation! All transactions are
            bound under GCC system codes.
          </div>
        </Card>

        {/* Edit modal */}
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title={t.edit_sale}
        >
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <Input
              label={t.invoice_number}
              placeholder="e.g. INV-2026-001"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              error={errors.invoiceNumber}
              id="sale-edit-inv"
            />

            <Select
              label={t.customer_name}
              options={customers.map((c) => ({
                value: c.id,
                label: c.fullName,
              }))}
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              id="sale-edit-cust"
            />

            <Input
              label={t.product}
              placeholder="e.g. Enterprise License Upgrade"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              error={errors.product}
              id="sale-edit-prod"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t.quantity}
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                error={errors.quantity}
                id="sale-edit-qty"
              />
              <Input
                label={t.price}
                type="number"
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                error={errors.price}
                id="sale-edit-pr"
              />
            </div>

            <Select
              label={t.status}
              options={[
                { value: "Completed", label: t.completed },
                { value: "Pending", label: t.pending },
                { value: "Cancelled", label: t.cancelled },
              ]}
              value={status}
              onChange={(e) => setStatus(e.target.value as SaleStatus)}
              id="sale-edit-st"
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

        {/* Confirm Delete layout */}
        <ConfirmDelete
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={() => {
            handleConfirmDelete();
            navigateTo("sales");
          }}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // LIST JOURNAL VIEW
  // -------------------------------------------------------------
  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Upper action bar */}
      <div className="sm:flex sm:items-center sm:justify-between sm:gap-4 flex flex-col sm:flex-row gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-slate-950 dark:text-white tracking-tight">
            {t.sales_list}
          </h2>
          <p className="text-xs text-slate-450 dark:text-slate-400 mt-1">
            {t.sales_list_description}
          </p>
        </div>

        {/* Dynamic add click */}
        <div className="flex items-center gap-2">
          {customers.length === 0 ? (
            <span className="text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-955/35 p-2 rounded-lg font-bold">
              Add at least 1 customer profile to register invoices.
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
              {t.add_sale}
            </Button>
          )}
        </div>
      </div>

      {/* Constraints and list box */}
      <Card>
        <div className="sm:flex items-center justify-between gap-4 flex flex-col sm:flex-row">
          {/* Inner Search input */}
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 inset-s-3 pointer-events-none text-slate-405 flex items-center">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder={t.search_sales}
              value={innerSearch}
              onChange={(e) => {
                setInnerSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-205 dark:border-slate-801 text-slate-900 dark:text-white px-3 py-2 ps-10 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Stat code filtration toggler select dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <Select
              className="py-1.5 min-w-35"
              options={[
                {
                  value: "All",
                  label: language === "ar" ? "جميع الفواتير" : "All Invoices",
                },
                { value: "Completed", label: t.completed },
                { value: "Pending", label: t.pending },
                { value: "Cancelled", label: t.cancelled },
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
          {paginatedSales.length === 0 ? (
            <EmptyState
              title={t.no_sales}
              description="No sales invoices match active constraints. Issue a sale invoice or update status filters."
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
                  <th className="px-4 py-3 text-start">Invoice #</th>
                  <th className="px-4 py-3 text-start">{t.customer_name}</th>
                  <th className="px-4 py-3 text-start">{t.product}</th>
                  <th className="px-4 py-3 text-start">{t.total_amount}</th>
                  <th className="px-4 py-3 text-start">{t.status}</th>
                  <th className="px-4 py-3 text-center">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-105/50 dark:divide-slate-800/40 text-slate-700 dark:text-slate-300">
                {paginatedSales.map((sale) => (
                  <tr
                    key={sale.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-mono font-bold text-slate-805 dark:text-white">
                      {sale.invoiceNumber}
                    </td>
                    <td
                      className="px-4 py-3 font-semibold hover:underline cursor-pointer"
                      onClick={() =>
                        navigateTo("customer-details", sale.customerId)
                      }
                    >
                      {sale.customerName}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-medium truncate max-w-35">
                      {sale.product}
                    </td>
                    <td className="px-4 py-3 font-extrabold text-slate-900 dark:text-white font-mono">
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
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigateTo("sale-details", sale.id)}
                          className="p-1.5 text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 rounded-md hover:bg-slate-105/60 dark:hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(sale)}
                          className="p-1.5 text-slate-400 hover:text-indigo-655 dark:hover:text-indigo-400 rounded-md hover:bg-slate-105/60 dark:hover:bg-slate-800"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(sale.id)}
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

      {/* Dynamic Add Sale Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={t.add_sale}
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input
            label={t.invoice_number}
            placeholder="e.g. INV-2026-102"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            error={errors.invoiceNumber}
            id="sale-add-inv"
          />

          <Select
            label={t.customer_name}
            options={customers.map((c) => ({ value: c.id, label: c.fullName }))}
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            id="sale-add-cust"
          />

          <Input
            label={t.product}
            placeholder="e.g. Cloud Security Integration Platform"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            error={errors.product}
            id="sale-add-prod"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t.quantity}
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              error={errors.quantity}
              id="sale-add-qty"
            />
            <Input
              label={t.price}
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              error={errors.price}
              id="sale-add-pr"
            />
          </div>

          <Select
            label={t.status}
            options={[
              { value: "Completed", label: t.completed },
              { value: "Pending", label: t.pending },
              { value: "Cancelled", label: t.cancelled },
            ]}
            value={status}
            onChange={(e) => setStatus(e.target.value as SaleStatus)}
            id="sale-add-st"
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

      {/* Dynamic Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={t.edit_sale}
      >
        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <Input
            label={t.invoice_number}
            placeholder="e.g. INV-2026-001"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            error={errors.invoiceNumber}
            id="sale-edit-inv"
          />

          <Select
            label={t.customer_name}
            options={customers.map((c) => ({
              value: c.id,
              label: c.fullName,
            }))}
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            id="sale-edit-cust"
          />

          <Input
            label={t.product}
            placeholder="e.g. Enterprise License Upgrade"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            error={errors.product}
            id="sale-edit-prod"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t.quantity}
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              error={errors.quantity}
              id="sale-edit-qty"
            />
            <Input
              label={t.price}
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              error={errors.price}
              id="sale-edit-pr"
            />
          </div>

          <Select
            label={t.status}
            options={[
              { value: "Completed", label: t.completed },
              { value: "Pending", label: t.pending },
              { value: "Cancelled", label: t.cancelled },
            ]}
            value={status}
            onChange={(e) => setStatus(e.target.value as SaleStatus)}
            id="sale-edit-st"
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
