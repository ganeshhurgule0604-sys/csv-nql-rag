import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {Pinecone} from '@pinecone-database/pinecone'
@Injectable()
export class PineconeService {
    private readonly pinecone :Pinecone;
  constructor(private readonly configService: ConfigService) {
    this.pinecone =new Pinecone({
      apiKey: this.configService.get<string>('PINECONE_API_KEY')!,
    })
  }
  getClient(): Pinecone {
    return this.pinecone;
  }

  getIndex() {
    const indexName = this.configService.get<string>('PINECONE_INDEX_NAME')!;

    return this.pinecone.index(indexName);
  }
  async query(vector: number[], topK = 5) {
    const index = this.getIndex();

    return index.query({
      vector,
      topK,
      includeMetadata: true,
    });
  }
}
