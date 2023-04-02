import {
  CACHE_MANAGER,
  CacheInterceptor,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import {
  Body,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express/multer';
import { CloudinaryService } from 'src/cloundinay/cloudinary.service';
import { store_config } from 'src/utils/config-store';
import {
  CreatePostDto,
  PaginationPostDto,
  UpdatePostDto,
} from '../dto/post.dto';
import { PostService } from '../services/post.service';
import { Cache } from 'cache-manager';
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private cloudinaryService: CloudinaryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllPost(@Query() { page, limit, start }: PaginationPostDto) {
    return this.postService.getAllPosts(page, limit, start);
  }

  @Get(':id')
  getPostById(@Param('id') id: string) {
    return this.postService.getPostById(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt')) //nêu không khai báo default strange thì thêm 'jwt' vao
  @UseInterceptors(FilesInterceptor('images', 10, store_config))
  async createPost(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          // new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    images: Array<Express.Multer.File>,
    @Req() req: any,
    @Body() post: CreatePostDto,
  ) {
    const arrImgs = await Promise.all(
      images.map((image) => {
        return this.cloudinaryService.uploadImage(image).then((res) => res.url);
      }),
    );
    return this.postService.createPost(req.user, post, arrImgs);
  }

  @Put(':id')
  async replacePost(@Param('id') id: string, @Body() post: UpdatePostDto) {
    return this.postService.replacePost(id, post);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postService.deletePost(id);
    return true;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user/all')
  async getPostUser(@Req() req: any) {
    await req.user
      .populate({
        path: 'posts',
        // select: 'title',
      })
      .execPopulate();
    return req.user.posts;
  }

  @Get('get/category')
  async getByCategory(@Query('category_id') category_id) {
    return await this.postService.getByCategory(category_id);
  }

  @Get('get/categories')
  async getByCategories(@Query('category_ids') category_ids) {
    return await this.postService.getByCategories(category_ids);
  }

  @Get('get/array')
  async getByArray() {
    return this.postService.getByArray();
  }

  @Get(':id/get-by-query')
  async getDetailByQuery(@Param('id') id: string) {
    return this.postService.getOneByCommand(id);
  }

  @Post('create-by-command')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('images', 10, store_config))
  async createByCommand(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
          // new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    images: Array<Express.Multer.File>,
    @Req() req: any,
    @Body() post: CreatePostDto,
  ) {
    return this.postService.createPostByCommand(req.user, post);
  }

  //cache trên memmory ram khi restart server sẽ mất nên giải pháp sinh ra la redis để tránh mất data vd như tron blacklist
  @Get(':id/get-with-cache')
  @UseInterceptors(CacheInterceptor)
  async getPostDetailWithCache(@Param('id') id: string) {
    console.log('Run here');
    return (await this.postService.getPostById(id)).toJSON();
  }

  @Get('cache/demo/set-cache')
  async demoSetCache() {
    await this.cacheManager.set('newnet', 'hello world', { ttl: 60 * 10 });
    return true;
  }

  @Get('cache/demo/get-cache')
  async demoGetCache() {
    return this.cacheManager.get('newnet');
  }
}
