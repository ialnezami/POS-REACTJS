# Quick Start - Login System

## 🚀 Get Started in 3 Steps

### Step 1: Setup Backend Environment
```bash
cd backend
cp env.template .env
npm install
npm run start:dev
```

**Backend will run on:** http://localhost:4000  
**API Docs:** http://localhost:4000/api/docs

### Step 2: Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

**Frontend will run on:** http://localhost:3000

### Step 3: Test Login
1. Go to: http://localhost:3000/auth/register
2. Create an account with:
   - **Email**: test@example.com
   - **Password**: SecurePass123!
   - **First Name**: Test
   - **Last Name**: User
   - **Business Name**: Test Business

3. Go to: http://localhost:3000/auth/login
4. Login with just:
   - **Email**: test@example.com
   - **Password**: SecurePass123!

That's it! No tenant ID needed anymore! 🎉

---

## 🐳 Alternative: Using Docker

```bash
# From project root
docker-compose up -d

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:4000
# - API Docs: http://localhost:4000/api/docs
```

---

## ✨ What Changed?

### Before (Complex)
- Had to enter: Email, Password, **and** Tenant ID
- Users didn't know their tenant ID
- Login was confusing

### After (Simple)
- Just enter: Email and Password
- System auto-detects your tenant
- Login is straightforward

---

## 🔧 Troubleshooting

### Backend won't start?
1. Check if MongoDB is running (port 27017)
2. Check if Redis is running (port 6379)
3. Make sure `.env` file exists in backend folder

### Frontend can't connect?
1. Verify backend is running: http://localhost:4000/health
2. Check CORS settings in backend `.env`
3. Clear browser cache and try again

### Login fails?
1. Make sure you registered first
2. Check password is at least 8 characters
3. Look at browser console for error details
4. Check backend logs for detailed errors

---

## 📚 More Info

For detailed information about all the changes, see: [LOGIN_FIX_SUMMARY.md](./LOGIN_FIX_SUMMARY.md)

---

## 🔐 Security Note

**Development vs Production:**
- ✅ Development: Default JWT secrets work fine
- ⚠️ Production: **MUST change JWT secrets in `.env`**

Update these in production:
```env
JWT_SECRET=your-super-secret-32-character-string-here
JWT_REFRESH_SECRET=your-refresh-secret-32-character-string-here
```

Use strong random strings (32+ characters recommended).

---

**Happy coding! 🎉**

