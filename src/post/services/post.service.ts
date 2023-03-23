import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { Post } from '../post.interface';
import { CategoryRepository } from '../repositories/category.repository';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async getAllPosts() {
    return this.postRepository.getByCondition({});
  }

  async getPostById(post_id: string) {
    const post = await this.postRepository.findById(post_id);
    if (post) {
      await post.populate({ path: 'user', select: '-password' });
      return post;
    } else {
      // throw new PostNotFoundException(post_id);
      throw new HttpException('Post already exists', HttpStatus.BAD_REQUEST);
    }
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
      tags: { $exists: false },
    });
  }
}
