import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { User } from 'prisma/generated/prisma'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { CreateReviewDto } from './dto/create-review.dto'
import { UpdateReviewDto } from './dto/update-review.dto'
import { ReviewsService } from './reviews.service'

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Auth()
  @Post()
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: User) {
    return this.reviewsService.create(createReviewDto, user.id);
  }

  @Auth()
  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Get('product/:id')
  getProductReviews(@Param('id') id: string) {
    return this.reviewsService.getProductReviews(id);
  }

  @Auth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @CurrentUser() user: User) {
      return this.reviewsService.update(id, updateReviewDto, user.id);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.reviewsService.remove(id, user.id);
  }
}
