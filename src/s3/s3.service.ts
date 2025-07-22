// src/s3/s3.service.ts
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
			region: this.configService.get<string>('AWS_REGION')!,
			credentials: {
				accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
				secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
			},
			endpoint: this.configService.get('AWS_ENDPOINT'),
		} as S3ClientConfig);
    
    this.bucketName = this.configService.get('AWS_BUCKET_NAME') as string;
  }

  async uploadFile(file: Buffer, key: string, contentType: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    });

    await this.s3Client.send(command);
    return key;
  }

  async getFileUrl(key: string, expiresIn: number = 3600) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }
}