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

## Testing with Clarity Console

### Setting Up the Test Environment

1. Start the Clarity REPL:

```bash
clarinet console
```

2. The console will display available contracts and initialized balances:

```
clarity-repl v0.23.0
Connected to a transient in-memory database.
```

Contracts
+--------------------------------------------------------+-----------------------------------------------------+
| Contract identifier | Public functions |
+--------------------------------------------------------+-----------------------------------------------------+
| ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.microlending | (add-collateral-asset (asset (string-ascii 20))) |
| | (calculate-total-due (loan-id uint)) |
| | ... |
+--------------------------------------------------------+-----------------------------------------------------+

````
### Test Cases

#### 1. Testing Asset Management

```clarity
;; Add a collateral asset (as contract owner)
::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
(contract-call? .microlending add-collateral-asset "STX")
;; Expected: (ok true)

;; Update asset price
(contract-call? .microlending update-asset-price "STX" u2000000)
;; Expected: (ok true)

;; Verify asset price (read-only function)
(contract-call? .microlending get-asset-price "STX")
;; Expected: (ok u2000000)
````

#### 2. Testing Loan Creation

```clarity
;; Create a loan request (as a borrower)
::set_tx_sender ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5
(contract-call? .microlending create-loan-request
    u1000000    ;; amount
    u2000000    ;; collateral
    "STX"       ;; collateral-asset
    u1440       ;; duration (1 day)
    u500        ;; interest rate (5%)
)
;; Expected: (ok u1)

;; Verify loan details
(contract-call? .microlending get-loan u1)
;; Expected: Returns loan details map
```

#### 3. Testing Platform Controls

```clarity
;; Test emergency stop (as contract owner)
::set_tx_sender ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
(contract-call? .microlending toggle-emergency-stop)
;; Expected: (ok true)

;; Verify platform status
(contract-call? .microlending get-contract-status)
;; Expected: true (stopped)
```

#### 4. Testing Loan Liquidation

```clarity
;; Advance blockchain (simulate time passing)
::advance_chain_tip 2000

;; Attempt liquidation
::set_tx_sender ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG
(contract-call? .microlending liquidate-loan u1)
;; Expected: (ok true) if conditions met
```

### Common Testing Commands

```clarity
;; Switch between different test accounts
::set_tx_sender WALLET_ADDRESS

;; Advance blockchain by N blocks
::advance_chain_tip N

;; View current block height
block-height

;; Get help with console commands
::help

;; Clear console
::clear
```

### Testing Best Practices

1. **Systematic Testing**

- Test each function independently
- Test both success and failure cases
- Verify error conditions
- Test with boundary values

2. **State Management**

- Reset state between test cases
- Verify state changes after operations
- Test with different user contexts

3. **Error Handling**

- Verify all error conditions
- Test authorization checks
- Validate input boundaries

4. **Integration Testing**

- Test function interactions
- Verify complex workflows
- Test state transitions

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
