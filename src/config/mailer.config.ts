import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
  return {
    transport: {
    host: "mail.nic.ru",
    port: 587,
    secure: false,
    auth: {
      user: "noreply@dokyo.ru",
      pass: "d33gClqT9hdSWK9Wj",
    },
  },
    defaults: {
      from: `Dokyo Team <noreply@dokyo.ru>`,
    },
  }
}