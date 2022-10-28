import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AttendanceDocument } from './attendance.schema';
import { AttendanceDto, GetAttendanceQueryParams } from '../../dtos';
import { ObjectId, Types } from 'mongoose';
const ObjectId = Types.ObjectId;
@Injectable()
export class AttendanceService {
  constructor(@InjectModel('AttendanceDto') private model: Model<AttendanceDocument>) { }
  data: any;
  async saveAttendance(AttendanceDto: any) {
    try {
      const mydata = {
        newMembers: AttendanceDto.newMembers,
        employees: AttendanceDto.employees,
        nonEmployees: AttendanceDto.nonEmployees,
        city: AttendanceDto.city,
        center: AttendanceDto.center,
        cityManager: AttendanceDto.cityManagers,
        centerManager: AttendanceDto.centerManagers,
        date: AttendanceDto.date,
        user: AttendanceDto.user,
      };
      const newAttendance = new this.model(mydata);
      const result = await newAttendance.save();
      return result;
    } catch (error) {
      return error;
    }
  }

  async filterAttendance(data: GetAttendanceQueryParams) {
    // console.log('BODY', data)

    try {
      let mongooseQuery = {};
      if (data.city) {
        mongooseQuery = { ...mongooseQuery, center: data.center, city: data.city };
        // console.log('QUERY', mongooseQuery)
      }
      if (data.center) {
        mongooseQuery = { ...mongooseQuery, center: data.center };
      }
      if (data.centerManager) {
        mongooseQuery = { ...mongooseQuery, centerManager: data.centerManager };
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
      const result = await this.model.find(mongooseQuery).lean().populate('city').populate('center').exec();
      return result;
    } catch (error) {
      return error;
    }
  }

  async attendanceFilter(data: any) {
    try {
      if (data.cityManager) {
        let cityManagers: any = [];
        await data.cityManager.forEach((element: any) => {
          cityManagers.push(new ObjectId(element))
        });
        let condition = []
        condition.push({ cityManager: { $in: cityManagers } })
        if (data.startDate && data.endDate) {
          const start = new Date(data.startDate);
          const end = new Date(data.endDate);
          let dateFIlter = { date: { $gte: start, $lte: end }, leave: { $exists: false } };
          condition = [...condition, dateFIlter]
        }
        let myResult = await this.model.aggregate([
          {
            $match: {
              $and: condition
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
            $lookup: {
              from: "users",
              let: { userId: "$user" },
              pipeline: [
                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
              ],
              as: "User",
            },
          },
          {
            $unwind: {
              path: '$User',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $addFields: { name: '$User.name' }
          },
          {
            $project: {
              User: 0
            }
          },
          {
            $group: {
              _id: '$user',
              // record: { $push: '$$ROOT' },
              count: {
                $sum: 1,
              },
              name: { $first: "$name" }
            },
          },
        ])

        let label = []
        let dataSet = []
        myResult.forEach((item: any) => {
          label.push(item.name)
          dataSet.push(item.count)
        });

        let result = { label, dataSet }


        return result;
      }
    } catch (error) {
      return error;
    }
  }


  async getAttendance(params: GetAttendanceQueryParams) {
    try {
      var offset = parseInt(params.offset) ? parseInt(params.offset) : 0;
      var limit = parseInt(params.limit) ? parseInt(params.limit) : 4;
      const attendance = await this.model.find({ deleted: false, center: params.center })
        .skip(offset)
        .limit(limit)
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
      const attendanceResult = await this.model.findByIdAndUpdate(id, attendance);
      return attendanceResult;
    } catch {
      throw new BadRequestException(null, 'Not Found');
    }
  }
}
