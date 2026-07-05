import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { parse } from 'csv-parse/sync';
import { PineconeRecord } from '@pinecone-database/pinecone';
import { randomUUID } from 'crypto';

import { PineconeService } from '../pinecone/pinecone.service';

@Injectable()
export class UploadService {
  // Store the parsed tickets in memory
  private tickets: any[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly pineconeService: PineconeService,
  ) {}

  async upload(file: any) {
    // Read CSV
    const csvText = file.buffer.toString('utf8');

    const rows = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
    });

    // Keep the original data for analytics
    this.tickets = rows;

    // Convert rows to LangChain documents
    const documents = rows.map((row: any) => ({
      pageContent: JSON.stringify(row),
      metadata: row,
    }));

    // Split documents
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunks = await splitter.createDocuments(
      documents.map((doc) => doc.pageContent),
      documents.map((doc) => doc.metadata),
    );

    // OpenAI Embeddings
    const embeddings = new OpenAIEmbeddings({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });

    const vectors: PineconeRecord[] = [];

    for (const chunk of chunks) {
      const embedding = await embeddings.embedQuery(chunk.pageContent);

      vectors.push({
        id: randomUUID(),
        values: embedding,
        metadata: {
          text: chunk.pageContent,
          ...chunk.metadata,
        },
      });
    }

    // Upload vectors to Pinecone
    const index = this.pineconeService.getIndex();

    // Optional: clear existing vectors before inserting new ones
    // await index.deleteAll();

    await index.upsert(vectors);

    return {
      success: true,
      rows: rows.length,
      chunks: chunks.length,
      vectors: vectors.length,
      message: 'CSV uploaded and indexed successfully.',
    };
  }

  /**
   * Returns all uploaded tickets.
   * Used by QueryService and AnomalyService.
   */
  getTickets() {
    return this.tickets;
  }
}