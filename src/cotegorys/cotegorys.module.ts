import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UsersModule } from 'src/users/users.module'
import { CotegorysController } from './cotegorys.controller'
import { CotegorysService } from './cotegorys.service'
import { S3Service } from 'src/s3/s3.service'

@Module({
  imports: [UsersModule],
  controllers: [CotegorysController],
  providers: [CotegorysService, PrismaService, S3Service],
})
export class CotegorysModule {}
