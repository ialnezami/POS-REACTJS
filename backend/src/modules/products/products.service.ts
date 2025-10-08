import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product, ProductStatus } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, tenantId: string): Promise<Product> {
    // Check if SKU already exists for this tenant
    const existingProduct = await this.productModel.findOne({
      tenantId: new Types.ObjectId(tenantId),
      sku: createProductDto.sku,
    });

    if (existingProduct) {
      throw new ConflictException('Product with this SKU already exists');
    }

    const product = new this.productModel({
      ...createProductDto,
      tenantId: new Types.ObjectId(tenantId),
    });
    
    return await product.save();
  }

  async findAll(tenantId: string, status?: ProductStatus, category?: string): Promise<Product[]> {
    const query: any = { tenantId: new Types.ObjectId(tenantId) };
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }

    return await this.productModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string, tenantId: string): Promise<Product> {
    const product = await this.productModel
      .findOne({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, tenantId: string, updateProductDto: UpdateProductDto): Promise<Product> {
    // If updating SKU, check for conflicts
    if (updateProductDto.sku) {
      const existingProduct = await this.productModel.findOne({
        tenantId: new Types.ObjectId(tenantId),
        sku: updateProductDto.sku,
        _id: { $ne: new Types.ObjectId(id) },
      });

      if (existingProduct) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    const product = await this.productModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          tenantId: new Types.ObjectId(tenantId),
        },
        { $set: updateProductDto },
        { new: true },
      )
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const result = await this.productModel
      .deleteOne({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  async updateStock(id: string, tenantId: string, quantity: number): Promise<Product> {
    const product = await this.productModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          tenantId: new Types.ObjectId(tenantId),
        },
        { $inc: { stock: quantity } },
        { new: true },
      )
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Update status based on stock
    if (product.stock <= 0) {
      product.status = ProductStatus.OUT_OF_STOCK;
      await product.save();
    } else if (product.status === ProductStatus.OUT_OF_STOCK) {
      product.status = ProductStatus.ACTIVE;
      await product.save();
    }

    return product;
  }

  async search(tenantId: string, searchTerm: string): Promise<Product[]> {
    return await this.productModel
      .find({
        tenantId: new Types.ObjectId(tenantId),
        $text: { $search: searchTerm },
      })
      .exec();
  }

  async getCategories(tenantId: string): Promise<string[]> {
    const categories = await this.productModel
      .distinct('category', { tenantId: new Types.ObjectId(tenantId) })
      .exec();
    return categories;
  }
}

