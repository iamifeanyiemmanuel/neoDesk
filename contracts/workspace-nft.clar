;; NeoDesk Workspace NFT Contract
;; A tokenized contract for creating, managing, and upgrading virtual office spaces in the metaverse.

;; ----------------------------
;; DATA DEFINITIONS & CONSTANTS
;; ----------------------------

(define-data-var admin principal tx-sender)
(define-data-var base-uri (string-ascii 200) "https://neodesk.io/workspaces/")

(define-constant ERR-NOT-AUTHORIZED u100)
(define-constant ERR-NOT-OWNER u101)
(define-constant ERR-WORKSPACE-NOT-FOUND u102)
(define-constant ERR-ALREADY-RENTED u103)
(define-constant ERR-NOT-RENTED u104)
(define-constant ERR-INVALID-UPGRADE u105)

;; Workspace data
(define-map workspaces uint
  {
    owner: principal,
    uri: (string-ascii 200),
    size: (string-ascii 50),
    rent-price: uint,
    is-rented: bool,
    renter: (optional principal),
    royalty-percentage: uint
  }
)

;; Track workspace IDs
(define-data-var last-workspace-id uint u0)

;; ----------------------------
;; READ-ONLY HELPERS
;; ----------------------------

(define-read-only (is-admin)
  (is-eq tx-sender (var-get admin))
)

(define-read-only (get-workspace (id uint))
  (match (map-get? workspaces id)
    ws ws
    (err ERR-WORKSPACE-NOT-FOUND)
  )
)

(define-read-only (get-owner (id uint))
  (ok (get owner (unwrap! (map-get? workspaces id) (err ERR-WORKSPACE-NOT-FOUND))))
)

(define-read-only (is-owner (id uint))
  (let ((owner (unwrap! (map-get? workspaces id) (err ERR-WORKSPACE-NOT-FOUND))))
    (is-eq (get owner owner) tx-sender)
  )
)

(define-read-only (get-renter (id uint))
  (ok (get renter (unwrap! (map-get? workspaces id) (err ERR-WORKSPACE-NOT-FOUND))))
)

;; ----------------------------
;; PUBLIC FUNCTIONS
;; ----------------------------

;; Mint a new workspace NFT
(define-public (mint (recipient principal) (size (string-ascii 50)) (rent-price uint) (royalty uint))
  (begin
    (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
    (var-set last-workspace-id (+ u1 (var-get last-workspace-id)))
    (let ((id (var-get last-workspace-id)))
      (map-set workspaces id
        {
          owner: recipient,
          uri: (concat (var-get base-uri) (to-utf8 id)),
          size: size,
          rent-price: rent-price,
          is-rented: false,
          renter: none,
          royalty-percentage: royalty
        }
      )
      (ok id)
    )
  )
)

;; Rent a workspace
(define-public (rent (id uint))
  (let ((ws (unwrap! (map-get? workspaces id) (err ERR-WORKSPACE-NOT-FOUND))))
    (asserts! (not (get is-rented ws)) (err ERR-ALREADY-RENTED))
    (map-set workspaces id (merge ws { is-rented: true, renter: (some tx-sender) }))
    (ok true)
  )
)

;; End rental
(define-public (end-rental (id uint))
  (let ((ws (unwrap! (map-get? workspaces id) (err ERR-WORKSPACE-NOT-FOUND))))
    (asserts! (is-some (get renter ws)) (err ERR-NOT-RENTED))
    (asserts! (is-eq (unwrap! (get renter ws) (err ERR-NOT-RENTED)) tx-sender) (err ERR-NOT-AUTHORIZED))
    (map-set workspaces id (merge ws { is-rented: false, renter: none }))
    (ok true)
  )
)

;; Upgrade workspace size (only owner)
(define-public (upgrade-size (id uint) (new-size (string-ascii 50)))
  (asserts! (is-owner id) (err ERR-NOT-OWNER))
  (let ((ws (unwrap! (map-get? workspaces id) (err ERR-WORKSPACE-NOT-FOUND))))
    (asserts! (not (is-eq (get size ws) new-size)) (err ERR-INVALID-UPGRADE))
    (map-set workspaces id (merge ws { size: new-size }))
    (ok true)
  )
)

;; Transfer workspace ownership
(define-public (transfer (id uint) (new-owner principal))
  (asserts! (is-owner id) (err ERR-NOT-OWNER))
  (let ((ws (unwrap! (map-get? workspaces id) (err ERR-WORKSPACE-NOT-FOUND))))
    (map-set workspaces id (merge ws { owner: new-owner }))
    (ok true)
  )
)

;; Admin transfer
(define-public (transfer-admin (new-admin principal))
  (asserts! (is-admin) (err ERR-NOT-AUTHORIZED))
  (var-set admin new-admin)
  (ok true)
)
