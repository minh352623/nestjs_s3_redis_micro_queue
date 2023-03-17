import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '../dto/post.dto';
import { Post } from '../post.interface';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  private lastPostId = 0;
  private posts: Post[] = [];

  getAllPosts() {
    return this.posts;
  }

  getPostById(id: number) {
    const post = this.posts.find((post) => post.id === id);
    if (post) {
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  replacePost(id: number, post: UpdatePostDto) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex > -1) {
      this.posts[postIndex] = <Post>post;
      return post;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(post: CreatePostDto) {
    return await this.postRepository.create(post);
  }

  deletePost(id: number) {
    const postIndex = this.posts.findIndex((post) => post.id === id);
    if (postIndex > -1) {
      this.posts.splice(postIndex, 1);
    } else {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
