import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceController } from './attendance.controller';
import { AttendanceSchema } from './attendance.schema';
import { UserSchema } from 'src/modules/user/user.schema';
import { AttendanceService } from './attendance.service';
import { AttendanceDto } from 'src/dtos';
// import { Center, CenterSchema } from './center.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AttendanceDto.name, schema: AttendanceSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
