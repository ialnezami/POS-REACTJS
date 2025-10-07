# Backend: Menu Management Module

**Priority:** P0 (Must Have - MVP)  
**Phase:** Phase 1 - MVP  
**Module:** Backend - Menu Management

---

## Tasks

### Task 26: Create Category schema and model
**Status:** pending  
**Priority:** high  
**Dependencies:** [2]

**Description:**
Design and implement hierarchical category schema with support for unlimited nesting.

**Details:**
- Create Category schema with fields:
  - tenantId, storeId (nullable for global categories)
  - name, slug, description
  - parentId for hierarchy
  - image URL
  - displayOrder, isActive
  - metadata (flexible JSON)
- Add compound indexes (tenantId + parentId)
- Implement pre-save slug generation
- Add hierarchy validation (prevent circular references)
- Create virtual for children categories
- Implement cascade delete for subcategories
- Add category path calculation
- Implement category tree utilities

**Test Strategy:**
- Test category creation with/without parent
- Verify slug is auto-generated and unique
- Test circular reference prevention
- Validate hierarchy depth limits
- Test cascade delete works correctly

---

### Task 27: Create Product schema and model
**Status:** pending  
**Priority:** high  
**Dependencies:** [26]

**Description:**
Implement comprehensive Product schema with variants, modifiers, and pricing rules.

**Details:**
- Create Product schema with fields:
  - tenantId, storeId, categoryId
  - sku (unique), name, slug, description
  - images array (CDN URLs)
  - basePrice, cost, taxRate, currency
  - pricingRules array for dynamic pricing
  - trackInventory, stockQuantity, lowStockThreshold
  - recipe (ingredients array)
  - variants array (size, color, etc.)
  - modifiers array (add-ons, customizations)
  - tags, isActive, isFeatured, displayOrder
  - preparationTime, nutritionalInfo, allergens
  - metaTitle, metaDescription for SEO
  - viewCount, orderCount, rating
- Add compound indexes (tenantId + storeId + isActive)
- Create SKU unique index per tenant
- Add full-text search index on name and description
- Implement pricing calculation methods
- Add stock management methods
- Create recipe costing calculation

**Test Strategy:**
- Test product creation with all fields
- Verify SKU uniqueness per tenant
- Test full-text search finds products
- Validate pricing calculation with rules
- Test stock deduction methods

---

### Task 28: Implement Categories CRUD service
**Status:** pending  
**Priority:** high  
**Dependencies:** [26]

**Description:**
Create service layer for category management with hierarchy operations.

**Details:**
- Implement create category method
- Add update category method
- Create soft delete method
- Implement get category by ID
- Add get all categories with filters
- Create get category tree method
- Implement move category to new parent
- Add get category path/breadcrumb
- Create get products in category
- Implement category search
- Add category sorting utilities
- Cache frequently accessed categories

**Test Strategy:**
- Unit test each CRUD operation
- Test category tree generation
- Verify move category updates hierarchy
- Test category path calculation
- Validate caching improves performance

---

### Task 29: Implement Products CRUD service
**Status:** pending  
**Priority:** high  
**Dependencies:** [27]

**Description:**
Create comprehensive product management service with pricing, variants, and inventory.

**Details:**
- Implement create product with validation
- Add update product method
- Create soft delete method
- Implement get product by ID/SKU
- Add get all products with filtering
- Create bulk import from CSV/Excel
- Implement bulk export functionality
- Add product search with full-text
- Create variant management methods
- Implement modifier management
- Add pricing rule evaluation
- Create stock adjustment methods
- Implement image upload handling
- Add product cloning functionality

**Test Strategy:**
- Test CRUD operations for products
- Verify bulk import validates data
- Test search finds products accurately
- Validate pricing rules are applied
- Test stock management is atomic

---

### Task 30: Create Categories REST controller
**Status:** pending  
**Priority:** high  
**Dependencies:** [28]

**Description:**
Build REST API endpoints for category management operations.

**Details:**
- Create GET /categories endpoint with filters
- Add POST /categories for creation
- Create GET /categories/:id for single category
- Add PUT /categories/:id for updates
- Create DELETE /categories/:id for deletion
- Implement GET /categories/:id/products
- Add GET /categories/tree for hierarchy
- Create PATCH /categories/:id/move endpoint
- Implement proper DTOs for requests/responses
- Add validation with class-validator
- Implement Swagger documentation
- Add pagination for list endpoints
- Create category reordering endpoint

**Test Strategy:**
- E2E test category creation flow
- Test GET returns filtered results
- Verify update changes category
- Test delete prevents orphaned products
- Validate Swagger docs are accurate

---

### Task 31: Create Products REST controller
**Status:** pending  
**Priority:** high  
**Dependencies:** [29]

**Description:**
Build comprehensive REST API for product management with search and bulk operations.

**Details:**
- Create GET /products with advanced filters
- Add POST /products for creation
- Create GET /products/:id
- Add PUT /products/:id for updates
- Create DELETE /products/:id
- Implement PATCH /products/:id/toggle-active
- Add POST /products/bulk-import endpoint
- Create GET /products/export endpoint
- Implement GET /products/search?q=query
- Add GET /products/low-stock endpoint
- Create image upload endpoints
- Implement proper DTOs with nested objects
- Add comprehensive Swagger docs
- Implement response transformation

**Test Strategy:**
- Test product creation with variants
- Verify search returns relevant results
- Test bulk import with sample data
- Validate export includes all fields
- Test image upload and storage

---

### Task 32: Implement product variants system
**Status:** pending  
**Priority:** high  
**Dependencies:** [29]

**Description:**
Create system for managing product variants (size, color, temperature, etc.).

**Details:**
- Design variant structure:
  - Variant type (size, color, etc.)
  - Options array (small, medium, large)
  - Price/cost adjustments per option
  - SKU generation for variant combinations
  - Default option selection
  - Required vs optional variants
- Implement variant validation
- Create variant combination generator
- Add price calculation with variants
- Implement stock tracking per variant
- Create variant-aware cart system
- Add variant filtering in search
- Implement variant inheritance

**Test Strategy:**
- Test variant creation and updates
- Verify price calculation includes variants
- Test all variant combinations generate
- Validate stock tracks per variant
- Test variant SKU uniqueness

---

### Task 33: Implement product modifiers system
**Status:** pending  
**Priority:** high  
**Dependencies:** [29]

**Description:**
Create flexible modifier system for add-ons and customizations.

**Details:**
- Design modifier structure:
  - Modifier group (extras, toppings, etc.)
  - Options array with prices
  - Single vs multiple selection
  - Required vs optional
  - Max selections limit
  - Default selections
- Implement modifier validation
- Create price calculation with modifiers
- Add modifier dependencies (if X then Y)
- Implement modifier rules engine
- Create modifier templates
- Add cost tracking for modifiers

**Test Strategy:**
- Test modifier creation and updates
- Verify price calculation with modifiers
- Test selection limits are enforced
- Validate required modifiers block order
- Test modifier rules work correctly

---

### Task 34: Implement dynamic pricing rules engine
**Status:** pending  
**Priority:** medium  
**Dependencies:** [29]

**Description:**
Create flexible pricing rules system for time-based and quantity discounts.

**Details:**
- Design pricing rule types:
  - Time-based (happy hour, lunch special)
  - Quantity-based (buy 2 get 10% off)
  - Customer group (VIP, members)
  - Combination rules
- Implement rule evaluation engine
- Add rule priority system
- Create rule scheduling (start/end dates)
- Implement rule conditions matching
- Add rule testing/preview
- Create rule conflict resolution
- Cache active rules for performance

**Test Strategy:**
- Test time-based rules activate at correct time
- Verify quantity discounts calculate correctly
- Test rule priority determines application order
- Validate rule conflicts are resolved
- Test rule caching improves performance

---

### Task 35: Implement recipe management system
**Status:** pending  
**Priority:** medium  
**Dependencies:** [29]

**Description:**
Create recipe system linking products to ingredients for cost calculation and inventory.

**Details:**
- Design recipe structure:
  - Ingredients array with quantities
  - Unit of measure
  - Preparation steps (optional)
  - Yield/portion size
- Implement recipe costing calculation
- Create automatic stock deduction
- Add recipe scaling for batches
- Implement recipe versioning
- Create recipe templates
- Add recipe cost alerts
- Implement waste tracking

**Test Strategy:**
- Test recipe creation with ingredients
- Verify cost calculation is accurate
- Test stock deduction on order
- Validate recipe scaling works
- Test alerts trigger on cost changes

---

### Task 36: Implement product search with full-text indexing
**Status:** pending  
**Priority:** high  
**Dependencies:** [31]

**Description:**
Create powerful product search with text indexing, filters, and relevance scoring.

**Details:**
- Configure MongoDB text indexes
- Implement search query parsing
- Add relevance scoring
- Create faceted search (category, price, etc.)
- Implement search filters:
  - Category
  - Price range
  - In stock only
  - Active only
  - Tags
- Add search suggestions/autocomplete
- Implement search result highlighting
- Cache popular searches
- Add search analytics

**Test Strategy:**
- Test search finds products by name/description
- Verify relevance scoring ranks results
- Test filters narrow results correctly
- Validate autocomplete suggests products
- Test search performance with large dataset

---

### Task 37: Create bulk import/export functionality
**Status:** pending  
**Priority:** medium  
**Dependencies:** [29]

**Description:**
Implement bulk operations for importing and exporting products via CSV/Excel.

**Details:**
- Support CSV and Excel (XLSX) formats
- Create import template with all fields
- Implement data validation before import
- Add duplicate detection and handling
- Create import preview/dry-run
- Implement chunked processing for large files
- Add import status tracking
- Create export with filters
- Implement export templates
- Add import/export logging
- Create rollback mechanism for failed imports

**Test Strategy:**
- Test import with valid CSV/Excel
- Verify validation catches errors
- Test duplicate handling works
- Validate export includes all data
- Test large file import performance

---

### Task 38: Implement product image management
**Status:** pending  
**Priority:** medium  
**Dependencies:** [29]

**Description:**
Create image upload, storage, and CDN integration for product images.

**Details:**
- Integrate with cloud storage (S3 or Cloudinary)
- Implement image upload endpoint
- Add image validation (size, type, dimensions)
- Create image optimization/resizing
- Implement multiple image support
- Add image ordering
- Create thumbnail generation
- Implement image CDN delivery
- Add image deletion and cleanup
- Create image gallery component data

**Test Strategy:**
- Test image upload succeeds
- Verify images are optimized
- Test CDN delivers images
- Validate image deletion works
- Test multiple images per product

---

### Task 39: Create nutritional information management
**Status:** pending  
**Priority:** low  
**Dependencies:** [27]

**Description:**
Implement system for managing and displaying nutritional information.

**Details:**
- Create nutritional info schema:
  - Calories, protein, fat, carbs
  - Vitamins and minerals
  - Serving size
  - Allergen information
- Add nutritional info CRUD
- Implement calculation from recipes
- Create allergen warnings
- Add dietary labels (vegan, gluten-free, etc.)
- Implement nutritional info search
- Create nutritional templates

**Test Strategy:**
- Test nutritional info creation
- Verify calculation from recipes
- Test allergen warnings display
- Validate dietary filters work
- Test nutritional templates apply

---

### Task 40: Write integration tests for menu module
**Status:** pending  
**Priority:** high  
**Dependencies:** [30, 31, 32, 33, 34]

**Description:**
Create comprehensive integration tests for menu management functionality.

**Details:**
- Test category CRUD operations
- Test product CRUD operations
- Test category hierarchy operations
- Test product search functionality
- Test variant management
- Test modifier management
- Test pricing rules evaluation
- Test recipe costing
- Test bulk import/export
- Test image upload
- Achieve >80% code coverage

**Test Strategy:**
- All integration tests pass
- Code coverage >80%
- Tests cover edge cases
- Tests clean up test data
- Performance tests validate speed

---

## Summary

**Total Tasks:** 15  
**High Priority:** 10  
**Medium Priority:** 4  
**Low Priority:** 1  
**Estimated Completion:** Phase 1 (Months 1-3)

**Key Features:**
- ✅ Hierarchical category management
- ✅ Product variants and modifiers
- ✅ Dynamic pricing rules
- ✅ Recipe management
- ✅ Full-text search
- ✅ Bulk import/export
- ✅ Image management
- ✅ Nutritional information

**Dependencies:**
- Database setup complete
- Authentication module complete
- Cloud storage (S3/Cloudinary)

