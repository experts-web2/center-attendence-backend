import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { Model } from 'mongoose';

import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { Attendance, AttendanceDocument } from './attendance.schema';
import {
  AttendanceDto,
  GetAttendanceQueryParams,
  FilterAttendanceDto,
} from '../../dtos';
import { Console } from 'console';
const moment = require('moment');
@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel('AttendanceDto') private model: Model<AttendanceDocument>,
  ) {}
  // attendance: AttendanceDto[] = [];
  data: any;

  async saveAttendance(AttendanceDto: any) {
    try {
      const cityManagers = [];
      const centerManager = [];
      console.log('DTOOO', AttendanceDto);
      await AttendanceDto.cityManager.map((item) => {
        cityManagers.unshift(item.value);
      });
      await AttendanceDto.centerManager.map((item) => {
        centerManager.unshift(item.value);
      });
      const mydata = {
        newMembers: AttendanceDto.newMembers,
        employees: AttendanceDto.employees,
        nonEmployees: AttendanceDto.nonEmployees,
        city: AttendanceDto.city,
        center: AttendanceDto.center,
        cityManager: cityManagers,
        centerManager: centerManager,
        date: AttendanceDto.date,
      };
      const newAttendance = new this.model(mydata);
      const result = await newAttendance.save();
      return result;
    } catch (error) {
      return error;
    }
  }

  async filterAttendance(data: GetAttendanceQueryParams) {
    try {
      let mongooseQuery = {};
      if (data.city) {
        mongooseQuery = { ...mongooseQuery, city: data.city };
      }
      if (data.center) {
        mongooseQuery = { ...mongooseQuery, center: data.center };
      }
      if (data.centerManager) {
        mongooseQuery = { ...mongooseQuery, center: data.centerManager };
      }
      if (data.city && data.center && data.cityManager || data.cityManager) {
        const unwindResult = await this.model.aggregate([
          {
            $match: {
              cityManager: { $in: data.cityManager },
            },
          },
          {
            $unwind: {
              path: '$cityManager',
              preserveNullAndEmptyArrays: true,
              includeArrayIndex: 'string',
            },
          },
          {
            $group: {
              _id: '$cityManager',
              record: { $push: '$$ROOT' },
              count: {
                $sum: 1,
              },
            },
          },
        ]);
        const finalResult = [];
        const myResult = unwindResult.map((itm) => {

          if (data.cityManager.includes(itm._id)) {
            if (data.cityManager === undefined || data.cityManager === null) {
              null;
            } else {
              finalResult.push(itm);
              return itm;
            }
          }
        });
        return myResult;
      }
      if (data.startDate) {
        const start = new Date(data.startDate).toISOString();
        const end = new Date(data.endDate).toISOString();
        mongooseQuery = {
          date: {
            $gte: start,
            $lte: end,
          },
          leave: { $exists: false },
        };
      }
      if (!data) {
        mongooseQuery = { deleted: false };
      }
      const result = await this.model
        .find(mongooseQuery)
        .lean()
        .populate('city')
        .populate('center')
        .exec();
      return result;
    } catch (error) {
      return error;
    }
  }

  // async getAttendance(): Promise<any> {
  //   try {
  //     const attendance = this.model.find();

  //     return attendance;
  //   } catch (error) {
  //     throw new BadRequestException(null, 'Not Found');
  //   }
  // }

  async getAttendance(params: GetAttendanceQueryParams) {
    console.log('params', params);
    try {
      let query = this.model.find({ deleted: false });
      if (params.city) query = query.where('city').equals(params.city);
      if (params.center) query = query.where('center').equals(params.center);
      // if (params.cityManager)
      //   query = query.where('cityManager').equals(params.cityManager);
      // if (params.centerManager)
      //   query = query.where('centerManager').equals(params.centerManager);
      // if (params.startDate) {
      //   const start = new Date(params.startDate).toISOString();

      //   const end = new Date(params.endDate).toISOString();
      //   console.log('start', start);
      //   console.log('end', end);

      //   const query1 = {
      //     date: {
      //       $gte: start,
      //       $lte: end,
      //     },
      //     leave: { $exists: false },
      //   };
      //   console.log('query1', query1);
      //   const data = await this.model.find(query1);
      //   console.log('data', data);
      //   return data;
      // }

      const attendance = await query
        .lean()
        .populate('city')
        .populate('center')
        .exec();
      return attendance;
    } catch (error) {
      throw new BadRequestException(null, 'Not Found');
    }
  }
  async deleteAttendance(_id: string): Promise<any> {
    try {
      const attendance = await this.model.deleteOne({ _id });
      return attendance;
    } catch (error) {
      return 'Error in Delete Attendance';
    }
  }

  async updateAttendance(id: string, attendance: AttendanceDto): Promise<any> {
    try {
      const attendanceResult = await this.model.findByIdAndUpdate(
        id,
        attendance,
      );
      console.log('attendanceResult', attendanceResult);
      return attendanceResult;
    } catch {
      throw new BadRequestException(null, 'Not Found');
    }
  }
}
