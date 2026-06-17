import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Customer, Sale, Bill, User, Theme, Language, Toast } from '../../types';

interface AppContextType {
  theme: Theme;
  language: Language;
  currentUser: User | null;
  customers: Customer[];
  sales: Sale[];
  bills: Bill[];
  toasts: Toast[];
  currentRoute: string;
  activeId: string | null;
  notifications: Array<{ id: string; titleEn: string; titleAr: string; time: string; read: boolean }>;
  
  // Actions
  setLanguage: (lang: Language) => void;
  toggleTheme: () => void;
  login: (email: string, name?: string, rememberMe?: boolean) => boolean;
  signup: (name: string, email: string) => boolean;
  logout: () => void;
  
  // Customers CRUD
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => void;
  editCustomer: (id: string, updated: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  
  // Sales CRUD
  addSale: (sale: Omit<Sale, 'id' | 'totalAmount' | 'date'>) => void;
  editSale: (id: string, updated: Partial<Sale>) => void;
  deleteSale: (id: string) => void;
  
  // Bills CRUD
  addBill: (bill: Omit<Bill, 'id'>) => void;
  editBill: (id: string, updated: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  
  // Navigation
  navigateTo: (route: string, id?: string | null) => void;
  
  // Toasts
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
  markNotificationsRead: () => void;
  updateProfile?: (updated: { name: string; email: string; avatarUrl: string }) => void;
  resetData?: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    fullName: "Apex Global Solutions",
    email: "contact@apexglobal.com",
    phone: "+1 (555) 0192-384",
    address: "742 Evergreen Terrace, Tech Sector, CA",
    notes: "VIP corporate account. Fast payment cycle.",
    createdAt: "2026-01-15T08:30:00Z"
  },
  {
    id: "cust-2",
    fullName: "Khalid Mansoor Al-Farsi",
    email: "khalid.m@alkhalij.ae",
    phone: "+971 50 123 4567",
    address: "Jumeirah Heights, Block B, Flat 402, Dubai, UAE",
    notes: "Requires invoices in both English and Arabic.",
    createdAt: "2026-02-10T11:45:00Z"
  },
  {
    id: "cust-3",
    fullName: "Sarah Jenkins & Partners",
    email: "accounting@jenkins-law.com",
    phone: "+1 (555) 0148-921",
    address: "12 Wall Street, Penthouse 3, New York, NY",
    notes: "Monthly retainer contract. Renewed annually.",
    createdAt: "2026-03-01T09:12:00Z"
  },
  {
    id: "cust-4",
    fullName: "Fatima Al-Suwaidi Consultants",
    email: "info@fatimaconsultancy.qa",
    phone: "+974 4412 8899",
    address: "West Bay Corporate Tower, 18th Floor, Doha, Qatar",
    notes: "Primary strategic partner in the MENA region.",
    createdAt: "2026-04-18T14:20:00Z"
  },
  {
    id: "cust-5",
    fullName: "Quantum Leap Labs",
    email: "billing@quantumleap.net",
    phone: "+44 20 7946 0192",
    address: "Science Park, Building C, Cambridge, UK",
    notes: "Long lead-time pipeline. High-volume purchases.",
    createdAt: "2026-05-22T10:05:00Z"
  }
];

const initialSales: Sale[] = [
  {
    id: "sale-1",
    invoiceNumber: "INV-2026-001",
    customerId: "cust-1",
    customerName: "Apex Global Solutions",
    product: "Enterprise SaaS CRM Platform",
    quantity: 1,
    price: 12500,
    totalAmount: 12500,
    date: "2026-05-12",
    status: "Completed"
  },
  {
    id: "sale-2",
    invoiceNumber: "INV-2026-002",
    customerId: "cust-3",
    customerName: "Sarah Jenkins & Partners",
    product: "Cloud Storage Upgrade (10TB)",
    quantity: 5,
    price: 120,
    totalAmount: 600,
    date: "2026-05-28",
    status: "Completed"
  },
  {
    id: "sale-3",
    invoiceNumber: "INV-2026-003",
    customerId: "cust-2",
    customerName: "Khalid Mansoor Al-Farsi",
    product: "DevOps Consulting Retainer (Hours)",
    quantity: 40,
    price: 150,
    totalAmount: 6000,
    date: "2026-06-02",
    status: "Pending"
  },
  {
    id: "sale-4",
    invoiceNumber: "INV-2026-004",
    customerId: "cust-5",
    customerName: "Quantum Leap Labs",
    product: "Hardware Server Clusters v4",
    quantity: 2,
    price: 4500,
    totalAmount: 9000,
    date: "2026-06-10",
    status: "Cancelled"
  },
  {
    id: "sale-5",
    invoiceNumber: "INV-2026-005",
    customerId: "cust-4",
    customerName: "Fatima Al-Suwaidi Consultants",
    product: "Brand Identity Design Workshop",
    quantity: 1,
    price: 3800,
    totalAmount: 3800,
    date: "2026-06-14",
    status: "Completed"
  },
  {
    id: "sale-6",
    invoiceNumber: "INV-2026-006",
    customerId: "cust-1",
    customerName: "Apex Global Solutions",
    product: "API Integration Services",
    quantity: 15,
    price: 180,
    totalAmount: 2700,
    date: "2026-06-15",
    status: "Pending"
  }
];

const initialBills: Bill[] = [
  {
    id: "bill-1",
    billNumber: "BIL-2026-809",
    customerId: "cust-1",
    customerName: "Apex Global Solutions",
    amount: 1450,
    dueDate: "2026-07-01",
    status: "Unpaid",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "bill-2",
    billNumber: "BIL-2026-810",
    customerId: "cust-3",
    customerName: "Sarah Jenkins & Partners",
    amount: 450,
    dueDate: "2026-06-12",
    status: "Paid",
    paymentMethod: "Credit Card"
  },
  {
    id: "bill-3",
    billNumber: "BIL-2026-811",
    customerId: "cust-2",
    customerName: "Khalid Mansoor Al-Farsi",
    amount: 2200,
    dueDate: "2026-06-30",
    status: "Paid",
    paymentMethod: "Bank Wire"
  },
  {
    id: "bill-4",
    billNumber: "BIL-2026-812",
    customerId: "cust-4",
    customerName: "Fatima Al-Suwaidi Consultants",
    amount: 3200,
    dueDate: "2026-06-10",
    status: "Overdue",
    paymentMethod: "Bank Transfer"
  },
  {
    id: "bill-5",
    billNumber: "BIL-2026-813",
    customerId: "cust-5",
    customerName: "Quantum Leap Labs",
    amount: 850,
    dueDate: "2026-07-15",
    status: "Unpaid",
    paymentMethod: "PayPal"
  }
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Load initial settings
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('erp_language');
    return (saved as Language) || 'en';
  });

  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('erp_theme');
    return (saved as Theme) || 'light';
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('erp_user');
    return saved ? JSON.parse(saved) : null;
  });

  const location = useLocation();
  const navigate = useNavigate();

  // Derived route & activeId from React Router's location
  const parts = location.pathname.split('/');
  const routeParam = parts[1] || '';
  const currentRoute = routeParam === '' ? (currentUser ? 'dashboard' : 'login') : routeParam;
  const activeId = parts[2] || null;

  // Sync auth-guarded routing redirect
  useEffect(() => {
    const isProtected = ['dashboard', 'customers', 'sales', 'bills', 'customer-details', 'sale-details', 'bill-details', 'profile', 'settings'].includes(currentRoute);
    if (isProtected && !currentUser) {
      navigate('/login');
    } else if (!isProtected && currentUser && (currentRoute === 'login' || currentRoute === 'signup')) {
      navigate('/dashboard');
    }
  }, [currentRoute, currentUser, navigate]);

  // Entities state loaded from localstorage or defaulted
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('erp_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('erp_sales');
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [bills, setBills] = useState<Bill[]>(() => {
    const saved = localStorage.getItem('erp_bills');
    return saved ? JSON.parse(saved) : initialBills;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  const [notifications, setNotifications] = useState([
    { id: "nt-1", titleEn: "New sale issued for Fatima Al-Suwaidi Consultants", titleAr: "تم إصدار فاتورة مبيعات جديدة لـ Fatima Al-Suwaidi Consultants", time: "10m ago", read: false },
    { id: "nt-2", titleEn: "Bill BIL-2026-812 is past due (Overdue alert)", titleAr: "الفاتورة BIL-2026-812 تجاوزت تاريخ السداد (تنبيه متأخرة)", time: "2h ago", read: false },
    { id: "nt-3", titleEn: "System maintenance scheduled tonight at 23:00 UTC", titleAr: "جدولة صيانة النظام الليلة الساعة 23:00 بالتوقيت العالمي", time: "1d ago", read: true }
  ]);

  // Persists states when modified
  useEffect(() => {
    localStorage.setItem('erp_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('erp_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('erp_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    // Sync attributes with DOM for standard styling & rtl behavior
    const root = window.document.documentElement;
    root.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    root.setAttribute('lang', language);
  }, [language]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('erp_theme', theme);
  }, [theme]);

  // Actions
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('erp_language', lang);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const login = (email: string, name = "System Admin", rememberMe = true) => {
    const userObj: User = {
      id: "usr-admin",
      name: name,
      email: email,
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    };
    setCurrentUser(userObj);
    if (rememberMe) {
      localStorage.setItem('erp_user', JSON.stringify(userObj));
    }
    navigate('/dashboard');
    return true;
  };

  const signup = (name: string, email: string) => {
    return login(email, name, true);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('erp_user');
    navigate('/login');
  };

  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration: 4000 }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateTo = (route: string, id: string | null = null) => {
    const isProtected = ['dashboard', 'customers', 'sales', 'bills', 'customer-details', 'sale-details', 'bill-details', 'profile', 'settings'].includes(route);
    if (isProtected && !currentUser) {
      navigate('/login');
    } else {
      if (id) {
        navigate(`/${route}/${id}`);
      } else {
        navigate(`/${route}`);
      }
    }
    // Auto-scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Customers actions
  const addCustomer = (custData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCust: Customer = {
      ...custData,
      id: 'cust-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setCustomers(prev => [newCust, ...prev]);
  };

  const editCustomer = (id: string, updated: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
    // Update linked customer name in sales and bills
    if (updated.fullName) {
      setSales(prev => prev.map(s => s.customerId === id ? { ...s, customerName: updated.fullName! } : s));
      setBills(prev => prev.map(b => b.customerId === id ? { ...b, customerName: updated.fullName! } : b));
    }
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  // Sales actions
  const addSale = (saleData: Omit<Sale, 'id' | 'totalAmount' | 'date'>) => {
    const totalAmount = saleData.quantity * saleData.price;
    const newSale: Sale = {
      ...saleData,
      id: 'sale-' + Date.now(),
      totalAmount,
      date: new Date().toISOString().split('T')[0],
    };
    setSales(prev => [newSale, ...prev]);
  };

  const editSale = (id: string, updated: Partial<Sale>) => {
    setSales(prev => prev.map(s => {
      if (s.id === id) {
        const merged = { ...s, ...updated };
        const quantity = updated.quantity !== undefined ? updated.quantity : s.quantity;
        const price = updated.price !== undefined ? updated.price : s.price;
        merged.totalAmount = quantity * price;
        return merged;
      }
      return s;
    }));
  };

  const deleteSale = (id: string) => {
    setSales(prev => prev.filter(s => s.id !== id));
  };

  // Bills actions
  const addBill = (billData: Omit<Bill, 'id'>) => {
    const newBill: Bill = {
      ...billData,
      id: 'bill-' + Date.now()
    };
    setBills(prev => [newBill, ...prev]);
  };

  const editBill = (id: string, updated: Partial<Bill>) => {
    setBills(prev => prev.map(b => b.id === id ? { ...b, ...updated } : b));
  };

  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(b => b.id !== id));
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const updateProfile = (updated: { name: string; email: string; avatarUrl: string }) => {
    if (currentUser) {
      const newUser = { ...currentUser, ...updated };
      setCurrentUser(newUser);
      localStorage.setItem('erp_user', JSON.stringify(newUser));
    }
  };

  const resetData = () => {
    localStorage.removeItem('erp_customers');
    localStorage.removeItem('erp_sales');
    localStorage.removeItem('erp_bills');
    setCustomers(initialCustomers);
    setSales(initialSales);
    setBills(initialBills);
  };

  return (
    <AppContext.Provider value={{
      theme,
      language,
      currentUser,
      customers,
      sales,
      bills,
      toasts,
      currentRoute,
      activeId,
      notifications,
      setLanguage,
      toggleTheme,
      login,
      signup,
      logout,
      addCustomer,
      editCustomer,
      deleteCustomer,
      addSale,
      editSale,
      deleteSale,
      addBill,
      editBill,
      deleteBill,
      navigateTo,
      addToast,
      removeToast,
      markNotificationsRead,
      updateProfile,
      resetData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
