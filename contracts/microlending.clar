
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

(define-private (calculate-liquidation-threshold (current-price uint))
    (/ (* current-price LIQUIDATION-THRESHOLD) u100)
)

(define-private (get-current-asset-price (asset (string-ascii 20)))
    (match (map-get? AssetPrices { asset: asset })
        price-info 
        (if (and 
                (> (get price price-info) u0)
                (< (- block-height (get last-updated price-info)) MAX-PRICE-AGE)
            )
            (ok (get price price-info))
            (err ERR-PRICE-FEED-FAILURE)
        )
        (err ERR-PRICE-FEED-FAILURE)
    )
)

(define-private (is-collateral-above-liquidation-threshold (loan-id uint))
    (match (map-get? Loans { loan-id: loan-id })
        loan 
        (match (get-current-asset-price (get collateral-asset loan))
            current-price-ok 
            (>= current-price-ok (get liquidation-price-threshold loan))
            err-code 
            false
        )
        false
    )
)

(define-private (update-user-reputation (user principal) (success bool))
    (let (
        (current-reputation (default-to
            { 
                successful-repayments: u0, 
                defaults: u0, 
                total-borrowed: u0,
                reputation-score: u100 ;; Start with neutral 100
            }
            (map-get? UserReputation { user: user })
        ))
        (reputation-change (if success u10 (- u0 u20))) ;; Use subtraction from 0 to create a negative effect
        (new-reputation-score 
            (if (< (+ (get reputation-score current-reputation) reputation-change) u0)
                u0
                (if (> (+ (get reputation-score current-reputation) reputation-change) u200)
                    u200
                    (+ (get reputation-score current-reputation) reputation-change)
                )
            )
        )
    )
    (map-set UserReputation
        { user: user }
        {
            successful-repayments: (if success 
                (+ (get successful-repayments current-reputation) u1)
                (get successful-repayments current-reputation)
            ),
            defaults: (if success 
                (get defaults current-reputation)
                (+ (get defaults current-reputation) u1)
            ),
            total-borrowed: (get total-borrowed current-reputation),
            reputation-score: new-reputation-score
        }
    ))
)

;; Emergency Stop Functions
(define-public (toggle-emergency-stop)
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (var-set emergency-stopped (not (var-get emergency-stopped)))
        (ok true)
    )
)

;; Collateral Asset Management
(define-public (add-collateral-asset (asset (string-ascii 20)))
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (asserts! (> (len asset) u0) ERR-INVALID-AMOUNT)
        (map-set AllowedCollateralAssets 
            { asset: asset } 
            { is-active: true }
        )
        (ok true)
    )
)

(define-public (remove-collateral-asset (asset (string-ascii 20)))
    (begin
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (asserts! (> (len asset) u0) ERR-INVALID-AMOUNT)
        (map-set AllowedCollateralAssets 
            { asset: asset } 
            { is-active: false }
        )
        (ok true)
    )
)

;; Price Feed Management (Simulated)
(define-public (update-asset-price (asset (string-ascii 20)) (price uint))
    (begin
        (asserts! (> (len asset) u0) ERR-INVALID-AMOUNT)
        (asserts! (> price u0) ERR-INVALID-AMOUNT)
        (asserts! (is-valid-collateral-asset asset) ERR-INVALID-COLLATERAL-ASSET)
        (asserts! (is-eq tx-sender CONTRACT-OWNER) ERR-NOT-AUTHORIZED)
        (map-set AssetPrices 
            { asset: asset }
            { 
                price: price, 
                last-updated: block-height 
            }
        )
        (ok true)
    )
)

;; Enhanced Loan Creation
(define-public (create-loan-request 
    (amount uint) 
    (collateral uint) 
    (collateral-asset (string-ascii 20)) 
    (duration uint) 
    (interest-rate uint)
)
    (let
        (
            (loan-id (var-get next-loan-id))
            (tx-sender tx-sender)
            (current-asset-price (unwrap! 
                (get-current-asset-price collateral-asset) 
                ERR-PRICE-FEED-FAILURE
            ))
        )
        ;; Comprehensive Validation
        (asserts! (is-contract-active) ERR-EMERGENCY-STOP)
        (asserts! (> amount u0) ERR-INVALID-AMOUNT)
        (asserts! (> collateral u0) ERR-INSUFFICIENT-COLLATERAL)
        (asserts! (is-sufficient-collateral amount collateral) ERR-INSUFFICIENT-COLLATERAL)
        (asserts! (is-valid-collateral-asset collateral-asset) ERR-INVALID-COLLATERAL-ASSET)
        
        ;; Enhanced Validation Checks
        (asserts! 
            (and 
                (>= duration MIN-DURATION) 
                (<= duration MAX-DURATION)
            ) 
            ERR-INVALID-DURATION
        )
        (asserts! 
            (<= interest-rate MAX-INTEREST-RATE) 
            ERR-INVALID-INTEREST-RATE
        )
        
        ;; Loan Creation with Enhanced Tracking
        (map-set Loans
            { loan-id: loan-id }
            {
                borrower: tx-sender,
                amount: amount,
                collateral-amount: collateral,
                collateral-asset: collateral-asset,
                interest-rate: interest-rate,
                start-height: block-height,
                duration: duration,
                status: "PENDING",
                lenders: (list),
                repaid-amount: u0,
                liquidation-price-threshold: (calculate-liquidation-threshold current-asset-price)
            }
        )
        
        ;; Update User Loans with Total Borrowed Tracking
        (let ((user-loans (default-to 
                { active-loans: (list), total-active-borrowed: u0 }
                (map-get? UserLoans { user: tx-sender }))))
            (map-set UserLoans
                { user: tx-sender }
                { 
                    active-loans: (unwrap-panic (as-max-len? 
                        (append (get active-loans user-loans) loan-id) u20)),
                    total-active-borrowed: (+ 
                        (get total-active-borrowed user-loans) 
                        amount
                    )
                }
            )
        )
        
        ;; Increment and Update Loan Tracking
        (var-set next-loan-id (+ loan-id u1))
        (var-set max-loan-id loan-id)
        
        (ok loan-id)
    )
)

;; Enhanced Liquidation Mechanism
(define-public (liquidate-loan (loan-id uint))
    (begin
        ;; Validate loan-id
        (asserts! (> loan-id u0) ERR-LOAN-NOT-FOUND)
        
        (let (
            (loan (unwrap! (map-get? Loans { loan-id: loan-id }) ERR-LOAN-NOT-FOUND))
        )
            ;; Comprehensive Liquidation Checks
            (asserts! (is-contract-active) ERR-EMERGENCY-STOP)
            (asserts! (is-eq (get status loan) "ACTIVE") ERR-LOAN-NOT-ACTIVE)
            
            ;; Dual Liquidation Triggers: Time AND Collateral Value
            (asserts! 
                (or 
                    (> block-height (+ (get start-height loan) (get duration loan)))
                    (not (is-collateral-above-liquidation-threshold loan-id))
                ) 
                ERR-LOAN-NOT-DEFAULTED
            )
            
            ;; Update Loan Status and Reputation
            (map-set Loans
                { loan-id: loan-id }
                (merge loan { status: "LIQUIDATED" })
            )
            
            ;; Update Borrower Reputation with Severe Penalty
            (update-user-reputation (get borrower loan) false)
            
            (ok true)
        )
    )
)