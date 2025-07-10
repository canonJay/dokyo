import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateCotegoryDto, CreateSubcategoryDto } from './dto/create-cotegory.dto'
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

  async createSubcategory(dto: CreateSubcategoryDto) {
    try {
      const subcategory = await this.prisma.category.create({
        data: {
          name: dto.name,
          parent: { connect: { id: dto.parentId } }
        }
      });
      return subcategory;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getSubcategories(parentId: string) {
    try {
      return await this.prisma.category.findMany({
        where: { parentId }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removeSubcategory(id: string) {
    try {
      return await this.prisma.category.delete({ where: { id } });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
