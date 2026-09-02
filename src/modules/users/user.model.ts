import { model, Schema, type InferSchemaType } from 'mongoose';

import { UserRole } from './user.entity.ts';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.User,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.set('toJSON', {
  transform: (_document, returnedObject: Record<string, unknown>): Record<string, unknown> => {
    returnedObject.id = String(returnedObject._id);

    delete returnedObject._id;
    delete returnedObject.passwordHash;

    return returnedObject;
  },
});

export type UserDocument = InferSchemaType<typeof userSchema>;

export const UserModel = model('User', userSchema);
