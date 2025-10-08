import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  STORE_MANAGER = 'store_manager',
  CASHIER = 'cashier',
  INVENTORY_MANAGER = 'inventory_manager',
  ACCOUNTANT = 'accountant',
  VIEWER = 'viewer',
}

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    required: true,
    enum: UserRole,
    default: UserRole.CASHIER,
  })
  role: UserRole;

  @Prop({ required: true, type: Types.ObjectId, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, index: true })
  storeId?: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  lastLogin?: Date;

  @Prop({ type: Object })
  twoFactorSecret?: {
    enabled: boolean;
    secret?: string;
    backupCodes?: string[];
  };

  @Prop({ type: [String], default: [] })
  refreshTokens: string[];

  // Virtual for full name
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Method to compare passwords
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes
UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });
UserSchema.index({ tenantId: 1, role: 1 });
UserSchema.index({ email: 1 });

// Pre-save middleware to hash password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add method to schema
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for fullName
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});


