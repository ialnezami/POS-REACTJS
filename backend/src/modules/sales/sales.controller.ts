import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { CurrentUser } from '@common/decorators/current-user.decorator';

@ApiTags('sales')
@Controller({ path: 'sales', version: '1' })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({ status: 201, description: 'Sale created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - insufficient stock' })
  async create(@Body() createSaleDto: CreateSaleDto, @CurrentUser() user: any) {
    return await this.salesService.create(createSaleDto, user.tenantId, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sales' })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiResponse({ status: 200, description: 'Sales retrieved successfully' })
  async findAll(
    @CurrentUser() user: any,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('status') status?: string,
  ) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return await this.salesService.findAll(user.tenantId, start, end, status);
  }

  @Get('daily-summary')
  @ApiOperation({ summary: 'Get daily sales summary' })
  @ApiQuery({ name: 'date', required: false })
  @ApiResponse({ status: 200, description: 'Daily summary retrieved' })
  async getDailySummary(@CurrentUser() user: any, @Query('date') date?: string) {
    const targetDate = date ? new Date(date) : undefined;
    return await this.salesService.getDailySummary(user.tenantId, targetDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sale by ID' })
  @ApiResponse({ status: 200, description: 'Sale retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Sale not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.salesService.findOne(id, user.tenantId);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a sale' })
  @ApiResponse({ status: 200, description: 'Sale cancelled successfully' })
  @ApiResponse({ status: 400, description: 'Sale already cancelled' })
  async cancel(@Param('id') id: string, @CurrentUser() user: any) {
    return await this.salesService.cancelSale(id, user.tenantId);
  }
}

