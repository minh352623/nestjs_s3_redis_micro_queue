import { IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  description: string;

  @MinLength(4)
  @IsNotEmpty()
  title: string;

  user: any;

  categories: [string];

  images: any;
}

export class UpdatePostDto {
  id: number;
  content: string;
  title: string;
}
