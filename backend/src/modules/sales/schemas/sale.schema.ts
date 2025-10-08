import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  MOBILE = 'mobile',
  OTHER = 'other',
}

export class SaleItem {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ required: true })
  productName: string;

  @Prop({ required: true, type: Number, min: 1 })
  quantity: number;

  @Prop({ required: true, type: Number, min: 0 })
  unitPrice: number;

  @Prop({ required: true, type: Number, min: 0 })
  subtotal: number;

  @Prop({ type: Number, default: 0 })
  discount?: number;
}

@Schema({
  timestamps: true,
  collection: 'sales',
})
export class Sale extends Document {
  @Prop({ required: true, unique: true })
  saleNumber: string;

  @Prop({ required: true, type: [Object] })
  items: SaleItem[];

  @Prop({ required: true, type: Number, min: 0 })
  subtotal: number;

  @Prop({ type: Number, default: 0, min: 0 })
  tax: number;

  @Prop({ type: Number, default: 0, min: 0 })
  discount: number;

  @Prop({ required: true, type: Number, min: 0 })
  total: number;

  @Prop({
    required: true,
    enum: SaleStatus,
    default: SaleStatus.COMPLETED,
  })
  status: SaleStatus;

  @Prop({
    required: true,
    enum: PaymentMethod,
    default: PaymentMethod.CASH,
  })
  paymentMethod: PaymentMethod;

  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, index: true })
  storeId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  cashierId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Customer' })
  customerId?: Types.ObjectId;

  @Prop({ type: String })
  customerName?: string;

  @Prop({ type: String })
  notes?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

// Indexes
SaleSchema.index({ tenantId: 1, saleNumber: 1 }, { unique: true });
SaleSchema.index({ tenantId: 1, status: 1 });
SaleSchema.index({ tenantId: 1, createdAt: -1 });
SaleSchema.index({ cashierId: 1 });

