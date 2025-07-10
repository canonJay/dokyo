import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {

  constructor(private prisma: PrismaService) {}

  async getAdmin(email: string) {
    try {
      if (!email) {
        throw new BadRequestException('Email is required')
      }
      const user = await this.prisma.user.findUnique({
        where: { email },
      })
      if (!user) {
        throw new BadRequestException('User not found')
      }
      return await this.prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          role: createUserDto.isSuccess ? "SALLER" : "USER"
        },
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async verifyUser(id: string) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: { isVerified: true },
      })
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findAll() {
    try {
      return await this.prisma.user.findMany()
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      })
      if (!user) {
        throw new BadRequestException('User not found')
      }
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async findById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          reviews: true,
          products: true,
          chats: true,
          payments: true
        }
      })
      if (!user) {
        throw new BadRequestException('User not found')
      }
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async publicFindById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          reviews: true,
          products: true,
          payments: true
        }
      })
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async update(updateUserDto: UpdateUserDto, userId: string) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: updateUserDto,
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async adminUpdate(updateUserDto: UpdateUserDto, userId: string) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: updateUserDto,
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      })
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async ban(id: string) {
    try {
      const user = await this.prisma.user.update({ where: { id }, data: { isBanned: true } })
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async unban(id: string) {
    try {
      const user = await this.prisma.user.update({ where: { id }, data: { isBanned: false } })
      return user
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async makeAdmin(id: string) {
    try {
      const user = await this.prisma.user.update({ where: { id }, data: { role: 'ADMIN' } })
      return user
    } catch (error) {
      throw new BadRequestException(error)
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
      throw new BadRequestException(error)
    }
  }

  async userProductsStatistics(id: string) {
    try {
      const stats = await this.prisma.product.aggregate({ where: { userId: id }, _count: { _all: true } })
      return stats._count._all || 0
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async userReviewsStatistics(id: string) {
    try {
      const stats = await this.prisma.review.aggregate({ where: { userId: id }, _count: { _all: true } })
      return stats._count._all || 0
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async userReviews(id: string) {
    try {
      const reviews = await this.prisma.review.findMany({ where: { userId: id } })
      return reviews
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async userProducts(id: string) {
    try {
      const products = await this.prisma.product.findMany({ where: { userId: id } })
      return products
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async userPayments(id: string) {
    try {
      const payments = await this.prisma.payment.findMany({ where: { userId: id }, select: {
        id: true,
        amount: true,
        createdAt: true,
        updatedAt: true,
      } })
      return payments
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

}
