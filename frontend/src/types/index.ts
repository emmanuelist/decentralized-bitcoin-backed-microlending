export interface Loan {
  loanId: number;
  borrower: string;
  amount: number;
  collateralAmount: number;
  collateralAsset: string;
  interestRate: number;
  startHeight: number;
  duration: number;
  status: 'PENDING' | 'ACTIVE' | 'LIQUIDATED';
  lenders: string[];
  repaidAmount: number;
  liquidationPriceThreshold: number;
}

export interface UserReputation {
  successfulRepayments: number;
  defaults: number;
  totalBorrowed: number;
  reputationScore: number;
}

export interface UserLoans {
  activeLoans: number[];
  totalActiveBorrowed: number;
}

export interface CollateralAsset {
  asset: string;
  isActive: boolean;
}

export interface AssetPrice {
  price: number;
  lastUpdated: number;
}