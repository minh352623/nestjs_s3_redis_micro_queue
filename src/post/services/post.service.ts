import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { Post } from '../post.interface';
import { CategoryRepository } from '../repositories/category.repository';
import { PostRepository } from '../repositories/post.repository';
import { isValidObjectId } from 'mongoose';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreatePostCommand } from '../commands/createPost.command';
import { GetPostQuery } from '../queries/getPost.query';
@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly categoryRepository: CategoryRepository,
    private commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}
  async getAllPosts(page: number, limit: number, start: string) {
    const count = await this.postRepository.countDocuments({});
    const count_page = (count / limit).toFixed();
    const posts = await this.postRepository.getByCondition(
      {
        // _id: {
        //   $gt: isValidObjectId(start) ? start : '000000000000000000000000',
        // },
      },
      null,
      {
        sort: {
          _id: 1, //asc
        },
        skip: (page - 1) * limit,
        limit: Number(limit),
      },
    );
    return { count_page, posts };
  }

  async getPostById(post_id: string) {
    const post = await this.postRepository.findById(post_id);
    if (post) {
      await post
        // .populate({ path: 'user', select: '-password -refreshToken' })
        // .populate({ path: 'user', select: 'name email' })
        // .populate('categories')
        .populate([
          { path: 'user', select: 'name email' },
          {
            path: 'categories',
            match: {
              _id: '62fd1a9473adb27682f0f440',
            },
            select: 'title',
            options: { limit: 100, sort: { name: 1 } },
            // populate: [{
            //   path: '',
            // },]
          },
        ]);
      return post;
    } else {
      // throw new PostNotFoundException(post_id);
      throw new HttpException('Post already exists', HttpStatus.BAD_REQUEST);
    }
  }

  async getOneByCommand(post_id: string) {
    return this.queryBus.execute(new GetPostQuery(post_id));
  }

  async createPostByCommand(user: User, post: CreatePostDto) {
    return this.commandBus.execute(new CreatePostCommand(user, post));
  }

  async replacePost(post_id: string, data: UpdatePostDto) {
    return await this.postRepository.findByIdAndUpdate(post_id, data);
  }

  async createPost(user: User, post: CreatePostDto, images: any) {
    post.user = user._id;
    post.images = images;

    const new_post = await this.postRepository.create(post);
    if (post.categories) {
      await this.categoryRepository.updateMany(
        {
          _id: { $in: post.categories },
        },
        {
          $push: {
            posts: new_post._id,
          },
        },
      );
    }

    return new_post;
  }

  async getByCategory(category_id: string) {
    return await this.postRepository.getByCondition({
      categories: {
        $elemMatch: { $eq: category_id },
      },
    });
  }

  async getByCategories(category_ids: [string]) {
    return await this.postRepository.getByCondition({
      categories: {
        $all: category_ids,
      },
    });
  }

  async deletePost(post_id: string) {
    return await this.postRepository.deleteOne(post_id);
  }

  async getByArray() {
    return await this.postRepository.getByCondition({
      // 'numbers.0': { $eq: 10 },
      // numbers: { $elemMatch: { $gt: 13, $lt: 20 } },
      // numbers: { $gt: 13, $lt: 20 },
      // $and: [{ numbers: { $gt: 13 } }, { numbers: { $lt: 20 } }],
      // tags: 'black',
      // tags: { $all: ['black', 'blank'] },
      // tags: ['red', 'blank'],
      // tags: { $size: 3 },
      tags: { $exists: true },
    });
  }
}
