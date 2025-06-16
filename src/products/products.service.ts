import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, userId: string) {
    try {
      const product = await this.prisma.product.create({
        data: {
          title: createProductDto.title, 
          description: createProductDto.description,
          price: createProductDto.price,
          images: createProductDto.images,
          category: {
            connect: (createProductDto.categoryIds ?? []).map(category => ({ id: category })),
          },
          tags: {
            connect: (createProductDto.tagIds ?? []).map(tag => ({ id: tag })),
          },
          user: {
            connect: { id: userId },
          },
        },
      })

      return product
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      const products = await this.prisma.product.findMany()
      return products
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findBySellerId(sellerId: string) {
    try {
      const products = await this.prisma.product.findMany({ where: { userId: sellerId } })
      return products
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
      })
      return product
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto, userId: string) {
    try {
      const product = await this.prisma.product.update({
        where: { id, userId },
        data: {
          ...updateProductDto,
          category: {
            connect: (updateProductDto.categoryIds ?? []).map(category => ({ id: category })),
          },
          tags: {
            connect: (updateProductDto.tagIds ?? []).map(tag => ({ id: tag })),
          },
        },
      })
      return product
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string, userId: string) {
    try {
      const product = await this.prisma.product.delete({
        where: { id, userId },
      })
      return true
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async productPaymentsStatistics(id: string) {
		try {
			const stats = await this.prisma.payment.aggregate({
				where: { productId: id },
				_sum: { amount: true },
				_count: { _all: true },
				_avg: { amount: true },
			})

			const totalAmount = stats._sum.amount || 0
			const totalPayments = stats._count._all || 0
			const averageAmount = stats._avg.amount || 0
			return { totalAmount, totalPayments, averageAmount }
		} catch (error) {
			throw new Error(error)
		}
	}

	// ... existing code ...

// Статистика по всем продуктам
async productsStatistics() {
  try {
    const totalProducts = await this.prisma.product.count();

    const avgPrice = await this.prisma.product.aggregate({
      _avg: { price: true },
    });

    const productsByCategory = await this.prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: { products: true },
        },
      },
    });

    const productsWithZeroSales = await this.prisma.product.findMany({
      where: {
        payments: { none: {} },
      },
      select: { id: true, title: true },
    });

    return {
      totalProducts,
      averagePrice: avgPrice._avg.price || 0,
      productsByCategory,
      productsWithZeroSales,
    };
  } catch (error) {
    throw new Error(error);
  }
}

// Топ-N продуктов по количеству продаж
async topProductsBySales(count: number = 5) {
  try {
    const topProducts = await this.prisma.product.findMany({
      orderBy: {
        payments: {
          _count: 'desc',
        },
      },
      take: count,
      include: {
        _count: {
          select: { payments: true },
        },
      },
    });
    return topProducts;
  } catch (error) {
    throw new Error(error);
  }
}

// Топ-N продуктов по сумме продаж
async topProductsBySumOfSales(count: number = 5) {
  try {
    // 1. Group payments by productId and sum the amount
    const topPayments = await this.prisma.payment.groupBy({
      by: ['productId'],
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: count,
    });

    // 2. Fetch product details for these productIds
    const productIds = topPayments.map(p => p.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds.filter(id => id !== null) as string[] } },
    });

    // 3. Merge product info with revenue
    return products.map(product => ({
      ...product,
      totalRevenue: topPayments.find(p => p.productId === product.id)?._sum.amount || 0,
    }));
  } catch (error) {
    throw new Error(error);
  }
}

// Общая статистика по платежам
async paymentsStatistics() {
  try {
    const stats = await this.prisma.payment.aggregate({
      _sum: { amount: true },
      _count: { _all: true },
      _avg: { amount: true },
    });

    const successStats = await this.prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
      _count: { _all: true },
    });

    const failedStats = await this.prisma.payment.aggregate({
      where: { status: 'FAILED' },
      _sum: { amount: true },
      _count: { _all: true },
    });

    return {
      totalAmount: stats._sum.amount || 0,
      totalPayments: stats._count._all || 0,
      averageAmount: stats._avg.amount || 0,
      success: {
        count: successStats._count._all || 0,
        amount: successStats._sum.amount || 0,
      },
      failed: {
        count: failedStats._count._all || 0,
        amount: failedStats._sum.amount || 0,
      },
    };
  } catch (error) {
    throw new Error(error);
  }
}
}
