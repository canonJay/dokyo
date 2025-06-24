import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { CreatePaymentDto } from 'src/payments/dto/create-payment.dto'
import { PaymentsService } from 'src/payments/payments.service'
import { CreateProductDto } from 'src/products/dto/create-product.dto'
import { ProductsService } from 'src/products/products.service'
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto'
import { ReviewsService } from 'src/reviews/reviews.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { UsersService } from 'src/users/users.service'

@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService, private readonly reviewsService: ReviewsService, private readonly productsService: ProductsService, private readonly paymentsService: PaymentsService) {}

  @Post('get-admine')
  async getAdmin(@Body() body: { email: string }) {
    return this.usersService.getAdmin(body.email)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Users list', type: [CreateUserDto] })
  @Authorization(Role.ADMIN)
  @Get('users')
  async getUsers() {
    return this.usersService.findAll()
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User', type: CreateUserDto })
  @Authorization(Role.ADMIN)
  @Get('users/:id')
  async getUser(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User', type: CreateUserDto })
  @Authorization(Role.ADMIN)
  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    return this.usersService.adminUpdate(updateUserDto, id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User', type: CreateUserDto })
  @Authorization(Role.ADMIN)
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ban user by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User', type: CreateUserDto })
  @Authorization(Role.ADMIN)
  @Put('users/:id/ban')
  async banUser(@Param('id') id: string) {
    return this.usersService.ban(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Unban user by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User', type: CreateUserDto })
  @Authorization(Role.ADMIN)
  @Put('users/:id/unban')
  async unbanUser(@Param('id') id: string) {
    return this.usersService.unban(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Make user admin by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User', type: CreateUserDto })
  @Authorization(Role.ADMIN)
  @Put('users/:id/make-admin')
  async makeAdmin(@Param('id') id: string) {
    return this.usersService.makeAdmin(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user reviews by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User reviews', type: [CreateReviewDto] })
  @Authorization(Role.ADMIN)
  @Get('users/:id/reviews')
  async getUserReviews(@Param('id') id: string) {
    return this.usersService.userReviews(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user products by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User products', type: [CreateProductDto] })
  @Authorization(Role.ADMIN)
  @Get('users/:id/products')
  async getUserProducts(@Param('id') id: string) {
    return this.usersService.userProducts(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user payments by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User payments', type: [CreatePaymentDto] })
  @Authorization(Role.ADMIN)
  @Get('users/:id/payments')
  async getUserPayments(@Param('id') id: string) {
    return this.usersService.userPayments(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user payments statistics by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User payments statistics', type: CreatePaymentDto })
  @Authorization(Role.ADMIN)
  @Get('users/:id/payments-statistics')
  async getUserPaymentsStatistics(@Param('id') id: string) {
    return this.usersService.userPaymentsStatistics(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user reviews statistics by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User reviews statistics', type: CreateReviewDto })
  @Authorization(Role.ADMIN)
  @Get('users/:id/reviews-statistics')
  async getUserReviewsStatistics(@Param('id') id: string) {
    return this.usersService.userReviewsStatistics(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user products statistics by id' })
  @ApiParam({ name: 'id', description: 'User id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'User products statistics', type: CreateProductDto })
  @Authorization(Role.ADMIN)
  @Get('users/:id/products-statistics')
  async getUserProductsStatistics(@Param('id') id: string) {
    return this.usersService.userProductsStatistics(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Reviews list', type: [CreateReviewDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authorization(Role.ADMIN)
  @Get('reviews')
  async getReviews() {
    return this.reviewsService.findAll()
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get review by id' })
  @ApiParam({ name: 'id', description: 'Review id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Review', type: CreateReviewDto })
  @Authorization(Role.ADMIN)
  @Get('reviews/:id')
  async getReview(@Param('id') id: string) {
    return this.reviewsService.findOne(id)
  }

  @ApiBearerAuth()
  @Authorization(Role.ADMIN)
  @ApiOperation({ summary: 'Update review by id' })
  @ApiParam({ name: 'id', description: 'Review id', type: String })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Review', type: CreateReviewDto })
  @Put('reviews/:id')
  async updateReview(@Param('id') id: string, @Body() updateReviewDto: CreateReviewDto,@Authorized("id") userId: string) {
    return this.reviewsService.update(id, updateReviewDto, userId)
  }

  @ApiBearerAuth()
  @Authorization(Role.ADMIN)
  @ApiOperation({ summary: 'Delete review by id' })
  @ApiParam({ name: 'id', description: 'Review id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Review', type: CreateReviewDto })
  @Authorization(Role.ADMIN)
  @Delete('reviews/:id')
  async deleteReview(@Param('id') id: string, @Authorized("id") userId: string) {
    return this.reviewsService.remove(id, userId)
  }

  @ApiBearerAuth()
  @Authorization(Role.ADMIN)
  @ApiOperation({ summary: 'Get all reviews by product id' })
  @ApiParam({ name: 'id', description: 'Product id', type: String })
  @ApiResponse({ status: 200, description: 'Reviews list', type: [CreateReviewDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authorization(Role.ADMIN)
  @Get('products/:id/reviews')
  async getReviewsByProductId(@Param('id') id: string) {
    return this.reviewsService.getProductReviews(id)
  }  

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products list', type: [CreateProductDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authorization(Role.ADMIN)
  @Get('products')
  async getProducts() {
    return this.productsService.findAll()
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product by id' })
  @ApiParam({ name: 'id', description: 'Product id', type: String })
  @ApiResponse({ status: 200, description: 'Product', type: CreateProductDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authorization(Role.ADMIN)
  async getProductById(@Param('id') id: string) {
    return this.productsService.findOne(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update product by id' })
  @ApiParam({ name: 'id', description: 'Product id', type: String })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Product', type: CreateProductDto })
  @Authorization(Role.ADMIN)
  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() updateProductDto: CreateProductDto, @Authorized("id") userId: string) {
    return this.productsService.update(id, updateProductDto, userId)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete product by id' })
  @ApiParam({ name: 'id', description: 'Product id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Product', type: CreateProductDto })
  @Authorization(Role.ADMIN)
  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string, @Authorized("id") userId: string) {
    return this.productsService.remove(id, userId)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product payments statistics by id' })
  @ApiParam({ name: 'id', description: 'Product id', type: String })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, description: 'Product payments statistics', type: CreatePaymentDto })
  @Authorization(Role.ADMIN)
  @Get('products/:id/payments-statistics')
  async getProductPaymentsStatistics(@Param('id') id: string) {
    return this.productsService.productPaymentsStatistics(id)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get top products by sales' })
  @ApiResponse({ status: 200, description: 'Top products by sales', type: [CreateProductDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authorization(Role.ADMIN)
  @Get('products/top-by-sales')
  async getTopProductsBySales() {
    return this.productsService.topProductsBySales()
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get top products by sum of sales' })
  @ApiResponse({ status: 200, description: 'Top products by sum of sales', type: [CreateProductDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authorization(Role.ADMIN)
  @Get('products/top-by-sum-of-sales')
  async getTopProductsBySumOfSales() {  
    return this.productsService.topProductsBySumOfSales()
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments statistics' })
  @ApiResponse({ status: 200, description: 'Payments statistics', type: CreatePaymentDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authorization(Role.ADMIN)
  @Get('payments/statistics')
  async getPaymentsStatistics() {
    return this.productsService.paymentsStatistics()
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments list', type: [CreatePaymentDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authorization(Role.ADMIN)
  @Get('payments')
  async getPayments() {
    return this.paymentsService.findAll()
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by id' })
  @ApiParam({ name: 'id', description: 'Payment id', type: String })
  @ApiResponse({ status: 200, description: 'Payment', type: CreatePaymentDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Authorization(Role.ADMIN)
  @Get('payments/:id')
  async getPaymentById(@Param('id') id: string) { 
    return this.paymentsService.findOne(id)
  }
}
