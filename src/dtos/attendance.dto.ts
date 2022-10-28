import { ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
export class AttendanceDto {
  newMembers: any;
  employees: any;
  nonEmployees: any;
  city: any;
  center: any;
  centerManager: any;
  cityManager: any;
  user: any;
  date: any;
}

export class FilterAttendanceDto {
  city: any;
  center: any;
  user: any;
  date: any;
}
export class FilterAttendance {
  cityManager: any;
}

export class GetAttendanceQueryParams {
  @ApiPropertyOptional()
  city?: any;

  @ApiPropertyOptional()
  center?: any;

  @ApiPropertyOptional()
  startDate?: any;

  @ApiPropertyOptional()
  endDate?: any;

  @ApiPropertyOptional()
  cityManager: any;

  @ApiPropertyOptional()
  centerManager?: any;

  @ApiPropertyOptional()
  user?: any;
  
  @ApiPropertyOptional()
  offset?: any; 
  
  @ApiPropertyOptional()
  limit?: any;

  // @ApiPropertyOptional()
  // cityCount: any;

  // @ApiPropertyOptional()
  // senterCount: any;
}
