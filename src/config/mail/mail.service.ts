import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/api/user/schema/UserSchema';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  getHello(): string {
    return 'Hello World!';
  }

  public example2(): void {
    this.mailerService
      .sendMail({
        to: 'nguyenducanh.ldb@gmail.com',
        subject: 'Confirm your account',
        template: 'index',
        context: {
          username: 'john doe',
          confirmLink: 'youtube.com',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  public async confirmAccount(user: User, accessToken: string) {
    return await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm your account',
      template: 'confirm-user',
      context: {
        username: user.fullName,
        confirmLink: `http://localhost:8080/api/v1/user/confirm-account/${accessToken}`,
      },
    });
  }

  public async forgotPassword(email: string, accessToken) {
    return await this.mailerService.sendMail({
      to: email,
      subject: 'Forgot password',
      template: 'forgot-password',
      context: {
        token: accessToken,
      },
    });
  }
}
