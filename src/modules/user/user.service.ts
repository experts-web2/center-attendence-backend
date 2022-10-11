import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { User, UserDocument } from './user.schema';
import { forgotPasswordDto, statusDto } from '../../dtos';
import {
  UserDto,
  UserLoginDto,
  UserLoginResponseDto,
  ChangePasswordDto,
  GetUsersQueryParams,
} from '../../dtos';
import { SchemaTypes, Types, Document } from 'mongoose';

const ObjectId = Types.ObjectId;
const nodemailer = require('nodemailer');

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private model: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) { }

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'>> | null {
    try {
      const user = await this.model.findOne({ email: username });
      if (!user) throw new NotFoundException(null, 'User Not Found');
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (isPasswordMatched) {
        const { password, ...rest } = user.toObject();
        return rest;
      } else return null;
    } catch (error) {
      throw new NotFoundException(null, 'User Not Found');
    }
  }

  async logIn({
    email,
    password,
  }: UserLoginDto): Promise<UserLoginResponseDto> {
    try {
      if (!email || !password)
        throw new BadRequestException(null, 'Required Parameters Missing');
      const user: any = await this.model.findOne({ email });
      const newUser: any = JSON.parse(JSON.stringify(user));
      if (!newUser) throw new NotFoundException(null, 'User Not Found');
      const isPasswordMatched = await bcrypt.compare(
        password,
        newUser.password,
      );
      if (isPasswordMatched) {
        const { password, ...rest } = newUser;
        const token: any = this.jwtService.sign({
          username: newUser.name,
          sub: newUser._id,
        });
        return { newUser: rest, token };
      }
    } catch (error) {
      throw new NotFoundException(null, 'User Not Found');
    }
  }
  async saveUser(user: any) {
    try {
      const newUser = new this.model(user);

      const result = await newUser.save();

      console.log('USER', user);
      console.log('result', result);
      return result;
    } catch (error) {
      return error.message;
    }
  }

  async signUp(user: UserDto): Promise<any> {
    const { name, email, password, phoneNumber, city, center, role } = user;
    console.log('user', name, email, password, phoneNumber, city, center, role);
    try {
      if (
        !email ||
        !password ||
        !name ||
        !phoneNumber ||
        !city ||
        !center ||
        !role
      )
        throw new BadRequestException(null, 'Required Parameters Missing');
      const existingUser = await this.model.findOne({ email });
      console.log('existingUser', existingUser);
      if (existingUser)
        throw new NotAcceptableException(
          null,
          'User With Same Email Already Exist',
        );
      const hash = await bcrypt.hash(password, 10);
      const newUser = new this.model({ ...user, password: hash });

      await newUser.save();
      return true;
    } catch (error) {
      throw new NotFoundException(null, error);
    }
  }
  async sendNotification(data: UserDto): Promise<any> {
    const { name, email, password, phoneNumber, city, center, role } = data;
    console.log('data', data);
    const newData = await this.model.findOne({ email });
    console.log('newData', newData);
  }

  async getUsers(
    params: GetUsersQueryParams,
  ): Promise<Omit<UserDto, 'password'>[]> {
    try {
      let query = this.model.find({ deleted: false });
      if (params.city) query = query.where('city').equals(params.city);
      if (params.center) query = query.where('center').equals(params.center);
      const users = await query
        .lean()
        .populate('city')
        .populate('center')
        .exec();
      return users.map(({ password, ...rest }) => ({ ...rest }));
    } catch (error) {
      throw new BadRequestException(null, 'Not Found');
    }
  }

  async deactivateUser(_id: string): Promise<boolean> {
    try {
      await this.model.updateOne({ _id }, { $set: { deleted: true } });
      return true;
    } catch {
      throw new BadRequestException(null, 'Not Found');
    }
  }

  async updateUser(id: string, user: UserDto): Promise<boolean> {
    try {
      const data = await this.model.findByIdAndUpdate(id, user);
      console.log('data', data);
      return true;
    } catch {
      throw new BadRequestException(null, 'Not Found');
    }
  }

  async updateStatus(body: any) {
    const { id, status } = body;
    console.log('id', id);

    const _id = new ObjectId(id);
    console.log('_id', _id);

    try {
      // if (id.status === 'Approved') {
      const data = await this.model.findByIdAndUpdate(
        { _id },

        {
          status: status,
        },
      );
      console.log('data', data);
      // }
      // if (id.status === 'Denied') {
      // }

      return data;
    } catch (error) {
      return error.message;
    }
  }
  // async getStatus(status: statusDto) {
  //   try {
  //     const status = await this.model.findById(id);
  //     return status;
  //   } catch (error) {
  //     throw new NotFoundException();
  //   }
  // }
  async getRoleByID(centerId: any, cityId: any): Promise<any> {
    try {
      console.log('center', centerId.cityId, 'city', cityId);
      // const ar = [];
      const data = await this.model.find({
        city: { $in: [centerId.cityId] },
        center: { $in: [centerId.centerId] },
      });

      const cityManagers = [];
      const centerManagers = [];

      const trd = data.map((item) => {
        console.log('items', item);
        if (item.role === 'City Manager') {
          cityManagers.push(item.name);
        } else if (item.role === 'Center Manager') {
          centerManagers.push(item.name);
        } else {
          null;
        }
      });
      console.log('trd', trd);
      return { cityManagers, centerManagers };
    } catch (error) {
      throw error;
    }
  }

  async forgotPassword(forgotPasswordDto: forgotPasswordDto): Promise<any> {
    console.log('ts');
    try {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRlc3QiLCJzdWIiOiI2MzE2MGU2YmMzYjIyZmJjMzE1NTZiMmEiLCJpYXQiOjE2NjMwNjAxMDMsImV4cCI6MTY2MzA2NjEwM30.NgbWoE-pihtVMfP9Crb2Ruz2sLxjvM7Vrypn7-ukhjk';
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        service: 'gm7847198@gmail.com',
        secure: false,
        auth: {
          user: 'testuserg38@gmail.com',
          pass: 'imxmtntzeurtbrjc',
        },
      });
      console.log('transporter', transporter);
      let info = await transporter.sendMail({
        to: 'gm7847198@gmail.com',
        subject: 'Forgot Password',
        html:
          '<p>Click <a href="http://localhost:3001/changepassword' +
          token +
          '">here</a> to reset your password</p>',
      });
      console.log('info', info);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return true;
    } catch (error) {
      return error;
    }
  }

  async changePassword(changePasswordDto: any) {
    console.log('changePasswordDto', changePasswordDto);
    try {
      const user = await this.model.findById(changePasswordDto.userId);
      console.log('userId', user);
      console.log('oldPassword', changePasswordDto.oldpassword);
      const oldPasswordMatched = await bcrypt.compare(
        changePasswordDto.oldpassword,
        user.password,
      );
      console.log('oldPasswordMatched', oldPasswordMatched);
      if (oldPasswordMatched) {
        const password = await bcrypt.hash(changePasswordDto.newPassword, 10);
        console.log('password', password);

        const pass = await this.model.updateOne(
          { _id: user._id },
          {
            $set: {
              password,
            },
          },
        );

        console.log('pss', pass);
        return pass;
      }
    } catch (error) {
      return error;
    }
  }

  // async changePassword(payload: ChangePasswordDto): Promise<boolean> {
  //   const { oldPassword, newPassword, email } = payload;
  //   try {
  //     const user = await this.model.findOne({ email });
  //     const oldPasswordMatched = await bcrypt.compare(
  //       oldPassword,
  //       user.password,
  //     );
  //     if (oldPasswordMatched) {
  //       const password = await bcrypt.hash(newPassword, 10);
  //       await this.model.updateOne({ _id: user._id }, { ...user, password });
  //       return true;
  //     }
  //   } catch (error) {
  //     throw new BadRequestException(null, 'User Not Found');
  //   }
  // }
}
