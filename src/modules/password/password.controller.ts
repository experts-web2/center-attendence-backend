import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Put,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PasswordService } from './password.services';
import { Public } from '../../meta';
import { GetAttendanceQueryParams } from '../../dtos';

@ApiTags('')
@Controller('')
export class PasswordController {
  constructor(private Service: PasswordService) {}
}
