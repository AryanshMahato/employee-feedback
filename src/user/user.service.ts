import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { SignUpRequest } from './user.types';
import { Team } from '../team/team.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  signUp = async (
    userData: Omit<SignUpRequest, 'confirmPassword'>,
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

  private getUserByEmail = async (email: string): Promise<UserDocument> => {
    return this.userModel
      .findOne({
        email,
      })
      .populate({
        path: 'ownedTeams',
        model: Team,
        select: 'id name description lead createdAt updatedAt',
      })
      .select('firstName lastName username email')
      .exec();
  };

  private getUserByUsername = async (
    username: string,
  ): Promise<UserDocument> => {
    return this.userModel
      .findOne({
        username,
      })
      .populate({
        path: 'ownedTeams',
        model: Team,
        select: 'id name description lead createdAt updatedAt',
      })
      .select('firstName lastName username email')
      .exec();
  };

  getUser = async (userId: string, method: string): Promise<UserDocument> => {
    if (method === 'username') {
      return await this.getUserByUsername(userId);
    }
    return await this.getUserByEmail(userId);
  };

  addTeamToOwnedTeams = async (
    userId: string,
    teamId: string,
  ): Promise<void> => {
    await this.userModel.findByIdAndUpdate(userId, {
      $push: {
        ownedTeams: teamId,
      },
    });
  };

  getUserById = async (userId: string): Promise<User> => {
    return this.userModel.findById(userId);
  };
}
