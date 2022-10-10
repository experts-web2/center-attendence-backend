import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CenterDocument, Center } from './center.schema';
import { CenterDto, GetCentersQueryParams } from '../../dtos/center.dto';

@Injectable()
export class CenterService {
  constructor(@InjectModel(Center.name) private model: Model<CenterDocument>) {}

  async createCenter(center: CenterDto): Promise<string> {
    try {
      const newCenter = new this.model(center);
      const response = await newCenter.save();
      return response._id;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async updateCenter(center: CenterDto): Promise<boolean> {
    try {
      await this.model.findByIdAndUpdate(center._id, center);
      return true;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getCenter(id: string): Promise<CenterDocument> {
    try {
      const center = await this.model.findById(id).populate('managers');
      return center;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async deleteCenter(_id: string): Promise<boolean> {
    try {
      await this.model.deleteOne({ _id });
      return true;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getCenters(params: GetCentersQueryParams): Promise<CenterDto[]> {
    try {
      let query = this.model.find();
      if (params.city) query = query.where('city').equals(params.city);
      const centers = await query
        .lean()
        .populate('city')
        .populate('managers')
        .exec();
      return centers;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
