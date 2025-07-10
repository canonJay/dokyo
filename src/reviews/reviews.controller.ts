import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { ReviewsService } from './reviews.service'

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать отзыв' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Отзыв создан', schema: { example: { id: '1', text: 'Отличный товар', rating: 5, productId: 'prod1', userId: 'user1' } } })
  @ApiResponse({ status: 400, description: 'Ошибка создания отзыва' })
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Authorized("id") userId: string) {
    return this.reviewsService.create(createReviewDto, userId);
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все отзывы' })
  @ApiResponse({ status: 200, description: 'Список отзывов', schema: { example: [{ id: '1', text: 'Отличный товар', rating: 5, productId: 'prod1', userId: 'user1' }] } })
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @ApiOperation({ summary: 'Получить отзыв по id' })
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiResponse({ status: 200, description: 'Отзыв найден', schema: { example: { id: '1', text: 'Отличный товар', rating: 5, productId: 'prod1', userId: 'user1' } } })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @ApiOperation({ summary: 'Получить отзывы по продукту' })
  @ApiParam({ name: 'id', description: 'ID продукта' })
  @ApiResponse({ status: 200, description: 'Список отзывов по продукту', schema: { example: [{ id: '1', text: 'Отличный товар', rating: 5, productId: 'prod1', userId: 'user1' }] } })
  @Get('product/:id')
  getProductReviews(@Param('id') id: string) {
    return this.reviewsService.getProductReviews(id);
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить отзыв' })
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiBody({ type: UpdateReviewDto })
  @ApiResponse({ status: 200, description: 'Отзыв обновлён', schema: { example: { id: '1', text: 'Обновлённый отзыв', rating: 4, productId: 'prod1', userId: 'user1' } } })
  @ApiResponse({ status: 400, description: 'Ошибка обновления отзыва' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Authorized("id") userId: string) {
      return this.reviewsService.update(id, updateReviewDto, userId);
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить отзыв' })
  @ApiParam({ name: 'id', description: 'ID отзыва' })
  @ApiResponse({ status: 200, description: 'Отзыв удалён', schema: { example: true } })
  @ApiResponse({ status: 404, description: 'Отзыв не найден' })
  @Delete(':id')
  remove(@Param('id') id: string, @Authorized("id") userId: string) {
    return this.reviewsService.remove(id, userId);
  }
}
