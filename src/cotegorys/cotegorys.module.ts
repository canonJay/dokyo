import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UsersModule } from 'src/users/users.module'
import { CotegorysController } from './cotegorys.controller'
import { CotegorysService } from './cotegorys.service'

@Module({
  imports: [UsersModule],
  controllers: [CotegorysController],
  providers: [CotegorysService, PrismaService],
})
export class CotegorysModule {}
