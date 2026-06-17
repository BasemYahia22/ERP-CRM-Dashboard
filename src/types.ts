export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
}

export type SaleStatus = 'Completed' | 'Pending' | 'Cancelled';

export interface Sale {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  product: string;
  quantity: number;
  price: number;
  totalAmount: number;
  date: string;
  status: SaleStatus;
}

export type BillStatus = 'Paid' | 'Unpaid' | 'Overdue';

export interface Bill {
  id: string;
  billNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
  paymentMethod: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
