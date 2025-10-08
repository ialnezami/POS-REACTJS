import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, tenantId: string): Promise<Category> {
    // Validate parent exists if provided
    if (createCategoryDto.parentId) {
      const parent = await this.categoryModel.findOne({
        _id: new Types.ObjectId(createCategoryDto.parentId),
        tenantId: new Types.ObjectId(tenantId),
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }

      // Check for circular reference
      await this.checkCircularReference(createCategoryDto.parentId, tenantId);
    }

    const category = new this.categoryModel({
      ...createCategoryDto,
      tenantId: new Types.ObjectId(tenantId),
      parentId: createCategoryDto.parentId
        ? new Types.ObjectId(createCategoryDto.parentId)
        : undefined,
    });

    return await category.save();
  }

  async findAll(tenantId: string, includeInactive = false): Promise<Category[]> {
    const query: any = { tenantId: new Types.ObjectId(tenantId) };

    if (!includeInactive) {
      query.isActive = true;
    }

    return await this.categoryModel
      .find(query)
      .sort({ displayOrder: 1, name: 1 })
      .exec();
  }

  async findOne(id: string, tenantId: string): Promise<Category> {
    const category = await this.categoryModel
      .findOne({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(
    id: string,
    tenantId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    // If updating parent, validate it
    if (updateCategoryDto.parentId) {
      const parent = await this.categoryModel.findOne({
        _id: new Types.ObjectId(updateCategoryDto.parentId),
        tenantId: new Types.ObjectId(tenantId),
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }

      // Check for circular reference
      await this.checkCircularReference(updateCategoryDto.parentId, tenantId, id);
    }

    const category = await this.categoryModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          tenantId: new Types.ObjectId(tenantId),
        },
        {
          $set: {
            ...updateCategoryDto,
            parentId: updateCategoryDto.parentId
              ? new Types.ObjectId(updateCategoryDto.parentId)
              : undefined,
          },
        },
        { new: true },
      )
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async remove(id: string, tenantId: string): Promise<void> {
    // Check if category has children
    const childrenCount = await this.categoryModel.countDocuments({
      parentId: new Types.ObjectId(id),
      tenantId: new Types.ObjectId(tenantId),
    });

    if (childrenCount > 0) {
      throw new BadRequestException(
        'Cannot delete category with subcategories. Delete subcategories first.',
      );
    }

    const result = await this.categoryModel
      .deleteOne({
        _id: new Types.ObjectId(id),
        tenantId: new Types.ObjectId(tenantId),
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Category not found');
    }
  }

  async getCategoryTree(tenantId: string): Promise<Category[]> {
    const categories = await this.findAll(tenantId, false);
    return this.buildTree(categories);
  }

  private buildTree(categories: Category[], parentId?: Types.ObjectId): Category[] {
    const tree: Category[] = [];

    for (const category of categories) {
      const categoryParentId = category.parentId?.toString();
      const targetParentId = parentId?.toString();

      if (
        (categoryParentId === targetParentId) ||
        (!categoryParentId && !targetParentId)
      ) {
        const children = this.buildTree(categories, category._id as Types.ObjectId);
        if (children.length > 0) {
          (category as any).children = children;
        }
        tree.push(category);
      }
    }

    return tree;
  }

  private async checkCircularReference(
    parentId: string,
    tenantId: string,
    currentId?: string,
  ): Promise<void> {
    let current = parentId;
    const visited = new Set<string>();

    while (current) {
      if (current === currentId) {
        throw new BadRequestException('Circular reference detected in category hierarchy');
      }

      if (visited.has(current)) {
        break;
      }

      visited.add(current);

      const parent = await this.categoryModel.findOne({
        _id: new Types.ObjectId(current),
        tenantId: new Types.ObjectId(tenantId),
      });

      if (!parent || !parent.parentId) {
        break;
      }

      current = parent.parentId.toString();
    }
  }

  async moveCategory(
    id: string,
    newParentId: string | null,
    tenantId: string,
  ): Promise<Category> {
    if (newParentId) {
      await this.checkCircularReference(newParentId, tenantId, id);
    }

    const category = await this.categoryModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
          tenantId: new Types.ObjectId(tenantId),
        },
        {
          $set: {
            parentId: newParentId ? new Types.ObjectId(newParentId) : null,
          },
        },
        { new: true },
      )
      .exec();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async getCategoryPath(id: string, tenantId: string): Promise<string> {
    const category = await this.findOne(id, tenantId);
    return await (category as any).getCategoryPath();
  }
}

