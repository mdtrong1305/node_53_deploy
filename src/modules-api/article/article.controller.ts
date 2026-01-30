import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Controller('article') // định nghĩa route api này là /article
@UseInterceptors(CacheInterceptor) // áp dụng CacheInterceptor cho toàn bộ controller, sử dụng này thì ko cần get, set cache thủ công nữa
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  create(@Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(createArticleDto);
  }

  @Get()
  @CacheTTL(5000) // phương thức nào dùng cache thì đặt CacheTTL ở đây (tính bằng ms), à CacheTTL chỉ dùng cho phương thức GET thôi nhé
  findAll(
    @Query() query 
  ) {
    return this.articleService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.articleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articleService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.articleService.remove(+id);
  }
}
