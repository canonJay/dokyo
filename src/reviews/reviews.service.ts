import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, userId: string) {
    try {
      const review = await this.prisma.review.create({
        data: {
          text: createReviewDto.text,
          rating: createReviewDto.rating,
          user: {
            connect: { id: userId },
          },
          product: {
            connect: { id: createReviewDto.productId },
          },
        },
      })
      return review
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async getProductReviews(productId: string) {
    try {
      const reviews = await this.prisma.review.findMany({ where: { productId } })
      return reviews
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      const reviews = await this.prisma.review.findMany()
      return reviews
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      const review = await this.prisma.review.findUnique({ where: { id } })
      return review
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string) {
    try {
      const review = await this.prisma.review.update({ where: { id, userId }, data: updateReviewDto })
      return review
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string, userId: string) {
    try {
      const review = await this.prisma.review.delete({ where: { id, userId } })
      return review
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
