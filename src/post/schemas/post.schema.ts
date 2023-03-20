import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import * as mongoose from 'mongoose';
import { Category } from './category.schema';
export type PostDocument = HydratedDocument<Post>;

@Schema({ timestamps: true })
export class Post extends Document {
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }] })
  categories: Category[];

  @Prop()
  images: [string];
}

export const PostSchema = SchemaFactory.createForClass(Post);
// PostSchema.virtual('categories', {
//   ref: 'Category',
//   localField: '_id',
//   foreignField: 'categories',
//   justOne: false, //1-n => false,1-1 true
// });
