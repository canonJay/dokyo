import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateCotegoryDto } from './dto/create-cotegory.dto'
import { UpdateCotegoryDto } from './dto/update-cotegory.dto'

@Injectable()
export class CotegorysService {
  constructor(private readonly prisma: PrismaService) {}

  
  async create(createCotegoryDto: CreateCotegoryDto) {
    try {
      const category = await this.prisma.category.create({
        data: {
          name: createCotegoryDto.name,
          products: {
            connect: (createCotegoryDto.products ?? []).map(prrduct => ({ id: prrduct })),
          },
        },
        select: {
          name: true, 
          products: true
        }
      })
      return category
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      const categories = await this.prisma.category.findMany()
      return categories
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
      })
      return category
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, updateCotegoryDto: UpdateCotegoryDto) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: {
          name: updateCotegoryDto.name,
          products: {
            connect: (updateCotegoryDto.products ?? []).map(prrduct => ({ id: prrduct })),
          },
        },
      })
      return category
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async addProductToCategory(id: string, productId: string) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: {
          products: {
            connect: { id: productId },
          },
        },
      })
      return category
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  
  async removeProductFromCategory(id: string, productId: string) {
    try {
      const category = await this.prisma.category.update({
        where: { id },
        data: {
          products: {
            disconnect: { id: productId },
          },
        },
      })
      return category
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      const category = await this.prisma.category.delete({
        where: { id },
      })
      return category
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
