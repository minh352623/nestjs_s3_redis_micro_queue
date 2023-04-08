import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
  OnModuleInit,
} from '@nestjs/common';
import {
  ClientGrpc,
  ClientProxy,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import SubscriberInterface from './subscriber.interface';
import { RabbitmqService } from 'src/rabbitmq/rabbitmq.service';

@Controller('subscriber')
export class SubscriberController {
  constructor(
    @Inject('SUBSCRIBER_SERVICE')
    private readonly subscriberService: ClientProxy,
    private readonly rabbitMqService: RabbitmqService,
  ) {}
  // private gRpcService;

  @MessagePattern('queue-a')
  async handleMessage(@Payload() createSubscriber: any) {
    try {
      console.log('Received message:', createSubscriber);
    } catch (e) {
      console.log(e);
    }
    // Do something with the message
  }

  @Get()
  // @UseGuards(AuthGuard('jwt'))
  async getSubscribers() {
    return this.subscriberService.send(
      {
        cmd: 'get-all-subscriber',
      },
      {},
    );
    const data = await this.rabbitMqService.sendMessageToServiceB('alo');
    console.log(data);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createSubscriberTCP(@Req() req: any) {
    // return this.subscriberService.send(
    //   {
    //     cmd: 'add-subscriber',
    //   },
    //   req.user,
    // );
    try {
      return this.rabbitMqService.sendMessageToServiceB(req.user);
    } catch (err) {
      console.log(err);
    }
  }

  @MessagePattern({ cmd: 'send-success' })
  async getAllSubscriber(@Payload() data: any) {
    return { data };
  }

  @EventPattern({ cmd: 'send-success' })
  async getAllSubscriberEv(@Payload() data: any) {
    return { data };
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
