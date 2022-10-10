import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { userRoleService } from '../role/userRole.service';
import { RoleDto } from '../../dtos/user.dto';
import { Public } from '../../meta';
import { GetUsersQueryParams } from '../../dtos/user.dto';
@ApiTags('Role')
@Controller('role')
export class UserRoleController {
  constructor(private service: userRoleService) {}

  @Post('save-role')
  async createRole(@Body() role: RoleDto): Promise<any> {
    return await this.service.createRole(role);
  }
  @Public()
  @Get('role')
  async getRole(): Promise<any> {
    return await this.service.getRole();
  }
}
