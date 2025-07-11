import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
  return {
    transport: {
    host: configService.getOrThrow<string>("MAILER_HOST"),
    port: configService.getOrThrow<string>("MAILER_PORT"),
    secure: false,
    auth: {
      user: configService.getOrThrow<string>("MAILER_USER"),
      pass: configService.getOrThrow<string>("MAILER_PASSWORD"),
    },
  },
    defaults: {
      from: `Dokyo Team <noreply@dokyo.ru>`,
    },
  }
}