import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
}

export class ProductVariant {
  @Prop({ required: true })
  name: string; // e.g., "Size", "Temperature"

  @Prop({ required: true, type: [Object] })
  options: Array<{
    name: string; // e.g., "Small", "Medium", "Large"
    priceAdjustment: number; // e.g., 0, 0.50, 1.00
    sku?: string;
    isDefault?: boolean;
  }>;

  @Prop({ type: Boolean, default: true })
  required: boolean;
}

export class ProductModifier {
  @Prop({ required: true })
  name: string; // e.g., "Add-ons", "Toppings"

  @Prop({ required: true, type: [Object] })
  options: Array<{
    name: string; // e.g., "Extra Shot", "Whipped Cream"
    price: number;
    cost?: number;
    isDefault?: boolean;
  }>;

  @Prop({ type: Boolean, default: false })
  required: boolean;

  @Prop({ type: Boolean, default: false })
  multipleSelection: boolean;

  @Prop({ type: Number, default: 1 })
  maxSelections: number;
}

export class PricingRule {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['time-based', 'quantity-based', 'customer-group'] })
  type: string;

  @Prop({ type: Object })
  conditions: {
    startTime?: string; // e.g., "09:00"
    endTime?: string; // e.g., "11:00"
    days?: string[]; // e.g., ["monday", "tuesday"]
    minQuantity?: number;
    customerGroup?: string;
  };

  @Prop({ type: Number })
  discountPercentage?: number;

  @Prop({ type: Number })
  discountAmount?: number;

  @Prop({ type: Number })
  newPrice?: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Date })
  startDate?: Date;

  @Prop({ type: Date })
  endDate?: Date;

  @Prop({ type: Number, default: 0 })
  priority: number;
}

export class RecipeIngredient {
  @Prop({ required: true, type: Types.ObjectId })
  ingredientId: Types.ObjectId;

  @Prop({ required: true })
  ingredientName: string;

  @Prop({ required: true, type: Number })
  quantity: number;

  @Prop({ required: true })
  unit: string; // e.g., "oz", "ml", "g"

  @Prop({ type: Number })
  cost?: number;
}

@Schema({
  timestamps: true,
  collection: 'products',
})
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  categoryId?: Types.ObjectId;

  @Prop({ required: true, type: Number, min: 0, default: 0 })
  stock: number;

  @Prop({ required: true, unique: true })
  sku: string;

  @Prop({ type: String })
  barcode?: string;

  @Prop({
    required: true,
    enum: ProductStatus,
    default: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, index: true })
  storeId?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  cost?: number;

  @Prop({ type: Number, default: 0 })
  taxRate?: number;

  @Prop({ type: Boolean, default: true })
  trackInventory: boolean;

  @Prop({ type: Number, default: 10 })
  lowStockThreshold: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: [Object], default: [] })
  variants: ProductVariant[];

  @Prop({ type: [Object], default: [] })
  modifiers: ProductModifier[];

  @Prop({ type: [Object], default: [] })
  pricingRules: PricingRule[];

  @Prop({ type: [Object], default: [] })
  recipe: RecipeIngredient[];

  @Prop({ type: Boolean, default: false })
  isFeatured: boolean;

  @Prop({ type: Number, default: 0 })
  displayOrder: number;

  @Prop({ type: Number, default: 0 })
  preparationTime: number; // in minutes

  @Prop({ type: Object })
  nutritionalInfo?: {
    calories?: number;
    protein?: number;
    fat?: number;
    carbs?: number;
    servingSize?: string;
  };

  @Prop({ type: [String], default: [] })
  allergens: string[];

  @Prop({ type: Number, default: 0 })
  viewCount: number;

  @Prop({ type: Number, default: 0 })
  orderCount: number;

  @Prop({ type: Number, default: 0 })
  rating: number;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ tenantId: 1, sku: 1 }, { unique: true });
ProductSchema.index({ tenantId: 1, status: 1 });
ProductSchema.index({ tenantId: 1, categoryId: 1 });
ProductSchema.index({ tenantId: 1, isFeatured: 1 });
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ displayOrder: 1 });

// Pre-save hook to generate slug
ProductSchema.pre('save', async function (next) {
  if (this.isModified('name') || this.isNew) {
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    this.slug = `${baseSlug}-${Date.now()}`;
  }
  next();
});

// Method to calculate final price with active pricing rules
ProductSchema.methods.calculatePrice = function (quantity = 1) {
  let finalPrice = this.price;

  // Apply pricing rules
  const activeRules = this.pricingRules
    .filter((rule: PricingRule) => rule.isActive)
    .sort((a: PricingRule, b: PricingRule) => b.priority - a.priority);

  for (const rule of activeRules) {
    // Check if rule is valid by date
    const now = new Date();
    if (rule.startDate && now < rule.startDate) continue;
    if (rule.endDate && now > rule.endDate) continue;

    // Apply rule based on type
    if (rule.type === 'quantity-based' && rule.conditions.minQuantity) {
      if (quantity >= rule.conditions.minQuantity) {
        if (rule.discountPercentage) {
          finalPrice = finalPrice * (1 - rule.discountPercentage / 100);
        } else if (rule.discountAmount) {
          finalPrice = Math.max(0, finalPrice - rule.discountAmount);
        } else if (rule.newPrice) {
          finalPrice = rule.newPrice;
        }
        break; // Apply only first matching rule
      }
    }
    // Add more rule types as needed
  }

  return finalPrice;
};

// Method to calculate recipe cost
ProductSchema.methods.calculateRecipeCost = function () {
  return this.recipe.reduce((total: number, ingredient: RecipeIngredient) => {
    return total + (ingredient.cost || 0) * ingredient.quantity;
  }, 0);
};

