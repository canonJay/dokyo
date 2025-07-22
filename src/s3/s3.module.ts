import { Module } from '@nestjs/common'
import { FileController } from './s3.controller'
import { S3Service } from './s3.service'

@Module({
  controllers: [FileController],
  providers: [S3Service],
  exports: [S3Service]
})
export class S3Module {}
