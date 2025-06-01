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
            connect: createProductDto.categoryIds.map(category => ({ id: category })),
          },
          tags: {
            connect: createProductDto.tagIds.map(tag => ({ id: tag })),
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
            connect: updateProductDto.categoryIds.map(category => ({ id: category })),
          },
          tags: {
            connect: updateProductDto.tagIds.map(tag => ({ id: tag })),
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
      return product
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
