import { CacheModule, Module } from '@nestjs/common';
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
import { CreatePostHandler } from './handler/createPost.handler';
import { GetPostHandler } from './handler/getPost.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),

    UserModule,
    CloudinaryModule,
    CqrsModule,
    // CacheModule.register({
    //   ttl: 10, //second - 10s thì nó mới chạy lại hàm nào có cache
    // }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // isGlobal: true,
        store: redisStore as any,
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
        username: configService.get<string>('REDIS_USERNAME'),
        password: configService.get<string>('REDIS_PASSWORD'),
      }),
    }),
  ],
  controllers: [PostController, CategoryController],
  providers: [
    PostService,
    PostRepository,
    CategoryService,
    CategoryRepository,
    CloudinaryService,
    CreatePostHandler,
    GetPostHandler,
  ],
})
export class PostModule {}
