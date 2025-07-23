import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { PaymentsController } from './payments.controller'
import { PaymentsService } from './payments.service'
import { S3Service } from 'src/s3/s3.service'

@Module({
  imports: [HttpModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, S3Service],
  exports: [PaymentsService],
})
export class PaymentsModule {}
