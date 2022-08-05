import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        tls: {
          ciphers: 'SSLv3',
        },
        secure: true, // true for 465, false for other ports
        auth: {
          type: 'OAuth2',
          user: process.env.NODE_MAILER_USER,
          clientId: process.env.NODE_CLIENT_ID,
          clientSecret: process.env.NODE_CLIENT_SECRET,
          refreshToken: process.env.NODE_MAILER_REFRESH_TOKEN,
          accessToken: process.env.NODE_MAILER_ACCESS_TOKEN,
          expires: 3599,
        },
      },
      defaults: {
        from: '"nest-modules" <user@outlook.com>', // outgoing email ID
      },
      template: {
        dir: process.cwd() + '/src/config/mail/templates/',
        adapter: new EjsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
