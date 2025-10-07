# Backend: Point of Sale (POS) & Orders Module

**Priority:** P0 (Must Have - MVP)  
**Phase:** Phase 1 - MVP  
**Module:** Backend - POS & Orders

---

## Tasks

### Task 56: Create Order schema and model
**Status:** pending  
**Priority:** high  
**Dependencies:** [2, 27]

**Description:**
Design comprehensive Order schema for all transaction types with complex pricing.

**Details:**
- Create Order schema with fields:
  - tenantId, storeId, orderNumber (sequential per store)
  - type (dine_in, takeaway, delivery, online)
  - status (pending, preparing, ready, completed, cancelled)
  - customerId, customerName, customerPhone
  - items array (complex structure with variants/modifiers)
  - subtotal, discounts array, tax, tip, total
  - payments array (multiple payment methods)
  - paidAmount, changeAmount, paymentStatus
  - tableId, guestCount (for restaurants)
  - deliveryAddress, deliveryFee, estimatedReadyTime
  - notes, source (pos, online, mobile_app, kiosk)
  - createdBy, servedBy
  - voidedAt, voidedBy, voidReason
- Add indexes (tenantId + storeId + createdAt)
- Create unique order number per store
- Implement status workflow
- Add payment status tracking
- Create order calculations methods

**Test Strategy:**
- Test order creation with all fields
- Verify order number is sequential
- Test order calculations accuracy
- Validate status transitions
- Test payment tracking

---

### Task 57: Create OrderItem sub-schema
**Status:** pending  
**Priority:** high  
**Dependencies:** [56]

**Description:**
Design detailed order item structure with variants, modifiers, and pricing.

**Details:**
- Create OrderItem structure:
  - id, productId, name, sku
  - quantity, unitPrice
  - selectedVariants array (variantId, optionId, priceAdjustment)
  - selectedModifiers array (modifierId, optionId, price)
  - lineTotal, tax
  - status (pending, preparing, ready, served)
  - specialInstructions
  - refunded, refundedQuantity
- Implement price calculation
- Add tax calculation
- Create line total computation
- Implement kitchen status tracking
- Add refund logic

**Test Strategy:**
- Test item price calculation
- Verify variant/modifier prices add correctly
- Test tax calculation
- Validate line total matches expected
- Test partial refund logic

---

### Task 58: Create Payment sub-schema
**Status:** pending  
**Priority:** high  
**Dependencies:** [56]

**Description:**
Design payment structure supporting multiple payment methods and split payments.

**Details:**
- Create Payment structure:
  - id, method (cash, card, mobile_wallet, voucher, account)
  - amount
  - cardType, last4 (for cards)
  - transactionId, timestamp
  - processedBy
- Implement split payment support
- Add payment validation
- Create payment reconciliation
- Implement refund tracking
- Add payment gateway integration hooks

**Test Strategy:**
- Test single payment processing
- Verify split payments sum correctly
- Test payment validation
- Validate refund tracking
- Test payment methods

---

### Task 59: Implement Orders service layer
**Status:** pending  
**Priority:** high  
**Dependencies:** [56, 57, 58]

**Description:**
Create comprehensive order management service with business logic.

**Details:**
- Implement create order method
- Add update order method
- Create cancel order logic
- Implement complete order workflow
- Add refund order functionality
- Create partial refund logic
- Implement order search and filters
- Add order calculations (subtotal, tax, total)
- Create discount application
- Implement tip handling
- Add payment processing
- Create order status management
- Implement order validation
- Add concurrent order handling

**Test Strategy:**
- Unit test all methods
- Test order creation workflow
- Verify calculations are accurate
- Test refund logic
- Validate concurrent orders

---

### Task 60: Create CashDrawer schema and model
**Status:** pending  
**Priority:** high  
**Dependencies:** [2]

**Description:**
Implement cash drawer management for shift tracking and reconciliation.

**Details:**
- Create CashDrawer schema:
  - tenantId, storeId, registerId
  - status (open, closed)
  - openedAt, openedBy, openingBalance
  - openingCashBreakdown (denominations)
  - closedAt, closedBy, closingBalance
  - closingCashBreakdown
  - expectedCash, actualCash, variance
  - cashIn, cashOut
  - totalSales, cardSales, cashSales
  - notes
- Add indexes (tenantId + storeId + status)
- Create cash breakdown structure
- Implement variance calculation
- Add shift summary methods

**Test Strategy:**
- Test cash drawer open/close
- Verify variance calculation
- Test cash breakdown tracking
- Validate shift summary
- Test multiple registers

---

### Task 61: Implement Orders REST controller
**Status:** pending  
**Priority:** high  
**Dependencies:** [59]

**Description:**
Build comprehensive REST API for order management.

**Details:**
- Create GET /orders with filters
- Add POST /orders (create order)
- Create GET /orders/:id
- Add PUT /orders/:id (update order)
- Implement POST /orders/:id/complete
- Create POST /orders/:id/cancel
- Add POST /orders/:id/refund
- Create GET /orders/:id/receipt
- Implement POST /orders/:id/items (add items)
- Add DELETE /orders/:id/items/:itemId
- Create proper DTOs with validation
- Implement Swagger documentation
- Add response transformations

**Test Strategy:**
- E2E test order creation flow
- Test order status updates
- Verify refund endpoint works
- Test receipt generation
- Validate API documentation

---

### Task 62: Create shopping cart session management
**Status:** pending  
**Priority:** high  
**Dependencies:** [59]

**Description:**
Implement session-based shopping cart with Redis storage.

**Details:**
- Design cart data structure
- Create cart session management
- Implement add to cart
- Add update cart item
- Create remove from cart
- Implement apply discount
- Add calculate totals
- Create checkout process
- Implement cart expiration
- Add cart recovery
- Create cart merge for logged-in users

**Test Strategy:**
- Test cart operations
- Verify calculations correct
- Test cart persistence
- Validate expiration works
- Test cart merge

---

### Task 63: Create Cart REST endpoints
**Status:** pending  
**Priority:** high  
**Dependencies:** [62]

**Description:**
Build session-based cart API for POS interface.

**Details:**
- Create GET /cart (get current cart)
- Add POST /cart/items (add item)
- Create PUT /cart/items/:itemId (update)
- Add DELETE /cart/items/:itemId (remove)
- Implement POST /cart/apply-discount
- Create POST /cart/checkout
- Add DELETE /cart/clear
- Create cart validation
- Implement proper DTOs
- Add Swagger documentation

**Test Strategy:**
- Test cart CRUD operations
- Verify discount application
- Test checkout process
- Validate session management
- Test API documentation

---

### Task 64: Implement CashDrawer service layer
**Status:** pending  
**Priority:** high  
**Dependencies:** [60]

**Description:**
Create cash drawer management service for shift operations.

**Details:**
- Implement open drawer method
- Add close drawer method
- Create get current drawer
- Implement cash in/out methods
- Add drawer balance calculation
- Create variance reporting
- Implement shift summary
- Add drawer reconciliation
- Create drawer history
- Implement multi-register support

**Test Strategy:**
- Test drawer operations
- Verify balance calculations
- Test variance detection
- Validate shift summaries
- Test concurrent registers

---

### Task 65: Create CashDrawer REST controller
**Status:** pending  
**Priority:** high  
**Dependencies:** [64]

**Description:**
Build REST API for cash drawer management.

**Details:**
- Create POST /cash-drawer/open
- Add POST /cash-drawer/close
- Create GET /cash-drawer/current
- Add POST /cash-drawer/cash-in
- Create POST /cash-drawer/cash-out
- Implement GET /cash-drawer/history
- Add proper DTOs and validation
- Create Swagger documentation
- Implement permissions

**Test Strategy:**
- Test drawer open/close flow
- Verify cash in/out operations
- Test current drawer endpoint
- Validate permissions
- Test API documentation

---

### Task 66: Implement receipt generation system
**Status:** pending  
**Priority:** medium  
**Dependencies:** [59]

**Description:**
Create receipt generation with support for thermal and A4 formats.

**Details:**
- Design receipt template structure
- Implement thermal receipt (80mm, 58mm)
- Add A4 receipt format
- Create receipt customization
- Implement receipt numbering
- Add barcode/QR code generation
- Create receipt email functionality
- Implement receipt reprint
- Add receipt logo/branding
- Create receipt templates

**Test Strategy:**
- Test receipt generation
- Verify receipt formatting
- Test email delivery
- Validate QR codes
- Test template customization

---

### Task 67: Implement discount and promotion engine
**Status:** pending  
**Priority:** medium  
**Dependencies:** [59]

**Description:**
Create flexible discount system with various promotion types.

**Details:**
- Design discount types:
  - Percentage off
  - Fixed amount off
  - BOGO (Buy One Get One)
  - Bundle pricing
  - Volume discounts
  - Coupon codes
  - Loyalty points redemption
- Implement discount validation
- Create discount calculation
- Add multiple discount handling
- Implement discount limits
- Create promotion scheduling
- Add discount reporting

**Test Strategy:**
- Test each discount type
- Verify discount calculations
- Test coupon code validation
- Validate discount limits
- Test scheduled promotions

---

### Task 68: Implement order queue for kitchen display
**Status:** pending  
**Priority:** medium  
**Dependencies:** [59]

**Description:**
Create order queue system for kitchen display integration.

**Details:**
- Design queue data structure
- Implement order queuing
- Create queue prioritization
- Add item status tracking
- Implement queue filtering
- Create queue time tracking
- Add queue notifications
- Implement bump/complete logic
- Create queue reporting

**Test Strategy:**
- Test order queuing
- Verify prioritization works
- Test status updates
- Validate time tracking
- Test queue notifications

---

### Task 69: Implement order void/cancellation workflow
**Status:** pending  
**Priority:** medium  
**Dependencies:** [59]

**Description:**
Create order cancellation system with proper authorization and audit trail.

**Details:**
- Design void workflow
- Implement void authorization
- Add void reason codes
- Create stock return logic
- Implement refund processing
- Add audit logging
- Create void reporting
- Implement manager override
- Add void limits

**Test Strategy:**
- Test void workflow
- Verify authorization required
- Test stock returns
- Validate audit logging
- Test void reports

---

### Task 70: Write integration tests for POS module
**Status:** pending  
**Priority:** high  
**Dependencies:** [61, 63, 65, 66]

**Description:**
Create comprehensive integration tests for POS functionality.

**Details:**
- Test order creation workflow
- Test cart operations
- Test payment processing
- Test cash drawer operations
- Test receipt generation
- Test discounts and promotions
- Test order cancellation
- Test kitchen queue
- Achieve >80% code coverage

**Test Strategy:**
- All integration tests pass
- Code coverage >80%
- Tests cover all workflows
- Tests handle edge cases
- Performance tests validate speed

---

## Summary

**Total Tasks:** 15  
**High Priority:** 10  
**Medium Priority:** 5  
**Estimated Completion:** Phase 1 (Months 1-3)

**Key Features:**
- ✅ Complete order management
- ✅ Shopping cart system
- ✅ Multiple payment methods
- ✅ Split payments
- ✅ Cash drawer management
- ✅ Receipt generation
- ✅ Discounts and promotions
- ✅ Kitchen queue integration
- ✅ Order void/cancellation

**Dependencies:**
- Menu Management (products)
- Inventory (stock deduction)
- Customer Management (optional)
- Authentication (users/permissions)

