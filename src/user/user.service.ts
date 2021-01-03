import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { ISignUpRequest } from './user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  signUp = async (
    userData: Omit<ISignUpRequest, 'confirmPassword'>,
  ): Promise<string> => {
    const createdUser = new this.userModel({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
    } as User);
    const user = await createdUser.save();

    return user.id;
  };

  getUserByEmail = async (email: string): Promise<User> => {
    return this.userModel.findOne({
      email,
    });
  };

  getUserByUsername = async (username: string): Promise<User> => {
    return this.userModel.findOne({
      username,
    });
  };

  getUserById = async (userId: string): Promise<User> => {
    return this.userModel.findById(userId);
  };
}
