import { Test } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';
import ENVService from '@share/environment-config/env-config.service';
import MailService from '../mailer.service';

const envService = {
  provide: ENVService,
  useValue: {
    Mailer: {
      SYSTEM_ADMIN_EMAIL: '',
    },
  },
};

export default async () => {
   return Test.createTestingModule({
    providers: [MailService, MailerService, envService],
  })
    .overrideProvider(MailerService)
    .useValue({
      sendMail: jest.fn(),
    })
    .compile();
};
