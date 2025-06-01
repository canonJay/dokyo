import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { isDevEnv } from './libs/common/utils/is-dev'
import { PrismaService } from './prisma.service'
import { UsersModule } from './users/users.module'
import { ProductsModule } from './products/products.module';
import { CotegorysModule } from './cotegorys/cotegorys.module';
import { TagsModule } from './tags/tags.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [UsersModule, ConfigModule.forRoot({
    ignoreEnvFile: !isDevEnv,
    isGlobal: true,
  }), AuthModule, ProductsModule, CotegorysModule, TagsModule, ReviewsModule], 
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
