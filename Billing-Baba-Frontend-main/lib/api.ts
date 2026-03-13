const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = (isFormData = false) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : null;

    const headers: any = {
        ...(token && { 'x-auth-token': token }),
        ...(companyId && { 'x-company-id': companyId }) // Assuming backend might use this header, or we inject into body
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

// Helper to inject companyId into body/query if needed
const getBody = (data: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : null;
    return JSON.stringify({ ...data, ...(companyId && { companyId }) });
}

export const fetchParties = async (search?: string) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/parties?companyId=${companyId}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch parties');
    return response.json();
};

export const createParty = async (data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/parties`, {
        method: 'POST',
        headers: getHeaders(isFormData),
        body: isFormData ? data : getBody(data),
    });
    if (!response.ok) throw new Error('Failed to create party');
    return response.json();
};

export const updateParty = async (id: string, data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/parties/${id}`, {
        method: 'PUT',
        headers: getHeaders(isFormData),
        body: isFormData ? data : JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update party');
    return response.json();
};

export const fetchItems = async (filters?: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/items?companyId=${companyId}`;
    if (filters) {
        if (filters.id) url += `&id=${filters.id}`;
        if (filters.type) url += `&type=${filters.type}`;
        if (filters.productId) url += `&productId=${filters.productId}`;
    }
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch items');
    return response.json();
};

export const fetchItemById = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch item by id');
    return response.json();
};

export const createItem = async (data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: getHeaders(isFormData),
        body: isFormData ? data : getBody(data),
    });
    if (!response.ok) throw new Error('Failed to create item');
    return response.json();
};

export const updateItem = async (id: string, data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'PUT',
        headers: getHeaders(isFormData),
        body: isFormData ? data : JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update item');
    return response.json();
};

export const deleteItem = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete item');
    }
    return response.json();
};

export const fetchTransactionsByItem = async (itemId: string) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    const response = await fetch(`${API_BASE_URL}/items/${itemId}/transactions?companyId=${companyId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch item transactions');
    return response.json();
};

export const createSale = async (data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/sales`, {
        method: 'POST',
        headers: getHeaders(isFormData),
        body: isFormData ? data : getBody(data),
    });
    if (!response.ok) throw new Error('Failed to create sale');
    return response.json();
};

export const createSaleOrder = createSale;

export const updateSale = async (id: string, data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
        method: 'PUT',
        headers: getHeaders(isFormData),
        body: isFormData ? data : JSON.stringify(data),
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update sale: ${errorText}`);
    }
    return response.json();
};

// Helper to append filters
const appendFilters = (url: string, filters?: any) => {
    if (!filters) return url;
    let newUrl = url;
    if (filters.startDate) newUrl += `&startDate=${filters.startDate}`;
    if (filters.endDate) newUrl += `&endDate=${filters.endDate}`;
    if (filters.userId && filters.userId !== 'All Users') newUrl += `&userId=${filters.userId}`;
    if (filters.godown && filters.godown !== 'All Godown') newUrl += `&godown=${filters.godown}`;
    if (filters.status && filters.status !== 'All Status') newUrl += `&status=${filters.status}`;
    return newUrl;
};

export const fetchSaleOrders = async (filters?: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/sales?type=SO&companyId=${companyId}`;
    url = appendFilters(url, filters);

    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch sale orders');
    return response.json();
};

export const convertToInvoice = async (id: string, data?: any) => {
    const response = await fetch(`${API_BASE_URL}/sales/${id}/convert`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data || {}),
    });
    if (!response.ok) throw new Error('Failed to convert to invoice');
    return response.json();
};

export const fetchUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
};

export const addTeamMember = async (data: { name: string; contact: string; role: string }) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    const response = await fetch(`${API_BASE_URL}/users/team`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ ...data, companyId }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to add user');
    }
    return response.json();
};

export const fetchTeamMembers = async () => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    const response = await fetch(`${API_BASE_URL}/users/team?companyId=${companyId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch team members');
    return response.json();
};

export const removeTeamMember = async (memberId: string) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    const response = await fetch(`${API_BASE_URL}/users/team/${companyId}/${memberId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to remove team member');
    return response.json();
};

export const fetchSaleInvoices = async (filters?: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/sales?type=INVOICE&companyId=${companyId || ''}`;
    url = appendFilters(url, filters);

    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch sale invoices');
    return response.json();
};

export const fetchProformaInvoices = async (filters?: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/sales?type=PROFORMA&companyId=${companyId}`;
    url = appendFilters(url, filters);

    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch proforma invoices');
    return response.json();
};


export const fetchEstimates = async (filters?: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/sales?type=ESTIMATE&companyId=${companyId}`;
    url = appendFilters(url, filters);

    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch estimates');
    return response.json();
};

export const fetchCreditNotes = async (filters?: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/sales?type=CREDIT_NOTE&companyId=${companyId}`;
    url = appendFilters(url, filters);

    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch credit notes');
    return response.json();
};

export const cancelSale = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/sales/${id}/cancel`, {
        method: 'PUT',
        headers: getHeaders(),
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.message || body.error || 'Failed to cancel sale document');
    }
    return response.json();
};

// --- PURCHASE APIs ---

export const createPurchase = async (data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/purchases`, {
        method: 'POST',
        headers: getHeaders(isFormData),
        body: isFormData ? data : getBody(data),
    });
    if (!response.ok) throw new Error('Failed to create purchase');
    return response.json();
};

export const fetchPurchases = async (params?: string | any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/purchases?companyId=${companyId}`;

    if (typeof params === 'string') {
        if (params) url += `&type=${params}`;
    } else if (typeof params === 'object') {
        if (params.type) url += `&type=${params.type}`;
        if (params.partyId) url += `&partyId=${params.partyId}`;

        // Append Filters
        url = appendFilters(url, params);
    }

    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch purchases');
    return response.json();
};

export const fetchDebitNotes = async () => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    const response = await fetch(`${API_BASE_URL}/purchases?type=DEBIT_NOTE&companyId=${companyId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch debit notes');
    return response.json();
};

export const deleteSale = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/sales/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete sale');
    return response.json();
};

export const fetchSales = async (params?: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/sales?companyId=${companyId}`;
    if (params) {
        if (params.type) url += `&type=${params.type}`;
        if (params.documentType) url += `&type=${params.documentType}`;
        if (params.partyId) url += `&partyId=${params.partyId}`;

        // Append Filters
        url = appendFilters(url, params);
    }
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch sales');
    return response.json();
};

export const updatePurchase = async (id: string, data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/purchases/${id}`, {
        method: 'PUT',
        headers: getHeaders(isFormData),
        body: isFormData ? data : JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update purchase');
    return response.json();
};

export const deletePurchase = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/purchases/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete purchase');
    return response.json();
};

export const cancelPurchase = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/purchases/${id}/cancel`, {
        method: 'PUT',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to cancel purchase');
    return response.json();
};

export const fetchPurchaseById = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/purchases/${id}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch purchase');
    return response.json();
};

export const fetchCompanies = async () => {
    const response = await fetch(`${API_BASE_URL}/companies`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch companies');
    return response.json();
};

export const createCompany = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/companies`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create company');
    return response.json();
};

export const updateCompany = async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update company');
    return response.json();
};

// --- Bank Accounts ---
export const fetchBankAccounts = async (companyId: string) => {
    const response = await fetch(`${API_BASE_URL}/bank-accounts?companyId=${companyId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch bank accounts');
    return response.json();
};

export const createBankAccount = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/bank-accounts`, {
        method: 'POST', headers: getHeaders(), body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create bank account');
    return response.json();
};

export const fetchBankTransactions = async (accountId: string) => {
    const response = await fetch(`${API_BASE_URL}/bank-accounts/${accountId}/transactions`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
};

export const deleteBankAccount = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/bank-accounts/${id}`, { method: 'DELETE', headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to delete bank account');
    return response.json();
};

export const sendOtp = async (phoneNumber: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber }),
    });
    if (!response.ok) throw new Error('Failed to send OTP');
    return response.json();
};

export const verifyOtp = async (phoneNumber: string, otp: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, otp }),
    });
    if (!response.ok) throw new Error('Failed to verify OTP');
    return response.json();
};

// --- EXPENSE CATEGORY APIs ---

export const fetchExpenseCategories = async () => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    const response = await fetch(`${API_BASE_URL}/expense-categories?companyId=${companyId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch expense categories');
    return response.json();
};

export const createExpenseCategory = async (name: string, expenseType?: string) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    const response = await fetch(`${API_BASE_URL}/expense-categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, expenseType, companyId }),
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to create expense category');
    }
    return response.json();
};

export const fetchExpenseItems = async (search?: string) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/expense-items?companyId=${companyId}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch expense items');
    return response.json();
};

export const createExpenseItem = async (data: {
    name: string; hsnSac?: string; description?: string;
    price?: number; taxType?: string; taxRate?: number;
}) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    const response = await fetch(`${API_BASE_URL}/expense-items`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ ...data, companyId }),
    });
    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to create expense item');
    }
    return response.json();
};

export const deleteExpenseCategory = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/expense-categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete expense category');
    return response.json();
};

export const createPaymentIn = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/payment-in`, {
        method: 'POST',
        headers: getHeaders(),
        body: getBody(data),
    });
    if (!response.ok) throw new Error('Failed to create payment in');
    return response.json();
};

export const fetchPaymentIn = async (filters?: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/payment-in?companyId=${companyId || ''}`;

    if (filters) {
        if (filters.startDate) url += `&startDate=${filters.startDate}`;
        if (filters.endDate) url += `&endDate=${filters.endDate}`;
        if (filters.userId && filters.userId !== 'All Users') url += `&userId=${filters.userId}`; // Assuming PaymentIn has userId/createdBy
    }

    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch payment in');
    return response.json();
};

export const deletePaymentIn = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/payment-in/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete payment in');
    return response.json();
};

export const updatePaymentIn = async (id: string, data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/payment-in/${id}`, {
        method: 'PUT',
        headers: getHeaders(isFormData),
        body: isFormData ? data : getBody(data),
    });
    if (!response.ok) throw new Error('Failed to update payment in');
    return response.json();
};

export const createPaymentOut = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/payment-out`, {
        method: 'POST',
        headers: getHeaders(),
        body: getBody(data),
    });
    if (!response.ok) throw new Error('Failed to create payment out');
    return response.json();
};

export const fetchPaymentOut = async () => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    const response = await fetch(`${API_BASE_URL}/payment-out?companyId=${companyId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch payment out');
    return response.json();
};

export const deletePaymentOut = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/payment-out/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete payment out');
    return response.json();
};

export const updatePaymentOut = async (id: string, data: any) => {
    const isFormData = data instanceof FormData;
    const response = await fetch(`${API_BASE_URL}/payment-out/${id}`, {
        method: 'PUT',
        headers: getHeaders(isFormData),
        body: isFormData ? data : getBody(data),
    });
    if (!response.ok) throw new Error('Failed to update payment out');
    return response.json();
};

export const fetchCashTransactions = async (filters?: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/cash/transactions?companyId=${companyId || ''}`;

    if (filters) {
        if (filters.startDate) url += `&startDate=${filters.startDate}`;
        if (filters.endDate) url += `&endDate=${filters.endDate}`;
    }

    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch cash transactions');
    return response.json();
};


export const fetchProfitAndLoss = async (filters?: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/reports/profit-and-loss?companyId=${companyId}`;
    if (filters) {
        if (filters.startDate) url += `&startDate=${filters.startDate}`;
        if (filters.endDate) url += `&endDate=${filters.endDate}`;
    }
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch profit and loss');
    return response.json();
};

export const fetchSaleAgingReport = async (filters?: any) => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    let url = `${API_BASE_URL}/reports/sale-aging?companyId=${companyId}`;
    if (filters) {
        if (filters.startDate) url += `&startDate=${filters.startDate}`;
        if (filters.endDate) url += `&endDate=${filters.endDate}`;
        if (filters.partyGroup && filters.partyGroup !== 'ALL GROUPS') url += `&partyGroup=${encodeURIComponent(filters.partyGroup)}`;
    }
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch sale aging report');
    return response.json();
};

export const createCategory = async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: getHeaders(),
        body: getBody(data),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
};

export const fetchCategories = async () => {
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('activeCompanyId') : '';
    const response = await fetch(`${API_BASE_URL}/categories?companyId=${companyId}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
};

export const deleteCategory = async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return response.json();
};
