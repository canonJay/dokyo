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
    return this.prisma.user.findUnique({
      where: { id },
    })
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
}
