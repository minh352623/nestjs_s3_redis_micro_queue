import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import SubscriberInterface from './subscriber.interface';

@Controller('subscriber')
export class SubscriberController {
  constructor(
    @Inject('SUBSCRIBER_SERVICE')
    private readonly subscriberService: ClientProxy, // @Inject('SUBSCRIBER_SERVICE')
  ) // private client: ClientGrpc,
  {}
  // private gRpcService;
  // onModuleInit(): any {
  //   this.gRpcService =
  //     this.client.getService<SubscriberInterface>('SubscriberService');
  // }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getSubscribers() {
    return this.subscriberService.send(
      {
        cmd: 'get-all-subscriber',
      },
      {},
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createSubscriberTCP(@Req() req: any) {
    return this.subscriberService.send(
      {
        cmd: 'add-subscriber',
      },
      req.user,
    );
  }

  //khong cần cho phan hoi r mới tra du lieu mà ban xong tra ve liền mac ke en service kia làm gì
  @Post('event')
  @UseGuards(AuthGuard('jwt'))
  async createSubscriberEvent(@Req() req: any) {
    this.subscriberService.emit(
      {
        cmd: 'add-subscriber',
      },
      req.user,
    );
    return true;
  }

  @Post('rmq')
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any) {
    return this.subscriberService.send(
      {
        cmd: 'add-subscriber',
      },
      req.user,
    );
  }

  //GRPC

  // async getSubscribers() {
  //   return this.gRpcService.getAllSubscribers({});
  // }

  // async createPost(@Req() req: any) {
  //   return this.gRpcService.addSubscriber({
  //     email: req.user.email,
  //     name: req.user.name,
  //   });
  // }
}
