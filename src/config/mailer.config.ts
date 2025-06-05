import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
  return {
    transport: {
    host: "smtp.yandex.ru",
    port: 465,
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