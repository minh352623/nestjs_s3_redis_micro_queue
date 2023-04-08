import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Document } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends Document {
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  refreshToken: string;
  @Prop()
  twoFactorAuthenticationSecret: String;

  @Prop({ type: Boolean, default: false })
  isTwoFactorAuthenticationEnabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'user',
  justOne: false, //1-n => false,1-1 true
  match: {
    categories: { $size: 2 },
  },
});
