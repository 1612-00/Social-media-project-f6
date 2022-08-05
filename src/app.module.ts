import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './share/auth/auth.module';
import { MailModule } from './config/mail/mail.module';
import { GoogleAuthModule } from './config/google-auth/google-auth.module';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
config();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    UserModule,
    AuthModule,
    MailModule,
    GoogleAuthModule,
  ],
})
export class AppModule {}
