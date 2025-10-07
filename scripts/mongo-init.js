// MongoDB Initialization Script
// This script runs when the MongoDB container is first created

db = db.getSiblingDB('pos');

// Create collections with validation
db.createCollection('users', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['email', 'password', 'role', 'tenantId'],
      properties: {
        email: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        password: {
          bsonType: 'string',
          description: 'must be a string and is required'
        },
        role: {
          enum: ['super_admin', 'tenant_admin', 'store_manager', 'cashier', 'inventory_manager', 'accountant', 'viewer'],
          description: 'can only be one of the enum values'
        }
      }
    }
  }
});

// Create indexes for users
db.users.createIndex({ email: 1, tenantId: 1 }, { unique: true });
db.users.createIndex({ tenantId: 1, role: 1 });

// Create products collection
db.createCollection('products');
db.products.createIndex({ tenantId: 1, storeId: 1, isActive: 1 });
db.products.createIndex({ tenantId: 1, categoryId: 1 });
db.products.createIndex({ tenantId: 1, sku: 1 }, { unique: true });
db.products.createIndex({ name: 'text', description: 'text' });

// Create categories collection
db.createCollection('categories');
db.categories.createIndex({ tenantId: 1, parentId: 1 });

// Create orders collection
db.createCollection('orders');
db.orders.createIndex({ tenantId: 1, storeId: 1, createdAt: -1 });
db.orders.createIndex({ tenantId: 1, orderNumber: 1 }, { unique: true });
db.orders.createIndex({ tenantId: 1, customerId: 1, createdAt: -1 });
db.orders.createIndex({ tenantId: 1, status: 1 });

// Create customers collection
db.createCollection('customers');
db.customers.createIndex({ tenantId: 1, phone: 1 }, { unique: true });
db.customers.createIndex({ tenantId: 1, email: 1 });

// Create inventory collection
db.createCollection('inventory');
db.inventory.createIndex({ tenantId: 1, storeId: 1 });
db.inventory.createIndex({ tenantId: 1, ingredientId: 1 });

// Create stock movements collection (time-series)
db.createCollection('stockMovements');
db.stockMovements.createIndex({ tenantId: 1, storeId: 1, timestamp: -1 });
db.stockMovements.createIndex({ tenantId: 1, ingredientId: 1, timestamp: -1 });

// Create analytics snapshots collection (time-series)
db.createCollection('analyticsSnapshots');
db.analyticsSnapshots.createIndex({ tenantId: 1, storeId: 1, date: -1 });

// Create stores collection
db.createCollection('stores');
db.stores.createIndex({ tenantId: 1, code: 1 }, { unique: true });

// Create tenants collection
db.createCollection('tenants');
db.tenants.createIndex({ slug: 1 }, { unique: true });

print('MongoDB initialization complete');
print('Created collections and indexes for POS System');

