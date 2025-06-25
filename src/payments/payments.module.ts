import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { PaymentsService } from './payments.service'

@Module({
  imports: [HttpModule],
  providers: [PaymentsService, PrismaService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
