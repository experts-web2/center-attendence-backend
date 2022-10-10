import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CityService } from './city.service';
import { Public } from '../../meta';
import { CityDto } from '../../dtos';

@ApiTags('City')
@Controller('city')
export class CityController {
  constructor(private service: CityService) {}

  @Post('')
  async createCity(@Body() city: CityDto): Promise<string> {
    return await this.service.createCity(city);
  }

  @Put('')
  async updateCity(@Body() city: CityDto): Promise<boolean> {
    return await this.service.updateCity(city);
  }

  @Delete('/:id')
  async deleteCity(@Param('id') id: string): Promise<boolean> {
    return await this.service.deleteCity(id);
  }

  @Get('/:id')
  async getCity(@Param('id') id: string): Promise<CityDto> {
    return await this.service.getCity(id);
  }

  @Public()
  @Get('')
  async getCities(): Promise<CityDto[]> {
    return await this.service.getCities();
  }
}
