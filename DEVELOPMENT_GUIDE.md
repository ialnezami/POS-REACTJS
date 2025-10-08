# Development Mode Guide - POS System

## 🚀 Quick Start (No Authentication Required)

Authentication is temporarily disabled for rapid development. You can now focus on building features without dealing with login/tokens.

### Start Backend
```bash
cd backend

# Create .env file with DEV_SKIP_AUTH enabled
cp env.template .env

# Make sure DEV_SKIP_AUTH=true is in your .env file
echo "DEV_SKIP_AUTH=true" >> .env

npm install
npm run start:dev
```

Backend runs on: **http://localhost:3001**

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:3000**

---

## ✨ New Features Implemented

### 1. **Product Management** (`/products`)
Complete CRUD operations for inventory management:
- ✅ Create products with name, description, price, SKU, category, stock
- ✅ Edit existing products
- ✅ Delete products
- ✅ View all products in a table
- ✅ Automatic stock status tracking
- ✅ Search functionality

**API Endpoints:**
```
GET    /api/v1/products              # Get all products
POST   /api/v1/products              # Create product
GET    /api/v1/products/:id          # Get one product
PATCH  /api/v1/products/:id          # Update product
DELETE /api/v1/products/:id          # Delete product
PATCH  /api/v1/products/:id/stock    # Update stock
GET    /api/v1/products/categories   # Get all categories
GET    /api/v1/products/search?q=... # Search products
```

### 2. **Point of Sale (POS)** (`/pos`)
Full-featured POS interface with multi-item cart:
- ✅ Browse all active products
- ✅ Search products by name, SKU, or category
- ✅ Add multiple items to cart
- ✅ Adjust quantities in cart
- ✅ Remove items from cart
- ✅ Real-time totals calculation (subtotal, tax, total)
- ✅ Multiple payment methods (Cash, Card, Mobile)
- ✅ Optional customer name
- ✅ Stock validation (prevents overselling)
- ✅ Automatic stock deduction on sale

**API Endpoints:**
```
GET    /api/v1/sales                # Get all sales
POST   /api/v1/sales                # Create sale
GET    /api/v1/sales/:id            # Get one sale
PATCH  /api/v1/sales/:id/cancel     # Cancel sale (restores stock)
GET    /api/v1/sales/daily-summary  # Get daily summary
```

### 3. **Sales Management** (`/orders`)
View and manage completed sales:
- ✅ View all sales with detailed information
- ✅ Filter by date range and status
- ✅ View sale details (items, prices, totals)
- ✅ Cancel sales (auto-restores stock)
- ✅ Daily sales summary

---

## 🎯 Typical Workflow

### 1. Add Some Products
1. Navigate to **Products** page (`/products`)
2. Click "Add Product"
3. Fill in the details:
   ```
   Name: Espresso Coffee
   Description: Fresh brewed espresso
   SKU: ESP-001
   Category: Beverages
   Price: 3.50
   Cost: 1.50
   Stock: 100
   ```
4. Click "Create Product"

### 2. Make a Sale
1. Navigate to **POS** page (`/pos`)
2. Search or browse products
3. Click on products to add to cart
4. Adjust quantities using +/- buttons
5. Review cart total
6. Click "Checkout"
7. Select payment method
8. Optionally add customer name
9. Click "Complete Sale"

### 3. View Sales
1. Navigate to **Orders** page (`/orders`)
2. See all completed sales
3. View details of any sale
4. Cancel if needed (stock will be restored)

---

## 📊 Database Schema

### Product Schema
```typescript
{
  name: string;              // Product name
  description: string;       // Product description
  price: number;             // Selling price
  category: string;          // Category name
  stock: number;             // Available quantity
  sku: string;               // Unique SKU (per tenant)
  imageUrl?: string;         // Optional product image
  barcode?: string;          // Optional barcode
  status: 'active' | 'inactive' | 'out_of_stock';
  cost?: number;             // Cost price (for profit calculation)
  tags?: string[];           // Optional tags
  tenantId: ObjectId;        // Multi-tenant support
}
```

### Sale Schema
```typescript
{
  saleNumber: string;        // Unique sale number (auto-generated)
  items: [{
    productId: ObjectId;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }];
  subtotal: number;          // Sum of all items
  tax: number;               // 10% tax
  discount: number;          // Optional discount
  total: number;             // Final amount
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'mobile' | 'other';
  customerName?: string;     // Optional customer name
  notes?: string;            // Optional notes
  tenantId: ObjectId;
  cashierId?: ObjectId;
}
```

---

## 🔧 Configuration

### Environment Variables (`.env`)
```env
# Development Mode - Authentication Bypass
DEV_SKIP_AUTH=true

# Application
NODE_ENV=development
PORT=3001

# Database
MONGODB_URI=mongodb://localhost:27017/pos_system

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT (not needed in dev mode, but required for production)
JWT_SECRET=dev-secret
JWT_REFRESH_SECRET=dev-refresh-secret
```

### Important Notes:
- **DEV_SKIP_AUTH=true**: Bypasses all authentication checks
- **NEVER use DEV_SKIP_AUTH in production!**
- When ready for production, set `DEV_SKIP_AUTH=false` and implement proper auth

---

## 🧪 Testing the System

### Test Scenario 1: Basic Sale
```bash
# 1. Create a test product
curl -X POST http://localhost:3001/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "price": 10.00,
    "category": "Test",
    "stock": 50,
    "sku": "TEST-001"
  }'

# 2. Create a sale
curl -X POST http://localhost:3001/api/v1/sales \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "<product_id_from_step_1>",
        "quantity": 2
      }
    ],
    "paymentMethod": "cash"
  }'

# 3. Verify stock was reduced
curl http://localhost:3001/api/v1/products/<product_id>
```

### Test Scenario 2: Multi-Item Sale
Use the POS UI:
1. Add multiple different products to cart
2. Adjust quantities
3. Remove some items
4. Complete the sale
5. Verify stock levels updated correctly

### Test Scenario 3: Stock Validation
1. Try to sell more than available stock
2. Should see error: "Insufficient stock"
3. Try to add out-of-stock item to cart
4. Should see error: "Product is out of stock"

---

## 🐛 Common Issues & Solutions

### Backend won't start
```bash
# Check if MongoDB is running
mongosh
# or
brew services list | grep mongodb

# Check if port 3001 is available
lsof -i :3001
```

### Products not showing
```bash
# Check backend logs
# Make sure MongoDB connection is successful
# Verify products exist: GET /api/v1/products
```

### Cart not updating
- Check browser console for errors
- Verify API requests are succeeding
- Check network tab in browser dev tools

### Sale fails with "Insufficient stock"
- Check actual stock in database
- Verify you're not trying to sell more than available
- Check if another sale already reduced the stock

---

## 📈 Next Steps

### Features to Add:
1. **Sales Reports**: Daily/weekly/monthly revenue reports
2. **Product Categories**: Better category management
3. **Customer Management**: Customer profiles and history
4. **Discounts**: Apply discounts to sales
5. **Receipt Printing**: Generate printable receipts
6. **Barcode Scanner**: Support for barcode scanning
7. **Multi-Store**: Support multiple store locations
8. **Employee Management**: Track which cashier made each sale
9. **Inventory Alerts**: Low stock notifications
10. **Return/Refund**: Handle returns and refunds

### Re-enable Authentication:
When ready for production:
1. Set `DEV_SKIP_AUTH=false` in `.env`
2. Update frontend to handle auth tokens
3. Update API calls to include Authorization header
4. Test login flow
5. Deploy with proper security

---

## 📚 API Documentation

Full Swagger documentation available at:
**http://localhost:3001/api/docs**

Interactive API testing and documentation for all endpoints.

---

## 🎨 UI Routes

- `/products` - Product Management
- `/pos` - Point of Sale
- `/orders` - Sales History
- `/dashboard` - Dashboard (coming soon)
- `/analytics` - Analytics (coming soon)
- `/settings` - Settings (coming soon)

---

## 💡 Tips

1. **Use Swagger**: Test APIs directly at `/api/docs`
2. **Check Logs**: Backend logs show all requests and errors
3. **Browser DevTools**: Network tab shows all API calls
4. **MongoDB Compass**: Visualize database directly
5. **Postman**: Save API requests for quick testing

---

**Happy Coding! 🚀**

