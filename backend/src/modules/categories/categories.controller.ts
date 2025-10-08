import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('categories')
@Controller({ path: 'categories', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user: any) {
    return await this.categoriesService.create(createCategoryDto, user.tenantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async findAll(
    @CurrentUser() user: any,
    @Query('includeInactive') includeInactive?: boolean,
  ) {
    return await this.categoriesService.findAll(user.tenantId, includeInactive);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree hierarchy' })
  @ApiResponse({ status: 200, description: 'Category tree retrieved successfully' })
  async getCategoryTree(@CurrentUser() user: any) {
    return await this.categoriesService.getCategoryTree(user.tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.categoriesService.findOne(id, user.tenantId);
  }

  @Get(':id/path')
  @ApiOperation({ summary: 'Get category path' })
  @ApiResponse({ status: 200, description: 'Category path retrieved successfully' })
  async getCategoryPath(@Param('id') id: string, @CurrentUser() user: any) {
    const path = await this.categoriesService.getCategoryPath(id, user.tenantId);
    return { path };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @CurrentUser() user: any,
  ) {
    return await this.categoriesService.update(id, user.tenantId, updateCategoryDto);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Move category to new parent' })
  @ApiResponse({ status: 200, description: 'Category moved successfully' })
  async moveCategory(
    @Param('id') id: string,
    @Body('newParentId') newParentId: string | null,
    @CurrentUser() user: any,
  ) {
    return await this.categoriesService.moveCategory(id, newParentId, user.tenantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 400, description: 'Cannot delete category with subcategories' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    await this.categoriesService.remove(id, user.tenantId);
    return { message: 'Category deleted successfully' };
  }
}

