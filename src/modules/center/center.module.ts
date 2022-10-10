import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CenterController } from './center.controller';
import { CenterService } from './center.service';
import { Center, CenterSchema } from './center.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Center.name, schema: CenterSchema }]),
  ],
  controllers: [CenterController],
  providers: [CenterService],
})
export class CenterModule {}
