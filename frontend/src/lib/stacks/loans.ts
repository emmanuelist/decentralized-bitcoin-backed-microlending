import { executeContractCall } from './transactions';

export async function createLoan(
  amount: number,
  collateralAmount: number,
  duration: number,
  interestRate: number
) {
  return executeContractCall({
    functionName: 'create-loan',
    functionArgs: [
      amount.toString(),
      collateralAmount.toString(),
      duration.toString(),
      interestRate.toString(),
    ],
  });
}

export async function liquidateLoan(loanId: number) {
  return executeContractCall({
    functionName: 'liquidate',
    functionArgs: [loanId.toString()],
  });
}

export async function repayLoan(loanId: number, amount: number) {
  return executeContractCall({
    functionName: 'repay',
    functionArgs: [loanId.toString(), amount.toString()],
  });
}