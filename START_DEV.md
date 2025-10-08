# 🚀 Quick Start - Development Mode

## Prerequisites
- Node.js 18+
- MongoDB running on localhost:27017
- Redis running on localhost:6379 (optional, but recommended)

## Start in 3 Steps

### Step 1: Backend Setup
```bash
cd backend
npm install

# Create .env file
cat > .env << EOL
DEV_SKIP_AUTH=true
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/pos_system
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=dev-secret
JWT_REFRESH_SECRET=dev-refresh-secret
CORS_ORIGIN=http://localhost:3000
EOL

# Start backend
npm run start:dev
```

Backend will be available at: **http://localhost:3001**  
API Docs: **http://localhost:3001/api/docs**

### Step 2: Frontend Setup
```bash
cd frontend
npm install

# Start frontend
npm run dev
```

Frontend will be available at: **http://localhost:3000**

### Step 3: Use the Application

1. **Go to Products** (`http://localhost:3000/products`)
   - Click "Add Product"
   - Create a few test products:
     ```
     Product 1:
     - Name: Espresso Coffee
     - SKU: ESP-001
     - Category: Beverages
     - Price: 3.50
     - Stock: 100
     
     Product 2:
     - Name: Croissant
     - SKU: CRO-001
     - Category: Bakery
     - Price: 2.50
     - Stock: 50
     ```

2. **Go to POS** (`http://localhost:3000/pos`)
   - Click on products to add to cart
   - Adjust quantities
   - Click "Checkout"
   - Select payment method
   - Complete sale

3. **Go to Orders** (`http://localhost:3000/orders`)
   - View your completed sales
   - See sale details

---

## 🎉 What's Working

✅ **No Authentication Required** - DEV_SKIP_AUTH bypasses login  
✅ **Product Management** - Full CRUD operations  
✅ **Multi-Item Cart** - Add multiple products to cart  
✅ **Real-time Calculations** - Subtotal, tax, total  
✅ **Stock Management** - Auto-decrement on sale  
✅ **Stock Validation** - Prevents overselling  
✅ **Payment Methods** - Cash, Card, Mobile  
✅ **Sales History** - View all completed sales  
✅ **Cancel Sales** - Restore stock automatically  

---

## 📱 Features Available

### Product Management (`/products`)
- Create, Read, Update, Delete products
- Track stock levels
- Organize by categories
- Search functionality
- Auto status updates (out of stock)

### Point of Sale (`/pos`)
- Browse products visually
- Search by name/SKU/category
- Add to cart with one click
- Adjust quantities
- Remove items
- Real-time total calculation
- Multiple payment methods
- Customer name (optional)

### Sales Management (`/orders`)
- View all sales
- Filter by date/status
- View sale details
- Cancel sales (restores stock)
- Daily summary

---

## 🐛 Troubleshooting

### MongoDB not running?
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Check if running
mongosh
```

### Redis not running? (Optional)
```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis

# Check if running
redis-cli ping
# Should respond with: PONG
```

### Port already in use?
```bash
# Check what's using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Frontend can't connect to backend?
1. Make sure backend is running: `curl http://localhost:3001/health`
2. Check CORS settings in backend `.env`
3. Clear browser cache
4. Check browser console for errors

---

## 📚 Documentation

- **Full Development Guide**: `DEVELOPMENT_GUIDE.md`
- **API Documentation**: http://localhost:3001/api/docs
- **Login Fix Info**: `LOGIN_FIX_SUMMARY.md`
- **Quick Login Guide**: `QUICKSTART_LOGIN.md`

---

## ⚠️ Important Notes

- **DEV_SKIP_AUTH=true** is for development ONLY
- NEVER use this in production
- All API requests will work without authentication
- When ready for production, set DEV_SKIP_AUTH=false

---

## 🎯 Next Development Steps

1. Add sales reports and analytics
2. Implement customer management
3. Add discount functionality
4. Create receipt generation
5. Add barcode scanner support
6. Implement multi-store support
7. Re-enable authentication for production

---

**Everything is ready! Start building! 🚀**

