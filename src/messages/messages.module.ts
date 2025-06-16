import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { WsAuthGuard } from 'src/auth/guards/ws-auth.guard'
import { PrismaService } from 'src/prisma.service'
import { UsersService } from 'src/users/users.service'
import { MessagesGateway } from './messages.gateway'
import { MessagesService } from './messages.service'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    MessagesGateway, 
    MessagesService, 
    PrismaService, 
    UsersService,
    WsAuthGuard
  ],
})
export class MessagesModule {}
