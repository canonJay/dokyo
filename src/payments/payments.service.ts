import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { UpdatePaymentDto } from './dto/update-payment.dto'

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const payment = await this.prisma.payment.create({ data: createPaymentDto })
      return payment
    } catch (error) {
      throw new Error(error)
    }
  }

  async findAll() {
    try {
      const payments = await this.prisma.payment.findMany()
      return payments
    } catch (error) {
      throw new Error(error)
    }
  }

  async findOne(id: string) {
    try {
      const payment = await this.prisma.payment.findUnique({ where: { id } })
      return payment
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    try {
      const payment = await this.prisma.payment.update({ where: { id }, data: updatePaymentDto })
      return payment
    } catch (error) {
      throw new Error(error)
    }
  }

  async remove(id: string) {
    try {
      const payment = await this.prisma.payment.delete({ where: { id } })
      return payment
    } catch (error) {
      throw new Error(error)
    }
  }
}
