import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import 'dotenv/config';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionLoggerFilter } from './utils/exceptionLogger.filter';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URL),
    PostModule,
    UserModule,
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
