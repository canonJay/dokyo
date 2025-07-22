import { Body, Controller, Delete, Get, Param, Put, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { FastifyRequest } from 'fastify'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { PaymentsService } from 'src/payments/payments.service'
import { CreateProductDto } from 'src/products/dto/create-product.dto'
import { ProductsService } from 'src/products/products.service'
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto'
import { ReviewsService } from 'src/reviews/reviews.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { UsersService } from 'src/users/users.service'

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService, private readonly reviewsService: ReviewsService, private readonly productsService: ProductsService, private readonly paymentsService: PaymentsService) {}

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить всех пользователей', description: 'Требуется роль ADMIN' })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  @Get('users')
  async getUsers() {
    return this.usersService.findAll()
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить пользователя по id', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь найден' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить пользователя', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, description: 'Пользователь обновлён' })
  @ApiResponse({ status: 400, description: 'Ошибка обновления пользователя' })
  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    return this.usersService.adminUpdate(updateUserDto, id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить пользователя', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь удалён' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Забанить пользователя', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь забанен' })
  @Put('users/:id/ban')
  async banUser(@Param('id') id: string) {
    return this.usersService.ban(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Разбанить пользователя', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь разбанен' })
  @Put('users/:id/unban')
  async unbanUser(@Param('id') id: string) {
    return this.usersService.unban(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Сделать пользователя админом', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь стал админом' })
  @Put('users/:id/make-admin')
  async makeAdmin(@Param('id') id: string) {
    return this.usersService.makeAdmin(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить отзывы пользователя', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Отзывы пользователя' })
  @Get('users/:id/reviews')
  async getUserReviews(@Param('id') id: string) {
    return this.usersService.userReviews(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить продукты пользователя', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Продукты пользователя' })
  @Get('users/:id/products')
  async getUserProducts(@Param('id') id: string) {
    return this.usersService.userProducts(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить платежи пользователя', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Платежи пользователя' })
  @Get('users/:id/payments')
  async getUserPayments(@Param('id') id: string) {
    return this.usersService.userPayments(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить статистику платежей пользователя', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Статистика платежей пользователя' })
  @Get('users/:id/payments-statistics')
  async getUserPaymentsStatistics(@Param('id') id: string) {
    return this.usersService.userPaymentsStatistics(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить статистику отзывов пользователя', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Статистика отзывов пользователя' })
  @Get('users/:id/reviews-statistics')
  async getUserReviewsStatistics(@Param('id') id: string) {
    return this.usersService.userReviewsStatistics(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить статистику продуктов пользователя', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID пользователя' })
  @ApiResponse({ status: 200, description: 'Статистика продуктов пользователя' })
  @Get('users/:id/products-statistics')
  async getUserProductsStatistics(@Param('id') id: string) {
    return this.usersService.userProductsStatistics(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все отзывы', description: 'Требуется роль ADMIN' })
  @ApiResponse({ status: 200, description: 'Список отзывов' })
  @Get('reviews')
  async getReviews() {
    return this.reviewsService.findAll()
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить отзыв по id', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiResponse({ status: 200, description: 'Отзыв найден' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @Get('reviews/:id')
  async getReview(@Param('id') id: string) {
    return this.reviewsService.findOne(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить отзыв', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 200, description: 'Отзыв обновлён' })
  @ApiResponse({ status: 400, description: 'Ошибка обновления отзыва' })
  @Put('reviews/:id')
  async updateReview(@Param('id') id: string, @Body() updateReviewDto: CreateReviewDto,@Authorized("id") userId: string) {
    return this.reviewsService.update(id, updateReviewDto, userId)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить отзыв', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiResponse({ status: 200, description: 'Отзыв удалён' })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @Delete('reviews/:id')
  async deleteReview(@Param('id') id: string, @Authorized("id") userId: string) {
    return this.reviewsService.remove(id, userId)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить отзывы по продукту', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID продукта' })
  @ApiResponse({ status: 200, description: 'Отзывы по продукту' })
  @Get('products/:id/reviews')
  async getReviewsByProductId(@Param('id') id: string) {
    return this.reviewsService.getProductReviews(id)
  }  

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все продукты', description: 'Требуется роль ADMIN' })
  @ApiResponse({ status: 200, description: 'Список продуктов' })
  @Get('products')
  async getProducts() {
    return this.productsService.findAll()
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить продукт по id', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID продукта' })
  @ApiResponse({ status: 200, description: 'Продукт найден' })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @Get('products/:id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.findOne(id)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить продукт', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID продукта' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 200, description: 'Продукт обновлён' })
  @ApiResponse({ status: 400, description: 'Ошибка обновления продукта' })
  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: CreateProductDto, @Authorized("id") userId: string, @Req() req: FastifyRequest) {
    
    const file = await req.file();
    let files = [] as Array<{ buffer: Buffer; filename: string; mimetype: string }>;
    
    if (file) {
      files = [{
        buffer: await file.toBuffer(),
        filename: file.filename,
        mimetype: file.mimetype,
      }];
    }
    return this.productsService.update(id, updateProductDto, userId, files)
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить продукт', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID продукта' })
  @ApiResponse({ status: 200, description: 'Продукт удалён' })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string, @Authorized("id") userId: string) {
    return this.productsService.remove(id, userId)
  }

  @ApiOperation({ summary: 'Получить все платежи', description: 'Требуется роль ADMIN' })
  @ApiResponse({ status: 200, description: 'Список платежей' })
  @Get('payments')
  async getPayments() {
    return this.paymentsService.findAll()
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить платёж по id', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID платежа' })
  @ApiResponse({ status: 200, description: 'Платёж найден' })
  @ApiResponse({ status: 404, description: 'Платёж не найден' })
  @Get('payments/:id')
  async getPaymentById(@Param('id') id: string) { 
    return this.paymentsService.findOne(id)
  }
}
