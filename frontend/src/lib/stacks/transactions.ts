import {
  AnchorMode,
  PostConditionMode,
  makeContractCall,
  broadcastTransaction,
} from '@stacks/transactions';
import { userSession } from '../auth';
import { network, contractAddress, contractName } from './config';
import { TransactionOptions } from './types';

export async function executeContractCall(options: TransactionOptions) {
  const txOptions = {
    contractAddress,
    contractName,
    functionName: options.functionName,
    functionArgs: options.functionArgs,
    network,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    senderKey: userSession.loadUserData().appPrivateKey,
  };

  try {
    const transaction = await makeContractCall(txOptions);
    return await broadcastTransaction(transaction, network);
  } catch (error) {
    console.error(`Error executing contract call ${options.functionName}:`, error);
    throw error;
  }
}