import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PasswordController } from './password.controller';
import { PasswordSchema } from './password.schema';
import { PasswordService } from './password.services';
import { forgotPasswordDto } from 'src/dtos';
// import { Center, CenterSchema } from './center.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: forgotPasswordDto.name, schema: PasswordSchema },
    ]),
  ],
  controllers: [PasswordController],
  providers: [PasswordService],
})
export class PasswordModule {}
