import { Body, Controller, Post } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryDto } from './query.dto';

@Controller('query')
export class QueryController {
  constructor(private readonly queryService: QueryService) {}

  @Post()
  async query(@Body() dto: QueryDto) {
    return this.queryService.query(dto.question);
  }
}