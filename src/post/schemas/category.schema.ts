import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Post } from './post.schema';
export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category extends Document {
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  title: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] })
  posts: Post[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
// CategorySchema.virtual('posts', {
//   ref: 'Post',
//   localField: '_id',
//   foreignField: 'posts',
//   justOne: false, //1-n => false,1-1 true
// });
