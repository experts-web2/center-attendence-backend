import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserDto {
  name?: any;
  email?: any;
  phoneNumber?: any;
  password?: any;
  city?: any;
  center?: any;
  role?: any;
  status?: any;
  verified?: boolean;
  deleted?: boolean;
}
export class statusDto {
  status: any;
}
export class RoleDto {
  role?: any;
}

export class UserLoginDto {
  email: string;
  password: string;
}

export class UserLoginResponseDto {
  newUser: Omit<UserDto, 'password'>;
  token: string;
}

export class ChangePasswordDto {
  userId: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export class forgotPasswordDto {
  email: any;
  to: any;
  subject: any;
  html: any;
}
export class GetUsersQueryParams {
  @ApiPropertyOptional()
  city: string;

  @ApiPropertyOptional()
  center: string;
}
