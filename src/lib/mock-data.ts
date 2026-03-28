export interface Transaction {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  category: string;
  vendor: string;
  amount: number;
  currency: string;
  date: string;
  status: 'approved' | 'pending' | 'flagged';
  zaggleCardId: string;
  mcc_code: string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-1001', employeeId: 'E001', employeeName: 'Aditya Sharma', department: 'Engineering', category: 'SaaS', vendor: 'AWS', amount: 85000, currency: 'INR', date: '2023-11-15T10:00:00Z', status: 'approved', zaggleCardId: 'ZAG-9921', mcc_code: '4816' },
  { id: 'TX-1002', employeeId: 'E002', employeeName: 'Priya Verma', department: 'Marketing', category: 'Advertising', vendor: 'Google Ads', amount: 120000, currency: 'INR', date: '2023-11-16T14:30:00Z', status: 'approved', zaggleCardId: 'ZAG-8812', mcc_code: '7311' },
  { id: 'TX-1003', employeeId: 'E003', employeeName: 'Rahul Gupta', department: 'Sales', category: 'Travel', vendor: 'IndiGo', amount: 12500, currency: 'INR', date: '2023-11-17T09:15:00Z', status: 'pending', zaggleCardId: 'ZAG-7734', mcc_code: '4511' },
  { id: 'TX-1004', employeeId: 'E001', employeeName: 'Aditya Sharma', department: 'Engineering', category: 'Meals', vendor: 'Taj Mahal Hotel', amount: 2500, currency: 'INR', date: '2023-11-17T20:45:00Z', status: 'flagged', zaggleCardId: 'ZAG-9921', mcc_code: '5812' },
  { id: 'TX-1005', employeeId: 'E004', employeeName: 'Sneha Rao', department: 'HR', category: 'Office Supplies', vendor: 'Amazon Business', amount: 5000, currency: 'INR', date: '2023-11-18T11:00:00Z', status: 'approved', zaggleCardId: 'ZAG-6645', mcc_code: '5111' },
  { id: 'TX-1006', employeeId: 'E005', employeeName: 'Vikram Singh', department: 'Operations', category: 'Logistics', vendor: 'Blue Dart', amount: 45000, currency: 'INR', date: '2023-11-19T16:20:00Z', status: 'approved', zaggleCardId: 'ZAG-5512', mcc_code: '4215' },
  { id: 'TX-1007', employeeId: 'E003', employeeName: 'Rahul Gupta', department: 'Sales', category: 'Meals', vendor: 'Starbucks', amount: 800, currency: 'INR', date: '2023-11-19T08:30:00Z', status: 'approved', zaggleCardId: 'ZAG-7734', mcc_code: '5814' },
  { id: 'TX-1008', employeeId: 'E002', employeeName: 'Priya Verma', department: 'Marketing', category: 'SaaS', vendor: 'HubSpot', amount: 95000, currency: 'INR', date: '2023-11-20T10:00:00Z', status: 'approved', zaggleCardId: 'ZAG-8812', mcc_code: '4816' },
  { id: 'TX-1009', employeeId: 'E001', employeeName: 'Aditya Sharma', department: 'Engineering', category: 'SaaS', vendor: 'GitHub', amount: 50000, currency: 'INR', date: '2023-11-20T11:00:00Z', status: 'approved', zaggleCardId: 'ZAG-9921', mcc_code: '4816' },
  { id: 'TX-1010', employeeId: 'E006', employeeName: 'Deepak Kumar', department: 'Legal', category: 'Consulting', vendor: 'Shardul Amarchand', amount: 250000, currency: 'INR', date: '2023-11-21T15:00:00Z', status: 'approved', zaggleCardId: 'ZAG-4412', mcc_code: '8111' },
];

export const KPI_DATA = {
  totalMonthlySpend: 2500000,
  cashPosition: 15000000,
  budgetUtilizationPercentage: 92,
  openComplianceFlags: 7,
  forecastAccuracyPercentage: 91,
  daysSalesOutstanding: 45,
};

export const DEPARTMENT_SPEND = [
  { name: 'Engineering', value: 800000, budget: 900000 },
  { name: 'Marketing', value: 650000, budget: 600000 },
  { name: 'Sales', value: 500000, budget: 550000 },
  { name: 'HR', value: 200000, budget: 250000 },
  { name: 'Operations', value: 300000, budget: 280000 },
  { name: 'Legal', value: 250000, budget: 300000 },
];

export const CATEGORY_SPEND = [
  { name: 'SaaS', value: 1200000 },
  { name: 'Travel', value: 400000 },
  { name: 'Meals', value: 150000 },
  { name: 'Office', value: 250000 },
  { name: 'Marketing', value: 500000 },
];

export const AGENT_REGISTRY = [
  { id: 'spend-sentinel', name: 'SpendSentinel', role: 'Real-time spend monitoring & anomaly detection', status: 'running', lastAction: 'Flagged suspicious AWS overage' },
  { id: 'forecast-oracle', name: 'ForecastOracle', role: 'Predictive cash flow & revenue forecasting', status: 'scheduled', lastAction: 'Updated Q4 projections' },
  { id: 'compliance-guard', name: 'ComplianceGuard', role: 'Policy enforcement & audit automation', status: 'running', lastAction: 'Verified 250 new transactions' },
  { id: 'narrator-ai', name: 'NarratorAI', role: 'Generates FP&A narratives & variance explanations', status: 'idle', lastAction: 'Generated Marketing variance report' },
  { id: 'reconcile-bot', name: 'ReconcileBot', role: 'Auto-reconciliation & close acceleration', status: 'scheduled', lastAction: 'Monthly close completed (98% auto)' },
  { id: 'treasury-pilot', name: 'TreasuryPilot', role: 'Cash optimization & liquidity management', status: 'running', lastAction: 'Optimized payment schedule' },
];