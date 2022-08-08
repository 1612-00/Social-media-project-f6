import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AppObject } from '../../../share/common';
import { UserRole } from '../role/role.enum';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ default: '' })
  avatar: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  password: string | null;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: '' })
  phoneNumber: string;

  @Prop()
  dateOfBirth: string;

  @Prop({ default: '' })
  job: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    required: true,
    type: String,
    enum: UserRole,
    default: UserRole.User,
  })
  role: string;

  @Prop({
    type: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date },
      },
    ],
  })
  friends: { user: User; date: Date }[];

  @Prop({
    type: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date },
      },
    ],
  })
  friendReqs: { user: User; date: Date }[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  blockList: User[];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  email: 'text',
  phoneNumber: 'text',
});

export { UserSchema };
