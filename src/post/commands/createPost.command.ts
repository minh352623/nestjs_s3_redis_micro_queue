import { User } from 'src/user/schemas/user.schema';
import { CreatePostDto } from '../dto/post.dto';

export class CreatePostCommand {
  constructor(
    public readonly user: User,
    public readonly createPostDto: CreatePostDto,
  ) {}
}
