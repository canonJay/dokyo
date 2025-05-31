import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { isDevEnv } from './libs/common/utils/is-dev'
import { PrismaService } from './prisma.service'
import { UsersModule } from './users/users.module'

@Module({
  imports: [UsersModule, ConfigModule.forRoot({
    ignoreEnvFile: !isDevEnv,
    isGlobal: true,
  }), AuthModule], 
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
