// src/file/file.controller.ts
import { Controller, Delete, Get, Param, Post, Req, Res } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { S3Service } from '../s3/s3.service'

@Controller('files')
export class FileController {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  async uploadFile(@Req() request: FastifyRequest) {
    const data = await request.file();
    if (!data) {
      throw new Error('No file uploaded');
    }

    const buffer = await data.toBuffer();
    const fileKey = `uploads/${Date.now()}-${data.filename}`;
    
    await this.s3Service.uploadFile(
      buffer,
      fileKey,
      data.mimetype
    );

    return { 
      key: fileKey,
      filename: data.filename,
      mimetype: data.mimetype,
      size: buffer.length
    };
  }

  @Get(':key')
  async getFileUrl(@Param('key') key: string) {
    const url = await this.s3Service.getFileUrl(key);
    return { url };
  }

  @Get(':key/download')
  async downloadFile(@Param('key') key: string, @Res() reply: FastifyReply) {
    const url = await this.s3Service.getFileUrl(key);
    reply.redirect(url);
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    await this.s3Service.deleteFile(key);
    return { success: true, message: 'File deleted successfully' };
  }

  @Get(':key/info')
  async getFileInfo(@Param('key') key: string) {
    const url = await this.s3Service.getFileUrl(key);
    return { 
      key,
      url,
    };
  }
}
