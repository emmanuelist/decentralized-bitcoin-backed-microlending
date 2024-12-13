import React from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { LoanForm } from './components/LoanForm';
import { LoanTable } from './components/LoanTable';
import { AdminPanel } from './components/AdminPanel';

// Mock data for demonstration
const mockReputation = {
  successfulRepayments: 5,
  defaults: 0,
  totalBorrowed: 10000,
  reputationScore: 95,
};

const mockLoans = {
  activeLoans: [1, 2, 3],
  totalActiveBorrowed: 5000,
};

const mockActiveLoans = [
  {
    loanId: 1,
    borrower: '0x1234...5678',
    amount: 1000,
    collateralAmount: 2000,
    collateralAsset: 'STX',
    interestRate: 5,
    startHeight: 12345,
    duration: 30,
    status: 'ACTIVE',
    lenders: [],
    repaidAmount: 0,
    liquidationPriceThreshold: 1600,
  },
  // Add more mock loans as needed
];

function App() {
  return (
    <Layout>
      <div className="space-y-8">
        <Dashboard reputation={mockReputation} loans={mockLoans} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LoanForm />
          <AdminPanel />
        </div>
        
        <LoanTable loans={mockActiveLoans} />
      </div>
    </Layout>
  );
}

export default App;