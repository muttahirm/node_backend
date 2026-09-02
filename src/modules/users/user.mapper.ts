import type { HydratedDocument } from 'mongoose';

import type { UserDocument } from './user.model.js';
import type { User } from './user.entity.ts';

export class UserMapper {
  static toEntity(document: HydratedDocument<UserDocument>): User {
    return {
      id: document._id.toString(),

      name: document.name,

      email: document.email,

      password: document.passwordHash,

      role: document.role,

      isActive: document.isActive,

      createdAt: document.createdAt,

      updatedAt: document.updatedAt,
    };
  }
}
