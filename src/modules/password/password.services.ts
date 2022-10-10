import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PasswordDocument } from './password.schema';

import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(
    @InjectModel('forgotPasswordDto') private model: Model<PasswordDocument>,
  ) {}

  data: any;
}
