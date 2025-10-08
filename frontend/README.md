# POS System Frontend

Modern Next.js 14+ frontend for the Cloud POS System.

## ✅ Implemented Features

### MVP Features (Completed)
- ✅ Next.js 14 with App Router
- ✅ TypeScript 5+ strict mode
- ✅ Tailwind CSS 3+ styling
- ✅ shadcn/ui component library
- ✅ Zustand state management
- ✅ React Query (TanStack Query)
- ✅ React Hook Form + Zod validation
- ✅ Axios API client with auto token refresh
- ✅ Authentication UI (Login & Register)
- ✅ Dashboard layout with sidebar
- ✅ POS interface with shopping cart
- ✅ Responsive design

### Pages
- ✅ `/auth/login` - Login page
- ✅ `/auth/register` - Registration page
- ✅ `/dashboard` - Dashboard home
- ✅ `/pos` - Point of Sale interface
- ✅ `/menu` - Menu management (placeholder)
- ✅ `/orders` - Order history (placeholder)
- ✅ `/customers` - Customer management (placeholder)
- ✅ `/analytics` - Analytics & reports (placeholder)
- ✅ `/settings` - Settings (placeholder)

## 🚀 Quick Start

### Development

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Access the app at http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### Docker

```bash
# From project root
docker-compose up -d frontend
```

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (redirects)
│   ├── globals.css               # Global styles
│   ├── auth/
│   │   ├── login/page.tsx        ✅ Login page
│   │   └── register/page.tsx     ✅ Registration page
│   └── (dashboard)/              # Protected dashboard routes
│       ├── layout.tsx             ✅ Dashboard layout
│       ├── dashboard/page.tsx     ✅ Dashboard home
│       ├── pos/page.tsx           ✅ POS interface
│       ├── menu/page.tsx          📝 Placeholder
│       ├── orders/page.tsx        📝 Placeholder
│       ├── customers/page.tsx     📝 Placeholder
│       ├── analytics/page.tsx     📝 Placeholder
│       └── settings/page.tsx      📝 Placeholder
│
├── components/
│   ├── ui/                        ✅ shadcn/ui components
│   └── layout/
│       └── sidebar.tsx            ✅ Sidebar navigation
│
├── lib/
│   ├── api/
│   │   ├── client.ts              ✅ Axios instance
│   │   └── auth.ts                ✅ Auth API calls
│   ├── providers/
│   │   └── query-provider.tsx    ✅ React Query provider
│   ├── config.ts                  ✅ App configuration
│   └── utils.ts                   ✅ Utility functions
│
├── stores/
│   └── slices/
│       ├── authStore.ts           ✅ Auth state
│       └── cartStore.ts           ✅ Cart state
│
└── types/
    └── index.ts                   ✅ TypeScript types
```

## 🎨 Features

### Authentication
- Email/password login
- User registration with business setup
- JWT token management
- Auto token refresh
- Protected routes
- Persistent auth state

### POS Interface
- Product grid with search
- Real-time cart management
- Quantity adjustments
- Price calculations with tax
- Checkout functionality
- Clear cart option

### UI/UX
- Modern, clean design
- Responsive layout
- Toast notifications
- Loading states
- Form validation
- Error handling

## 🔑 Authentication Flow

### Register
1. Visit `/auth/register`
2. Fill in business and user details
3. Auto-login after registration
4. Redirect to POS

### Login
1. Visit `/auth/login`
2. Enter email, password, and tenant ID
3. Login redirects to POS
4. Tenant ID is saved from registration

## 🛒 Using the POS

1. Navigate to `/pos`
2. Search for products or browse grid
3. Click products to add to cart
4. Adjust quantities with +/- buttons
5. Review order total with tax
6. Click "Complete Order" to checkout
7. Order confirmation shown

## 🔧 Configuration

### Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_WS_URL=ws://localhost:4000
NEXT_PUBLIC_APP_NAME=POS System
```

### API Endpoints

The frontend connects to these backend endpoints:
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh-token` - Token refresh
- `GET /api/v1/auth/me` - Get current user

## 🎯 Next Steps

### Immediate
1. Implement real product management
2. Connect to actual backend products API
3. Add WebSocket for real-time updates
4. Implement order history
5. Add receipt printing

### Short Term
6. Menu management UI
7. Customer management UI
8. Inventory management UI
9. Analytics dashboard with charts
10. Settings and configuration

### Long Term
11. Mobile responsive optimization
12. PWA capabilities
13. Offline mode
14. Multi-language support
15. Advanced reporting

## 📦 Key Dependencies

```json
{
  "next": "^15.5.4",
  "react": "^19.0.0",
  "typescript": "^5",
  "tailwindcss": "^4",
  "@tanstack/react-query": "^5.28.0",
  "zustand": "^4.5.0",
  "axios": "^1.6.0",
  "react-hook-form": "^7.51.0",
  "zod": "^3.22.0",
  "socket.io-client": "^4.7.0",
  "lucide-react": "^0.356.0"
}
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npm run type-check
```

## 🐛 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Module Resolution Issues
Check that `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📄 License

MIT

---

**Status:** ✅ MVP Frontend Complete  
**Build:** ✅ Passing  
**Ready For:** Development & Testing
