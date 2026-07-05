import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { PineconeService } from 'src/pinecone/pinecone.service';

@Injectable()
export class QueryService {
  constructor(
    private readonly pineconeService: PineconeService,
    private readonly configService: ConfigService,
  ) {}

  async query(question: string) {
    // Create embedding for the user's question
    const embeddings = new OpenAIEmbeddings({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });

    const queryVector = await embeddings.embedQuery(question);

    // Search Pinecone
    const matches = await this.pineconeService.query(queryVector, 5);

    // Extract metadata
    const context = matches.matches
      .map((m) => JSON.stringify(m.metadata))
      .join('\n');

    // Ask OpenAI to answer using the retrieved tickets
    const llm = new ChatOpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      model: 'gpt-4.1-mini',
      temperature: 0,
    });

    const response = await llm.invoke([
      new SystemMessage(
        `You are a support ticket assistant.
Answer ONLY using the provided ticket context.
If the answer cannot be determined, say "I don't know."`,
      ),
      new HumanMessage(`
Ticket Context:
${context}

Question:
${question}
      `),
    ]);

    return {
      question,
      answer: response.content,
      sources: matches.matches.map((m) => ({
        ticketId: m.metadata?.ticket_id,
        score: m.score,
      })),
    };
  }
}