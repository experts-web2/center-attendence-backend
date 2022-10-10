import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { UserModule } from './modules/user/user.module';
import { CityModule } from './modules/city/city.module';
import { CenterModule } from './modules/center/center.module';
import { UserRoleModule } from './modules/role/userRole.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { PasswordModule } from './modules/password/password.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://ghulam:ghulam123@cluster0.hu5pa.mongodb.net/attendance?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
    }),
    UserModule,
    CityModule,
    CenterModule,
    AttendanceModule,
    UserRoleModule,
    // PasswordModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
