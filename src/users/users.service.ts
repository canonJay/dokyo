import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    })
  }

  verifyUser(id: string) {
    
    const user = this.prisma.user.update({
      where: { id },
      data: { isVerified: true },
    })

    return user
  }

  findAll() {
    return this.prisma.user.findMany()
  }

  findByEmail(email: string) {
    const user = this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new BadRequestException('User not found')
    }

    return user
  }

  findById(id: string) {
    const user = this.prisma.user.findUnique({
      where: { id },
    })

		if (!user) {
      throw new BadRequestException('User not found')
    }

    return user
  }

  update(id: string, updateUserDto: UpdateUserDto, userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateUserDto,
    })
  }

  remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    })
  }

	async ban(id: string) {
		try {
			const user = await this.prisma.user.update({ where: { id }, data: { isBanned: true } })
			return user
		} catch (error) {
			throw new Error(error)
		}
	}

	async unban(id: string) {
		try {
			const user = await this.prisma.user.update({ where: { id }, data: { isBanned: false } })
			return user
		} catch (error) {
			throw new Error(error)
		}
	}

	async makeAdmin(id: string) {
		try {
			const user = await this.prisma.user.update({ where: { id }, data: { role: 'ADMIN' } })
			return user
		} catch (error) {
			throw new Error(error)
		}
	}

	async userPaymentsStatistics(id: string) {
		try {
			const stats = await this.prisma.payment.aggregate({ where: { userId: id }, _sum: { amount: true }, _count: { _all: true }, _avg: { amount: true } })
			const totalAmount = stats._sum.amount || 0
			const totalPayments = stats._count._all || 0
			const averageAmount = stats._avg.amount || 0
			return { totalAmount, totalPayments, averageAmount }
		} catch (error) {
			throw new Error(error)
		}
	}

	async userProductsStatistics(id: string) {
		try {
			const stats = await this.prisma.product.aggregate({ where: { userId: id }, _count: { _all: true } })
			return stats._count._all || 0
		} catch (error) {
			throw new Error(error)
		}
	}	

	async userReviewsStatistics(id: string) {
		try {
			const stats = await this.prisma.review.aggregate({ where: { userId: id }, _count: { _all: true } })
			return stats._count._all || 0
		} catch (error) {
			throw new Error(error)
		}
	}

	async userReviews(id: string) {
		try {
			const reviews = await this.prisma.review.findMany({ where: { userId: id } })
			return reviews
		} catch (error) {
			throw new Error(error)
		}
	}

	async userProducts(id: string) {
		try {
			const products = await this.prisma.product.findMany({ where: { userId: id } })
			return products
		} catch (error) {
			throw new Error(error)
		}
	}

	async userPayments(id: string) {
		try {
			const payments = await this.prisma.payment.findMany({ where: { userId: id }, select: {
				id: true,
				amount: true,
				createdAt: true,
				updatedAt: true,
				product: { select: { id: true, title: true, price: true, description: true, images: true, category: { select: { id: true, name: true } } } }
			} })
			return payments
		} catch (error) {
			throw new Error(error)
		}
	}

}
