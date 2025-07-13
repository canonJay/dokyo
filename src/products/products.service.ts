import { BadRequestException, Injectable } from '@nestjs/common'
import { ProductStutus } from 'prisma/generated/prisma'
import { PrismaService } from 'src/prisma.service'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto, UpdateProductDtoForApprove, UpdateStutusDto } from './dto/update-product.dto'

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
        include: {
          category: true,
          tags: true,
        }
      },
    )

      return product
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(stutus?: string) {
    try {
      return await this.prisma.product.findMany({
        where: stutus ? { stutus: stutus as ProductStutus } : undefined,
        include: {
          category: true,
          tags: true,
        }
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findManyByIds(productsIds: string[]){
    try{
      const products = await this.prisma.product.findMany({
        where: {
          id: {
            in: productsIds
          }
        },
        include: {
          category: true,
          tags: true,
        }
      })

      return products
    }catch(error){
      return new BadRequestException("продукты не найдены")
    }
  }

  async getAllModerationProducts(){
    try{
      return await this.prisma.product.findMany({where:{stutus: "PENDING"}},
        
      )
    }catch(error) {
      return new BadRequestException(error)
    }
  }
  

  async getModerationProductById(id: string){ 
    try{
      return await this.prisma.product.findUnique({
        where: {
          id
        },
        include: {
          category: true,
          tags: true,
        }
      })
    }catch(error){
      return new BadRequestException(error)
    }
  }

  async updateStutusById(id: string, updateStutusDto: UpdateStutusDto) {
    try{
      return await this.prisma.product.update({
        where: {id},
        data: { stutus: updateStutusDto.stutus },
        include: {
          category: true,
          tags: true,
        }
      })
    }catch(error){
      return new BadRequestException(error)
    }
  }

  async updateStutusByIdForSaller(id: string, updateProductDtoForApprove: UpdateProductDtoForApprove){
    try{
      return await this.prisma.product.update({
        where: {id},
        data: {
          ...updateProductDtoForApprove,
          stutus: "PENDING"
        },
        include: {
          category: true,
          tags: true,
        }
      })
    }catch(error){
      return new BadRequestException(error)
    }
  }

  async findBySellerId(sellerId: string) {
    try {
      const products = await this.prisma.product.findMany({ where: { userId: sellerId },
        include: {
          category: true,
          tags: true,
        } })
      return products
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          tags: true,
        }
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
        include: {
          category: true,
          tags: true,
        }
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
}
