import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { S3Service } from 'src/s3/s3.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, S3Service],
  exports: [UsersService],
})
export class UsersModule {}
