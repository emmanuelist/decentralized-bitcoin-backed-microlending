import { StacksTestnet } from '@stacks/network';
import {
  AnchorMode,
  PostConditionMode,
  makeContractCall,
  broadcastTransaction,
} from '@stacks/transactions';
import { userSession } from './auth';

export const network = new StacksTestnet();
const contractAddress = 'STHB047A30W99178TR7KE0784C2GV2206H98PPY';
const contractName = 'microlending';

export async function createLoan(
  amount: number,
  collateralAmount: number,
  duration: number,
  interestRate: number
) {
  const functionArgs = [
    amount.toString(),
    collateralAmount.toString(),
    duration.toString(),
    interestRate.toString(),
  ];

  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'create-loan',
    functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    senderKey: userSession.loadUserData().appPrivateKey,
  };

  try {
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    return broadcastResponse;
  } catch (error) {
    console.error('Error creating loan:', error);
    throw error;
  }
}

export async function liquidateLoan(loanId: number) {
  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'liquidate',
    functionArgs: [loanId.toString()],
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    senderKey: userSession.loadUserData().appPrivateKey,
  };

  try {
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    return broadcastResponse;
  } catch (error) {
    console.error('Error liquidating loan:', error);
    throw error;
  }
}

export async function repayLoan(loanId: number, amount: number) {
  const txOptions = {
    contractAddress,
    contractName,
    functionName: 'repay',
    functionArgs: [loanId.toString(), amount.toString()],
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    senderKey: userSession.loadUserData().appPrivateKey,
  };

  try {
    const transaction = await makeContractCall(txOptions);
    const broadcastResponse = await broadcastTransaction(transaction, network);
    return broadcastResponse;
  } catch (error) {
    console.error('Error repaying loan:', error);
    throw error;
  }
}

export async function getLoanDetails(loanId: number) {
  // Implement read-only function call to get loan details
  // This will depend on your smart contract's specific getter functions
}

export async function getUserLoans(userAddress: string) {
  // Implement read-only function call to get user's loans
  // This will depend on your smart contract's specific getter functions
}