import type { HydratedDocument } from 'mongoose';
import { calculateSkip, type PaginationInput } from '../../utils/pagination.ts';
import { UserMapper } from './user.mapper.ts';
import { UserModel } from './user.model.ts';
import type { User } from './user.entity.ts';

interface CreateUserData {
  name: string;
  email: string;
  passwordHash: string;
  role?: User['role'];
}

interface UserPage {
  users: User[];
  totalItems: number;
}

export const userRepository = {
  async create(userData: CreateUserData): Promise<User> {
    const document = new UserModel(userData);
    await document.save();

    return UserMapper.toEntity(document as HydratedDocument<typeof document>);
  },

  async findById(userId: string): Promise<User | null> {
    const document = await UserModel.findById(userId).exec();

    if (!document) {
      return null;
    }

    return UserMapper.toEntity(document as HydratedDocument<typeof document>);
  },

  async findByEmail(email: string): Promise<User | null> {
    const document = await UserModel.findOne({ email }).exec();

    if (!document) {
      return null;
    }

    return UserMapper.toEntity(document as HydratedDocument<typeof document>);
  },

  async findPage(paginationInput: PaginationInput): Promise<UserPage> {
    const [userDocs, totalItems] = await Promise.all([
      UserModel.find()
        .sort({ createdAt: -1 })
        .skip(calculateSkip(paginationInput))
        .limit(paginationInput.limit)
        .exec(),

      UserModel.countDocuments().exec(),
    ]);

    const users = (userDocs as HydratedDocument<typeof userDocs[number]>[]).map((doc) =>
      UserMapper.toEntity(doc as HydratedDocument<typeof doc>),
    );

    return {
      users,
      totalItems,
    };
  },

  async updateById(
    userId: string,
    updates: Partial<Pick<User, 'name' | 'email' | 'role' | 'isActive'>>,
  ): Promise<User | null> {
    const document = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).exec();

    if (!document) {
      return null;
    }

    return UserMapper.toEntity(document as HydratedDocument<typeof document>);
  },

  async deactivateById(userId: string): Promise<User | null> {
    const document = await UserModel.findByIdAndUpdate(
      userId,
      {
        isActive: false,
      },
      {
        new: true,
      },
    ).exec();

    if (!document) {
      return null;
    }

    return UserMapper.toEntity(document as HydratedDocument<typeof document>);
  },
};
