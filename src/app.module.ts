import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AdminModule } from './admin/admin.module'
import { AuthModule } from './auth/auth.module'
import { CotegorysModule } from './cotegorys/cotegorys.module'
import { isDevEnv } from './libs/common/utils/is-dev'
import { MailerModule } from './mailer/mailer.module'
import { PaymentsModule } from './payments/payments.module'
import { PrismaService } from './prisma.service'
import { ProductsModule } from './products/products.module'
import { ReviewsModule } from './reviews/reviews.module'
import { TagsModule } from './tags/tags.module'
import { UsersModule } from './users/users.module'
import { MessagesModule } from './messages/messages.module';
import { ChatsModule } from './chats/chats.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [UsersModule, ConfigModule.forRoot({
    ignoreEnvFile: !isDevEnv,
    isGlobal: true,
  }), AuthModule, ProductsModule, CotegorysModule, TagsModule, ReviewsModule, AdminModule, PaymentsModule, MailerModule, MessagesModule, ChatsModule, OrdersModule], 
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
