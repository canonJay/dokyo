import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { CotegorysController } from './cotegorys.controller'
import { CotegorysService } from './cotegorys.service'

@Module({
  controllers: [CotegorysController],
  providers: [CotegorysService, PrismaService],
})
export class CotegorysModule {}
