import { Module } from '@nestjs/common';
import { PostController } from './controllers/post.controller';
import { Post, PostSchema } from './schemas/post.schema';
import { PostService } from './services/post.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostRepository } from './repositories/post.repository';
import { JwtStrategy } from 'src/user/jwt.strategy';
import { AuthService } from 'src/user/services/auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { Category, CategorySchema } from './schemas/category.schema';
import { CategoryService } from './services/category.service';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryController } from './controllers/category.controller';
import { CloudinaryService } from 'src/cloundinay/cloudinary.service';
import { CloudinaryModule } from 'src/cloundinay/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),

    UserModule,
    CloudinaryModule,
  ],
  controllers: [PostController, CategoryController],
  providers: [
    PostService,
    PostRepository,
    CategoryService,
    CategoryRepository,
    CloudinaryService,
  ],
})
export class PostModule {}
