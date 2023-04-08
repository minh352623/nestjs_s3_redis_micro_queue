import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import 'dotenv/config';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionLoggerFilter } from './utils/exceptionLogger.filter';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from './cloundinay/cloudinary.module';
import { SubscriberModule } from './subscriber/subscriber.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './uploads',
      }),
    }),
    CloudinaryModule,
    PostModule,
    UserModule,
    SubscriberModule,
    RabbitmqModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionLoggerFilter,
    },
  ],
})
export class AppModule {}
