import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const tag = await this.prisma.tag.create({
        data: {
          name: createTagDto.name,
          products: { connect: createTagDto.productId.map((id) => ({ id })) },
        },
      })
      return tag
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      const tags = await this.prisma.tag.findMany()
      return tags
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      const tag = await this.prisma.tag.findUnique({ where: { id } })
      return tag
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    try {
      const tag = await this.prisma.tag.update({ where: { id }, data: updateTagDto })
      return tag
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      const tag = await this.prisma.tag.delete({ where: { id } })
      return tag
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
