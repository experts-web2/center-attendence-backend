import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { City, CityDocument } from './city.schema';
import { CityDto } from '../../dtos';

@Injectable()
export class CityService {
  constructor(@InjectModel(City.name) private model: Model<CityDocument>) {}

  async createCity(city: CityDto): Promise<string> {
    try {
      const newCity = new this.model(city);
      const response = await newCity.save();
      return response._id;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async updateCity(city: CityDto): Promise<boolean> {
    try {
      await this.model.findByIdAndUpdate(city._id, city);
      return true;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getCity(id: string): Promise<CityDto> {
    try {
      const city = await this.model.findById(id);
      return city;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async deleteCity(_id: string): Promise<boolean> {
    try {
      await this.model.deleteOne({ _id });
      return true;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getCities(): Promise<CityDto[]> {
    try {
      const cities = await this.model.find();
      return cities;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
