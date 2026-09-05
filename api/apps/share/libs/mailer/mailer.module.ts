import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { getAssetPath } from '@share/utils';
import ENVService from '@share/environment-config/env-config.service';
import MailService from './mailer.service';

const helpers = {
  toLowerCase: (value: string) => value.toLowerCase(),
};

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ENVService],
      useFactory: (envService: ENVService) => {
        return {
          transport: {
            host: envService.Mailer.SMPT_HOST,
            port: envService.Mailer.SMPT_PORT,
            secure: false,
            auth: {
              user: envService.Mailer.SMPT_MAIL,
              pass: envService.Mailer.SMPT_APP_PASS,
            },
          },
          defaults: {
            from: '"No Reply" <noreply@example.com>',
          },
          template: {
            dir: getAssetPath(envService.Mailer.EMAIL_TEMPLATES),
            adapter: new HandlebarsAdapter(helpers),
            options: {
              strict: true,
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export default class MailModule {}
