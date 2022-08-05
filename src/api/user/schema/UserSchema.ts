import mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AppObject } from 'src/share/common';

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
    enum: AppObject.ROLE,
    default: AppObject.ROLE.BASIC,
  })
  role: string;

  @Prop({
    type: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: AppObject.RELATIONSHIPS },
      },
    ],
  })
  relationships: { user: User; status: string }[];
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  email: 'text',
  phoneNumber: 'text',
});

export { UserSchema };
