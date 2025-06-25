import { MailerService as NestMailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: NestMailerService) {}

  async sendEmail(to: string, subject: string, html: string) {
    return await this.mailerService.sendMail({ to, subject, html })
  }
}
