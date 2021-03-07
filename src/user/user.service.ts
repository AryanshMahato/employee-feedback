import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserPublicSelect } from './user.schema';
import { Model } from 'mongoose';
import { GetUserOptions, SignUpRequest } from './user.types';
import { Team } from '../team/team.schema';
import { default as clsx } from 'clsx';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  // creates user in table and returns userId of created user
  signUp = async (
    userData: Omit<SignUpRequest, 'confirmPassword'>,
  ): Promise<string> => {
    const createdUser = await this.userModel.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      ownedTeams: [],
    });

    return createdUser.id;
  };

  private getUserByEmail = async (
    email: string,
    withPassword?: boolean,
  ): Promise<UserDocument> => {
    return this.userModel
      .findOne({
        email,
      })
      .populate({
        path: 'ownedTeams',
        model: Team,
        select: '_id name description lead createdAt updatedAt',
      })
      .select(clsx(UserPublicSelect, { password: withPassword }))
      .exec();
  };

  private getUserByUsername = async (
    username: string,
    withPassword?: boolean,
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
      .select(clsx(UserPublicSelect, { password: withPassword }))
      .exec();
  };

  getUser = async (
    userId: string,
    method: 'username' | 'email',
    options?: GetUserOptions,
  ): Promise<UserDocument | null | undefined> => {
    if (method === 'username') {
      return await this.getUserByUsername(userId, options?.withPassword);
    }
    return await this.getUserByEmail(userId, options?.withPassword);
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

  deleteTeamFromOwnedList = async (
    userId: string,
    teamId: string,
  ): Promise<void> => {
    await this.userModel.findByIdAndUpdate(userId, {
      $pull: { ownedTeams: teamId },
    });
  };

  getUserById = async (id: string): Promise<UserDocument> => {
    return this.userModel.findById(id);
  };
}
