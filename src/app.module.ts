import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PineconeModule } from './pinecone/pinecone.module';
import { OpenaiModule } from './openai/openai.module';
import { UploadModule } from './upload/upload.module';
import {ConfigModule} from '@nestjs/config';
import { QueryModule } from './query/query.module';
@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),PineconeModule, OpenaiModule, UploadModule, QueryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
