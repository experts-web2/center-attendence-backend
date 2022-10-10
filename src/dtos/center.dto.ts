import { ApiPropertyOptional } from '@nestjs/swagger';
import { Document } from 'mongoose';
export class CenterDto {
  _id?: string;
  name?: string;
  city?: string;
  managers?: string[];
}

export class GetCentersQueryParams {
  @ApiPropertyOptional()
  city: string;
  role: string;
}
