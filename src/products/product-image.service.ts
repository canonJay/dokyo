// src/product/product-image.service.ts
import { Injectable } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductImageService {
  private readonly imagePrefix = 'products/';

  constructor(
    private readonly s3Service: S3Service,
  ) {}

  async uploadProductImage(buffer: Buffer, filename: string, mimetype: string) {
    const key = `${this.imagePrefix}${Date.now()}-${filename}`;
    await this.s3Service.uploadFile(buffer, key, mimetype);
    return key;
  }

  async getProductImageUrl(key: string) {
    return this.s3Service.getFileUrl(key);
  }

  async getProductImageUrls(keys: string[]) {
    return Promise.all(keys.map(key => this.getProductImageUrl(key)));
  }

  async deleteProductImage(key: string) {
    await this.s3Service.deleteFile(key);
  }
}