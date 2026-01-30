import { Inject, Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { buildQueryPrisma } from '../../common/helper/build-query-prisma.helper';
import { PrismaService } from '../../modules-system/prisma/prisma.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ArticleService {
  constructor(private prisma: PrismaService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  
  create(createArticleDto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  async findAll(query) {
    const { page, pageSize, where, index } = buildQueryPrisma(query);
    // khởi tạo promise lấy dữ liệu từ prisma (ko await)
    const resultPrismaPromise = this.prisma.articles.findMany({
      where: where,
      skip: index, //skip bỏ qua tới vị trí index
      take: +pageSize, //lấy về đúng số lượng phần tử
    });
    // khởi tạo promise đếm tổng số lượng bản ghi (ko await)
    const totalItemPromise = this.prisma.articles.count({ 
      where: where
    });
    // chạy song song 2 promise và chờ hoàn thành cả 2
    const [resultPrisma, totalItem] = await Promise.all([resultPrismaPromise, totalItemPromise]);

    return {
      page: page,
      pageSize: pageSize,
      totalItem: totalItem,
      totalPage: Math.ceil(totalItem / pageSize),
      items: resultPrisma,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} article`;
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  remove(id: number) {
    return `This action removes a #${id} article`;
  }
}
