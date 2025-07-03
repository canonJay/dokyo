import { MailerOptions } from '@nestjs-modules/mailer'
import { ConfigService } from '@nestjs/config'

export function getMailerConfig(configService: ConfigService): MailerOptions {
  return {
    transport: {
    host: configService.getOrThrow("MAILER_HOST"),
    port: configService.getOrThrow("MAILER_PORT"),
    secure: false,
    auth: {
      user: configService.getOrThrow("MAILER_USER"),
      pass: configService.getOrThrow("MAILER_PASSWORD"),
    },
  },
    defaults: {
      from: `Dokyo Team <noreply@dokyo.ru>`,
    },
  }
}