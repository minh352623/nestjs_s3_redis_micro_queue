import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { PostService } from './services/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostRepository } from './repositories/post.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository],
})
export class PostModule {}
