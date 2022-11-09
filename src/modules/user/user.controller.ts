import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Public } from '../../meta';
import {
  UserDto,
  UserLoginDto,
  UserLoginResponseDto,
  ChangePasswordDto,
  GetUsersQueryParams,
  forgotPasswordDto,
  statusDto,
} from '../../dtos';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private service: UserService) {}

  @Public()
  @Post('login')
  async logIn(@Body() data: UserLoginDto): Promise<UserLoginResponseDto> {
    return await this.service.logIn(data);
  }

  @Public()
  @Post('sign-up')
  async signUp(@Body() user: UserDto): Promise<boolean> {
    console.log('user', user);
    return await this.service.signUp(user);
  }
  @Public()
  @Post('save-user')
  async saveUser(@Body() user: UserDto): Promise<any> {
    console.log('user', user);
    return await this.service.saveUser(user);
  }

  

  // @Public()
  // @Get('forgot-password')
  // async forgotPassword(
  //   @Param('email') forgotPasswordDto: forgotPasswordDto,
  // ): Promise<boolean> {
  //   return await this.service.forgotPassword(forgotPasswordDto);
  // }

  @Public()
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: forgotPasswordDto,
  ): Promise<boolean> {
    return await this.service.forgotPassword(forgotPasswordDto);
  }

  @Get('')
  async getUsers(
    @Query() query: GetUsersQueryParams,
  ): Promise<Omit<UserDto, 'password'>[]> {
    return await this.service.getUsers(query);
  }

  @Delete('/:id')
  async deactivateUser(@Param('id') id: string): Promise<boolean> {
    return this.service.deactivateUser(id);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() deviceToken: UserDto,
  ): Promise<boolean> {
    return this.service.updateUser(id, deviceToken);
  }

  @Post('/update')
  async updateStatus(@Body() id: any): Promise<any> {
    // console.log('id', id);
    return await this.service.updateStatus(id);
  }
  @Post('/send')
  async sendNotification(@Body() data: UserDto) {
    return await this.service.sendNotification(data);
  }
  @Post('getRole')
  async getRoleByID(@Body() centerID: any, cityId: any): Promise<any> {
    return await this.service.getRoleByID(centerID, cityId);
  }
  @Post('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto): any {
    return this.service.changePassword(changePasswordDto);
  }
}
