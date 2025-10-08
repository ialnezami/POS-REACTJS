import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Sale, SaleItem } from './schemas/sale.schema';
import { CreateSaleDto } from './dto/create-sale.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name)
    private saleModel: Model<Sale>,
    private productsService: ProductsService,
  ) {}

  private async generateSaleNumber(tenantId: string): Promise<string> {
    const count = await this.saleModel.countDocuments({
      tenantId: new Types.ObjectId(tenantId),
    });
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    return `SALE-${dateStr}-${String(count + 1).padStart(6, '0')}`;
  }

  async create(createSaleDto: CreateSaleDto, tenantId: string, userId?: string): Promise<Sale> {
    // Validate and fetch products
    const saleItems: SaleItem[] = [];
    let subtotal = 0;

    for (const item of createSaleDto.items) {
      const product = await this.productsService.findOne(item.productId, tenantId);

      // Check stock availability
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product: ${product.name}. Available: ${product.stock}`,
        );
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      saleItems.push({
        productId: new Types.ObjectId(item.productId),
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: itemSubtotal,
      });

      // Decrease stock
      await this.productsService.updateStock(item.productId, tenantId, -item.quantity);
    }

    // Calculate totals
    const discount = createSaleDto.discount || 0;
    const tax = (subtotal - discount) * 0.1; // 10% tax
    const total = subtotal - discount + tax;

    // Generate sale number
    const saleNumber = await this.generateSaleNumber(tenantId);

    // Create sale
    const sale = new this.saleModel({
      saleNumber,
      items: saleItems,
      subtotal,
      tax,
      discount,
      total,
      paymentMethod: createSaleDto.paymentMethod,
      customerName: createSaleDto.customerName,
      notes: createSaleDto.notes,
      tenantId: new Types.ObjectId(tenantId),
      cashierId: userId ? new Types.ObjectId(userId) : undefined,
    });

    return await sale.save();
  }

  async findAll(
    tenantId: string,
    startDate?: Date,
    endDate?: Date,
    status?: string,
  ): Promise<Sale[]> {
    const query: any = { tenantId: new Types.ObjectId(tenantId) };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = startDate;
      if (endDate) query.createdAt.$lte = endDate;
    }

    if (status) {
      query.status = status;
    }

    return await this.saleModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, tenantId: string): Promise<Sale> {
    const sale = await this.saleModel
      .findOne({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .exec();

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }

  async getDailySummary(tenantId: string, date?: Date): Promise<any> {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const sales = await this.saleModel.find({
      tenantId: new Types.ObjectId(tenantId),
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelled' },
    });

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalDiscount = sales.reduce((sum, sale) => sum + (sale.discount || 0), 0);
    const totalTax = sales.reduce((sum, sale) => sum + sale.tax, 0);

    return {
      date: targetDate,
      totalSales,
      totalRevenue,
      totalDiscount,
      totalTax,
      averageSale: totalSales > 0 ? totalRevenue / totalSales : 0,
    };
  }

  async cancelSale(id: string, tenantId: string): Promise<Sale> {
    const sale = await this.findOne(id, tenantId);

    if (sale.status === 'cancelled') {
      throw new BadRequestException('Sale is already cancelled');
    }

    // Restore stock for all items
    for (const item of sale.items) {
      await this.productsService.updateStock(
        item.productId.toString(),
        tenantId,
        item.quantity,
      );
    }

    sale.status = 'cancelled' as any;
    return await sale.save();
  }
}

