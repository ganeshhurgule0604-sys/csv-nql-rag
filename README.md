# CSV NQL RAG

A Retrieval-Augmented Generation (RAG) application built with NestJS, OpenAI, and Pinecone. It allows you to upload CSV files, generate embeddings, store them in Pinecone, and query the data using natural language.

## Features

- Upload CSV files
- Parse CSV data
- Split documents into chunks
- Generate OpenAI embeddings
- Store vectors in Pinecone
- Semantic search using Pinecone
- Built with NestJS

## Tech Stack

- NestJS
- TypeScript
- OpenAI
- Pinecone
- LangChain
- Multer
- csv-parse

## Project Structure

```
src/
├── app.module.ts
├── openai/
│   ├── openai.module.ts
│   └── openai.service.ts
├── pinecone/
│   ├── pinecone.module.ts
│   └── pinecone.service.ts
├── upload/
│   ├── upload.controller.ts
│   ├── upload.module.ts
│   └── upload.service.ts
└── main.ts
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd csv-nql-rag
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root.

```env
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index
```

## Running the Project

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

## Upload Flow

```
CSV File
   │
   ▼
Upload API
   │
   ▼
Parse CSV
   │
   ▼
Create Documents
   │
   ▼
Split into Chunks
   │
   ▼
Generate Embeddings
   │
   ▼
Store in Pinecone
```

## API

### Upload CSV

**POST**

```
/upload
```

**Form Data**

| Key | Type |
|-----|------|
| file | File |
