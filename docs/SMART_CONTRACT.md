# Microlending Smart Contract Documentation

## Overview

This sophisticated Stacks blockchain smart contract implements an advanced microlending platform with robust security features and comprehensive loan management capabilities. The contract provides a secure, transparent, and efficient mechanism for creating, managing, and liquidating collateralized loans.

## Key Features

- **Enhanced Security**: Multiple security checks and validation mechanisms
- **Collateral Management**: Robust collateral tracking and validation
- **Dynamic Price Feeds**: Simulated price feed mechanism for collateral valuation
- **User Reputation System**: Track and manage borrower reputation based on loan performance
- **Emergency Stop Functionality**: Contract can be halted in critical situations
- **Comprehensive Error Handling**: Extensive error codes for precise issue identification

## Core Functionalities

1. Loan Creation
2. Collateral Asset Management
3. Price Feed Updates
4. Loan Liquidation
5. User Reputation Tracking

## System Constraints

- **Minimum Collateral Ratio**: 200%
- **Maximum Interest Rate**: 50%
- **Loan Duration**: 1 day to 1 year
- **Liquidation Threshold**: 80% collateral value drop

## Technical Architecture

- Implemented in Clarity language for Stacks blockchain
- Uses advanced data maps for tracking loans, user reputation, and collateral assets
- Provides both state-changing and read-only functions

## Contract Structure

### Constants

```clarity
;; Error Codes
(define-constant ERR-NOT-AUTHORIZED (err u1000))
(define-constant ERR-INVALID-AMOUNT (err u1001))
...

;; Business Constants
(define-constant MIN-COLLATERAL-RATIO u200)
(define-constant MAX-INTEREST-RATE u5000)
(define-constant MIN-DURATION u1440)
(define-constant MAX-DURATION u525600)
```

### Data Maps

```clarity
(define-map Loans
    { loan-id: uint }
    {
        borrower: principal,
        amount: uint,
        collateral-amount: uint,
        ...
    }
)

(define-map UserLoans
    { user: principal }
    {
        active-loans: (list 20 uint),
        total-active-borrowed: uint
    }
)
```

## Core Functions

### Loan Creation

```clarity
(define-public (create-loan-request
    (amount uint)
    (collateral uint)
    (collateral-asset (string-ascii 20))
    (duration uint)
    (interest-rate uint)
)
```

Parameters:

- `amount`: Loan amount requested
- `collateral`: Amount of collateral provided
- `collateral-asset`: Type of collateral asset
- `duration`: Loan duration in blocks
- `interest-rate`: Annual interest rate (basis points)

### Loan Liquidation

```clarity
(define-public (liquidate-loan (loan-id uint))
```

Triggers:

- Loan duration expired
- Collateral value below threshold

### Platform Administration

```clarity
(define-public (toggle-emergency-stop)
(define-public (add-collateral-asset (asset (string-ascii 20)))
(define-public (update-asset-price (asset (string-ascii 20)) (price uint))
```

## Testing with Clarinet

### Test Setup

```typescript
import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v0.14.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

const CONTRACT_NAME = 'microlending';
```

### Test Cases

#### 1. Asset Management Tests

```typescript
Clarinet.test({
    name: "Ensure contract owner can add and remove collateral assets",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const asset = "STX";
        
        let block = chain.mineBlock([
            Tx.contractCall(
                CONTRACT_NAME,
                'add-collateral-asset',
                [types.ascii(asset)],
                deployer.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok true)');
        
        block = chain.mineBlock([
            Tx.contractCall(
                CONTRACT_NAME,
                'remove-collateral-asset',
                [types.ascii(asset)],
                deployer.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, '(ok true)');
    },
});
```

#### 2. Authorization Tests

```typescript
Clarinet.test({
    name: "Ensure non-owner cannot add collateral assets",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const user = accounts.get('wallet_1')!;
        const asset = "STX";
        
        let block = chain.mineBlock([
            Tx.contractCall(
                CONTRACT_NAME,
                'add-collateral-asset',
                [types.ascii(asset)],
                user.address
            )
        ]);
        
        assertEquals(block.receipts[0].result, `(err u1000)`); // ERR-NOT-AUTHORIZED
    },
});
```

#### 3. Loan Creation Tests

```typescript
Clarinet.test({
    name: "Ensure loan creation works with valid parameters",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const borrower = accounts.get('wallet_1')!;
        const asset = "STX";
        
        let block = chain.mineBlock([
            // Add collateral asset
            Tx.contractCall(
                CONTRACT_NAME,
                'add-collateral-asset',
                [types.ascii(asset)],
                deployer.address
            ),
            // Update price feed
            Tx.contractCall(
                CONTRACT_NAME,
                'update-asset-price',
                [types.ascii(asset), types.uint(1000000)],
                deployer.address
            ),
            // Create loan request
            Tx.contractCall(
                CONTRACT_NAME,
                'create-loan-request',
                [
                    types.uint(1000000), // amount
                    types.uint(2000000), // collateral (200%)
                    types.ascii(asset),
                    types.uint(1440), // duration (1 day)
                    types.uint(500) // 5% interest rate
                ],
                borrower.address
            )
        ]);
        
        assertEquals(block.receipts[2].result, '(ok u1)');
    },
});
```

#### 4. Liquidation Tests

```typescript
Clarinet.test({
    name: "Ensure liquidation works when conditions are met",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const borrower = accounts.get('wallet_1')!;
        const liquidator = accounts.get('wallet_2')!;
        const asset = "STX";
        
        // Setup and create loan
        let block = chain.mineBlock([
            // Setup steps...
        ]);
        
        // Simulate time passing and price drop
        chain.mineEmptyBlockUntil(chain.blockHeight + 1441);
        
        block = chain.mineBlock([
            Tx.contractCall(
                CONTRACT_NAME,
                'update-asset-price',
                [types.ascii(asset), types.uint(500000)], // 50% price drop
                deployer.address
            ),
            Tx.contractCall(
                CONTRACT_NAME,
                'liquidate-loan',
                [types.uint(1)],
                liquidator.address
            )
        ]);
        
        assertEquals(block.receipts[1].result, '(ok true)');
    },
});
```

### Running Tests

```bash
# Run all tests
clarinet test

# Run specific test file
clarinet test tests/microlending_test.ts
```

## Security Features

1. Emergency Stop Mechanism
2. Role-Based Access Control
3. Input Validation
4. Price Feed Protection
5. Collateral Ratio Requirements

## Integration Guide

### Connecting to the Contract

```typescript
import { Contract } from "@stacks/transactions";

const contract = new Contract(contractAddress, contractName);
```

### Creating a Loan Request

```typescript
const createLoan = async (params) => {
  const txOptions = {
    contractAddress,
    contractName,
    functionName: "create-loan-request",
    functionArgs: [
      uintCV(params.amount),
      uintCV(params.collateral),
      stringAsciiCV(params.asset),
      uintCV(params.duration),
      uintCV(params.interestRate),
    ],
    senderKey,
    network,
  };

  return await makeContractCall(txOptions);
};
```

## Prerequisites

- Stacks blockchain environment
- Clarinet testing framework
- Compatible wallet supporting Clarity smart contracts

## Deployment

1. Deploy to testnet:

```bash
clarinet deploy --testnet
```

2. Deploy to mainnet:

```bash
clarinet deploy --mainnet
```