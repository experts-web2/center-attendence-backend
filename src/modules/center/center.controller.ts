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
import { CenterService } from './center.service';
import { Public } from '../../meta';
import { CenterDto, GetCentersQueryParams } from '../../dtos/center.dto';

@ApiTags('Center')
@Controller('center')
export class CenterController {
  constructor(private service: CenterService) {}

  @Post('')
  async createCenter(@Body() center: CenterDto): Promise<string> {
    return await this.service.createCenter(center);
  }

  @Put('')
  async updateCenter(@Body() center: CenterDto): Promise<boolean> {
    return await this.service.updateCenter(center);
  }

  @Delete('/:id')
  async deleteCenter(@Param('id') id: string): Promise<boolean> {
    return await this.service.deleteCenter(id);
  }

  @Get('/:id')
  async getCenter(@Param('id') id: string): Promise<CenterDto> {
    return await this.service.getCenter(id);
  }

  @Public()
  @Get('')
  async getCenters(
    @Query() query: GetCentersQueryParams,
  ): Promise<CenterDto[]> {
    return await this.service.getCenters(query);
  }
}
