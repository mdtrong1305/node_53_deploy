import { Controller, Get, Query } from '@nestjs/common';
import { SearchAppService } from './search-app.service';
import { text } from 'stream/consumers';

@Controller('search-app') //định nghĩa route api là /search-app
export class SearchAppController {
  constructor(private readonly searchAppService: SearchAppService) {}

  // phương thức cho API
  @Get()
  searchApp(
    @Query('text') text: string, // lấy tham số text từ query string và truyền vào biến text
  ) {
    return this.searchAppService.searchApp(text);
  }
}
