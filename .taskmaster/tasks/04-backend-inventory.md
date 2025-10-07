# Backend: Inventory Management Module

**Priority:** P0 (Must Have - MVP)  
**Phase:** Phase 1-2 - MVP to Enhanced  
**Module:** Backend - Inventory Management

---

## Tasks

### Task 41: Create Ingredient schema and model
**Status:** pending  
**Priority:** high  
**Dependencies:** [2]

**Description:**
Design and implement Ingredient schema for tracking raw materials and inventory items.

**Details:**
- Create Ingredient schema with fields:
  - tenantId, name, sku, category
  - unit (kg, liter, piece, etc.)
  - lastPurchasePrice, averageCost
  - stockByLocation array (storeId, quantity, lastUpdated)
  - reorderLevel, reorderQuantity
  - trackBatches, trackExpiry booleans
  - preferredSupplierId
  - isActive
- Add compound indexes (tenantId + sku)
- Create text search index
  - Implement average cost calculation
- Add stock calculation methods
- Create low stock detection
- Implement batch tracking logic

**Test Strategy:**
- Test ingredient creation
- Verify average cost calculation
- Test stock by location tracking
- Validate low stock alerts
- Test batch tracking

---

### Task 42: Create PurchaseOrder schema and model
**Status:** pending  
**Priority:** high  
**Dependencies:** [41]

**Description:**
Implement purchase order system for ingredient procurement.

**Details:**
- Create PurchaseOrder schema with fields:
  - tenantId, storeId, poNumber
  - supplierId, status
  - items array (ingredientId, quantity, unitPrice, total)
  - subtotal, tax, shipping, total
  - orderDate, expectedDeliveryDate, receivedDate
  - notes, createdBy
- Add indexes (tenantId + status, tenantId + poNumber)
- Implement PO number generation
- Create status workflow (draft → submitted → approved → received)
- Add cost tracking per item
- Implement receiving logic
- Create partial receive capability

**Test Strategy:**
- Test PO creation and workflow
- Verify PO number is unique
- Test status transitions
- Validate cost calculations
- Test partial receiving

---

### Task 43: Create StockMovement schema for audit trail
**Status:** pending  
**Priority:** high  
**Dependencies:** [41]

**Description:**
Implement comprehensive stock movement tracking for audit and inventory valuation.

**Details:**
- Create StockMovement schema with fields:
  - tenantId, storeId, ingredientId
  - type (purchase, sale, adjustment, transfer, waste, return)
  - quantity (signed), previousQuantity, newQuantity
  - unitCost, totalCost
  - referenceType, referenceId (order, PO, etc.)
  - fromStoreId, toStoreId (for transfers)
  - reasonCode, notes (for adjustments)
  - batchNumber, expiryDate
  - performedBy, timestamp
- Add time-series indexes
- Implement automatic movement creation
- Create movement query helpers
- Add movement reporting methods
- Implement cost basis tracking (FIFO, LIFO, Average)

**Test Strategy:**
- Test movements created for all operations
- Verify quantity calculations are correct
- Test cost basis calculations
- Validate audit trail completeness
- Test movement queries

---

### Task 44: Create Supplier schema and management
**Status:** pending  
**Priority:** medium  
**Dependencies:** [2]

**Description:**
Implement supplier management system for vendor relationships.

**Details:**
- Create Supplier schema with fields:
  - tenantId, name, code
  - contact (email, phone, address)
  - paymentTerms, leadTime (days)
  - isActive, rating
- Add indexes (tenantId + code)
- Create supplier CRUD operations
- Implement supplier rating system
- Add supplier performance tracking
- Create supplier catalog integration
- Implement supplier selection logic

**Test Strategy:**
- Test supplier CRUD operations
- Verify unique code per tenant
- Test rating calculations
- Validate performance metrics
- Test supplier search

---

### Task 45: Implement Inventory service layer
**Status:** pending  
**Priority:** high  
**Dependencies:** [41, 42, 43]

**Description:**
Create comprehensive inventory management service with stock operations.

**Details:**
- Implement add ingredient method
- Create update ingredient method
- Add stock adjustment method
- Implement stock transfer between locations
- Create low stock detection
- Add stock valuation methods (FIFO, LIFO, Average)
- Implement batch and expiry tracking
- Create stock take functionality
- Add waste tracking
- Implement automatic reorder suggestions
- Create stock forecasting
- Add inventory reporting methods

**Test Strategy:**
- Test all CRUD operations
- Verify stock adjustments are atomic
- Test transfers maintain quantity
- Validate low stock alerts trigger
- Test valuation methods accuracy

---

### Task 46: Implement PurchaseOrder service layer
**Status:** pending  
**Priority:** high  
**Dependencies:** [42, 45]

**Description:**
Create purchase order management service with workflow and receiving.

**Details:**
- Implement create PO method
- Add update PO method
- Create submit PO workflow
- Implement approve PO method
- Add receive PO functionality
- Create partial receive logic
- Implement PO cancellation
- Add PO search and filtering
- Create PO reporting
- Implement cost tracking
- Add supplier integration hooks

**Test Strategy:**
- Test PO creation workflow
- Verify receiving updates stock
- Test partial receiving
- Validate cost tracking
- Test PO search and filters

---

### Task 47: Create Inventory REST controller
**Status:** pending  
**Priority:** high  
**Dependencies:** [45]

**Description:**
Build REST API endpoints for inventory management operations.

**Details:**
- Create GET /inventory/ingredients
- Add POST /inventory/ingredients
- Create GET /inventory/ingredients/:id
- Add PUT /inventory/ingredients/:id
- Create DELETE /inventory/ingredients/:id
- Implement POST /inventory/ingredients/:id/adjust
- Add GET /inventory/ingredients/low-stock
- Create GET /inventory/movements
- Implement POST /inventory/movements/transfer
- Add proper DTOs and validation
- Implement Swagger documentation
- Create response transformations

**Test Strategy:**
- E2E test ingredient CRUD
- Test stock adjustment endpoint
- Verify transfer endpoint works
- Validate low stock returns correct items
- Test API documentation

---

### Task 48: Create PurchaseOrder REST controller
**Status:** pending  
**Priority:** high  
**Dependencies:** [46]

**Description:**
Build REST API for purchase order management.

**Details:**
- Create GET /inventory/purchase-orders
- Add POST /inventory/purchase-orders
- Create GET /inventory/purchase-orders/:id
- Add PUT /inventory/purchase-orders/:id
- Implement POST /inventory/purchase-orders/:id/submit
- Create POST /inventory/purchase-orders/:id/approve
- Add POST /inventory/purchase-orders/:id/receive
- Create DELETE /inventory/purchase-orders/:id
- Implement proper DTOs
- Add validation and error handling
- Create Swagger documentation

**Test Strategy:**
- Test PO CRUD operations
- Verify workflow endpoints work
- Test receiving endpoint updates stock
- Validate permissions on operations
- Test API documentation

---

### Task 49: Implement stock deduction on order
**Status:** pending  
**Priority:** high  
**Dependencies:** [45]

**Description:**
Create automatic stock deduction when orders are placed using recipes.

**Details:**
- Implement order placement hook
- Create recipe ingredient lookup
- Add stock availability check
- Implement atomic stock deduction
- Create stock movement records
- Add rollback on order cancellation
- Implement low stock warnings
- Create stock reservation system
- Add concurrent order handling
- Implement stock alerts

**Test Strategy:**
- Test stock deducts on order
- Verify recipe calculations correct
- Test rollback on cancellation
- Validate low stock warnings
- Test concurrent orders don't oversell

---

### Task 50: Implement stock transfer system
**Status:** pending  
**Priority:** medium  
**Dependencies:** [45]

**Description:**
Create system for transferring stock between store locations.

**Details:**
- Design transfer workflow
- Implement initiate transfer method
- Create approve transfer logic
- Add receive transfer endpoint
- Implement transfer tracking
- Create transfer history
- Add transfer validation
- Implement transfer cancellation
- Create transfer reporting
- Add transfer notifications

**Test Strategy:**
- Test transfer workflow end-to-end
- Verify quantities update correctly
- Test transfer approval process
- Validate transfer history accurate
- Test transfer notifications

---

### Task 51: Implement batch and expiry tracking
**Status:** pending  
**Priority:** medium  
**Dependencies:** [45]

**Description:**
Create system for tracking ingredient batches and expiration dates.

**Details:**
- Design batch tracking structure
- Implement batch creation on receive
- Add FEFO (First Expired First Out) logic
- Create expiry date management
- Implement expiry alerts
- Add batch stock queries
- Create batch reporting
- Implement waste tracking by batch
- Add batch recall functionality

**Test Strategy:**
- Test batch creation on receiving
- Verify FEFO selects correct batch
- Test expiry alerts trigger
- Validate batch reporting
- Test batch recall process

---

### Task 52: Implement inventory valuation methods
**Status:** pending  
**Priority:** medium  
**Dependencies:** [43, 45]

**Description:**
Create inventory valuation using FIFO, LIFO, and Average Cost methods.

**Details:**
- Implement FIFO cost calculation
- Add LIFO cost calculation
- Create Average Cost calculation
- Implement valuation reporting
- Add cost basis tracking
- Create inventory value snapshots
- Implement cost variance analysis
- Add profit margin calculations
- Create valuation audit trail

**Test Strategy:**
- Test FIFO calculates correctly
- Verify LIFO matches expected values
- Test Average Cost updates properly
- Validate valuation reports
- Test cost variance detection

---

### Task 53: Create stock take/count functionality
**Status:** pending  
**Priority:** medium  
**Dependencies:** [45]

**Description:**
Implement physical inventory count and reconciliation system.

**Details:**
- Design stock take workflow
- Create stock take session
- Implement count entry
- Add variance detection
- Create adjustment generation
- Implement approval workflow
- Add stock take reporting
- Create reconciliation tools
- Implement cycle counting
- Add count history

**Test Strategy:**
- Test stock take creation
- Verify count entries recorded
- Test variance calculation
- Validate adjustment creation
- Test reconciliation process

---

### Task 54: Implement automated reorder system
**Status:** pending  
**Priority:** low  
**Dependencies:** [45, 46]

**Description:**
Create intelligent automated reordering based on consumption patterns.

**Details:**
- Implement consumption tracking
- Create reorder point calculation
- Add reorder quantity optimization
- Implement automatic PO generation
- Create supplier selection logic
- Add lead time consideration
- Implement safety stock calculation
- Create reorder alerts
- Add seasonal adjustment
- Implement ML-based forecasting (future)

**Test Strategy:**
- Test reorder point triggers correctly
- Verify PO generation logic
- Test quantity optimization
- Validate supplier selection
- Test forecasting accuracy

---

### Task 55: Write integration tests for inventory module
**Status:** pending  
**Priority:** high  
**Dependencies:** [47, 48, 49, 50]

**Description:**
Create comprehensive integration tests for inventory management.

**Details:**
- Test ingredient CRUD operations
- Test PO workflow end-to-end
- Test stock movements tracking
- Test stock transfers
- Test batch tracking
- Test inventory valuation
- Test stock take process
- Test automated reordering
- Achieve >80% code coverage

**Test Strategy:**
- All integration tests pass
- Code coverage >80%
- Tests cover critical workflows
- Tests handle edge cases
- Performance tests validate speed

---

## Summary

**Total Tasks:** 15  
**High Priority:** 8  
**Medium Priority:** 6  
**Low Priority:** 1  
**Estimated Completion:** Phase 1-2 (Months 1-6)

**Key Features:**
- ✅ Ingredient management
- ✅ Purchase order system
- ✅ Stock movement tracking
- ✅ Multi-location inventory
- ✅ Batch and expiry tracking
- ✅ Inventory valuation (FIFO/LIFO/Average)
- ✅ Stock take functionality
- ✅ Automated reordering

**Dependencies:**
- Menu Management module (for recipes)
- Orders module (for stock deduction)
- Authentication module

