import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { userRoles, userRolesDocument } from './userRoles.schema';
import { RoleDto } from '../../dtos/user.dto';
import { ObjectId, Types } from 'mongoose';
const ObjectId = Types.ObjectId;
@Injectable()
export class userRoleService {
  constructor(
    @InjectModel(userRoles.name) private model: Model<userRolesDocument>,
  ) {}

  async createRole(role: RoleDto): Promise<any> {
    try {
      console.log('call');
      const newRole = new this.model(role);
      console.log('call2', newRole);
      const response = await newRole.save();
      return response._id;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async getRole(): Promise<any> {
    try {
      const role = await this.model.find();

      return role;
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
