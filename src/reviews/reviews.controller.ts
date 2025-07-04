import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { ReviewsService } from './reviews.service'

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a review' })
  @ApiResponse({ status: 200, description: 'Review created' })
  @ApiResponse({ status: 400, description: 'Review not created' })
  @ApiBody({ type: CreateReviewDto }) 
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @Authorized("id") userId: string) {
    return this.reviewsService.create(createReviewDto, userId);
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all reviews' })
  @ApiResponse({ status: 200, description: 'Reviews' })
  @ApiResponse({ status: 400, description: 'Reviews not found' })
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a review by id' })
  @ApiResponse({ status: 200, description: 'Review' })
  @ApiResponse({ status: 400, description: 'Review not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product reviews' })
  @ApiResponse({ status: 200, description: 'Product reviews' })
  @ApiResponse({ status: 400, description: 'Product reviews not found' })
  @Get('product/:id')
  getProductReviews(@Param('id') id: string) {
    return this.reviewsService.getProductReviews(id);
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({ status: 200, description: 'Review updated' })
  @ApiResponse({ status: 400, description: 'Review not updated' })
  @ApiParam({ name: 'id', description: 'The id of the review' })
  @ApiBody({ type: UpdateReviewDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Authorized("id") userId: string) {
      return this.reviewsService.update(id, updateReviewDto, userId);
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({ status: 200, description: 'Review deleted' })
  @ApiResponse({ status: 400, description: 'Review not deleted' })
  @ApiParam({ name: 'id', description: 'The id of the review' })
  @Delete(':id')
  remove(@Param('id') id: string, @Authorized("id") userId: string) {
    return this.reviewsService.remove(id, userId);
  }
}
