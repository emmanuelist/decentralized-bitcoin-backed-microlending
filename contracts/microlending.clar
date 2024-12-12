
;; microlending
;; This smart contract implements an enhanced microlending platform with robust security features. 
;; It allows users to create and manage loans backed by collateral assets. The contract includes 
;; mechanisms for collateral management, price feed updates, loan creation, and liquidation. 
;; It also features an emergency stop function to halt operations in critical situations and 
;; maintains user reputation based on loan repayment history.

;; Error Codes
(define-constant ERR-NOT-AUTHORIZED (err u1000))
(define-constant ERR-INVALID-AMOUNT (err u1001))
(define-constant ERR-INSUFFICIENT-COLLATERAL (err u1002))
(define-constant ERR-LOAN-NOT-FOUND (err u1003))
(define-constant ERR-LOAN-ALREADY-ACTIVE (err u1004))
(define-constant ERR-LOAN-NOT-ACTIVE (err u1005))
(define-constant ERR-LOAN-NOT-DEFAULTED (err u1006))
(define-constant ERR-INVALID-LIQUIDATION (err u1007))
(define-constant ERR-INVALID-REPAYMENT (err u1008))
(define-constant ERR-INVALID-DURATION (err u1009))
(define-constant ERR-INVALID-INTEREST-RATE (err u1010))
(define-constant ERR-EMERGENCY-STOP (err u1011))
(define-constant ERR-PRICE-FEED-FAILURE (err u1012))
(define-constant ERR-INVALID-COLLATERAL-ASSET (err u1013))

;; Enhanced Business Constants
(define-constant CONTRACT-OWNER tx-sender)
(define-constant MIN-COLLATERAL-RATIO u200) ;; Increased from 150% to 200%
(define-constant MAX-INTEREST-RATE u5000) ;; 50%
(define-constant MIN-DURATION u1440) ;; Minimum 1 day
(define-constant MAX-DURATION u525600) ;; Maximum 1 year
(define-constant LIQUIDATION-THRESHOLD u80) ;; 80% collateral value drop
(define-constant MAX-PRICE-AGE u1440) ;; Maximum price age (1 day in blocks)

;; Emergency Stop Mechanism
(define-data-var emergency-stopped bool false)

;; Whitelist for Collateral Assets
(define-map AllowedCollateralAssets 
    { asset: (string-ascii 20) } 
    { is-active: bool }
)

;; Price Feed Simulation (would be replaced by actual oracle in production)
(define-map AssetPrices 
    { asset: (string-ascii 20) } 
    { 
        price: uint, 
        last-updated: uint 
    }
)

;; Enhanced Data Maps
(define-map Loans
    { loan-id: uint }
    {
        borrower: principal,
        amount: uint,
        collateral-amount: uint,
        collateral-asset: (string-ascii 20),
        interest-rate: uint,
        start-height: uint,
        duration: uint,
        status: (string-ascii 20),
        lenders: (list 20 principal),
        repaid-amount: uint,
        liquidation-price-threshold: uint
    }
)

(define-map UserLoans
    { user: principal }
    { 
        active-loans: (list 20 uint),
        total-active-borrowed: uint 
    }
)

(define-map UserReputation
    { user: principal }
    {
        successful-repayments: uint,
        defaults: uint,
        total-borrowed: uint,
        reputation-score: uint
    }
)

(define-data-var next-loan-id uint u1)
(define-data-var max-loan-id uint u0)

;; Private Utility Functions
(define-private (is-contract-active)
    (and 
        (not (var-get emergency-stopped))
        (is-eq contract-caller CONTRACT-OWNER)
    )
)

(define-private (is-valid-collateral-asset (asset (string-ascii 20)))
    (match (map-get? AllowedCollateralAssets { asset: asset })
        allowed-asset (get is-active allowed-asset)
        false
    )
)

(define-private (calculate-collateral-ratio (loan-amount uint) (collateral-amount uint))
    (/ (* collateral-amount u100) loan-amount)
)

(define-private (is-sufficient-collateral (loan-amount uint) (collateral-amount uint))
    (>= (calculate-collateral-ratio loan-amount collateral-amount) MIN-COLLATERAL-RATIO)
)