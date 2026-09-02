import type { HydratedDocument, Model } from 'mongoose';

import { type User, UserRole } from '../users/user.entity.ts';
import { UserModel } from '../users/user.model.ts';
import { UserMapper } from '../users/user.mapper.ts';

interface CreateAuthUserData {
  name: string;
  email: string;
  password: string;
}

type UserDocument = InstanceType<typeof UserModel>;

export const authRepository = {
  async findByEmailWithPassword(email: string): Promise<User | null> {
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
    })
      .select('+passwordHash')
      .exec();

    return user ? UserMapper.toEntity(user as HydratedDocument<typeof user>) : null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({
      email: email.toLowerCase(),
    }).exec();

    return user ? UserMapper.toEntity(user as HydratedDocument<typeof user>) : null;
  },

  async createUser(data: CreateAuthUserData): Promise<User | null> {
    const user = await UserModel.create({
      ...data,
      role: UserRole.User,
    });

    return user ? UserMapper.toEntity(user as HydratedDocument<typeof user>) : null;
  },
};
