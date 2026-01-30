import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from '../../modules-system/prisma/prisma.service';

@Injectable()
export class SearchAppService implements OnModuleInit {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private prisma: PrismaService,
  ) {}

  // Hook lifecycle chạy ngay sau khi module được khởi tạo
  // Đồng bộ toàn bộ dữ liệu từ MySQL sang Elasticsearch
  async onModuleInit() {
    this.initArticle();
    this.initUser();
    this.initFood();
  }

  // Đồng bộ dữ liệu bài viết từ MySQL sang Elasticsearch
  async initArticle() {
    // Bước 1: Xóa index 'articles' cũ trong Elasticsearch (nếu có)
    // để đảm bảo dữ liệu được làm mới hoàn toàn
    await this.elasticsearchService.indices.delete({
      index: 'articles', // tên index trong Elasticsearch (giống table trong MySQL)
      ignore_unavailable: true, // không báo lỗi nếu index chưa tồn tại
    });

    // Bước 2: Lấy tất cả bài viết từ MySQL
    const articles = await this.prisma.articles.findMany();

    // Bước 3: Đưa từng bài viết vào Elasticsearch để có thể search
    articles.forEach(async (article) => {
      this.elasticsearchService.index({
        index: 'articles', // tên index để lưu dữ liệu
        id: String(article.id), // ID duy nhất của document
        document: article, // nội dung bài viết cần index
      });
    });
  }

  // Đồng bộ dữ liệu người dùng từ MySQL sang Elasticsearch
  async initUser() {
    await this.elasticsearchService.indices.delete({
      index: 'users', // tên index trong Elasticsearch (giống table trong MySQL)
      ignore_unavailable: true, // không báo lỗi nếu index chưa tồn tại
    });

    // Bước 2: Lấy tất cả người dùng từ MySQL
    const users = await this.prisma.users.findMany();

    // Bước 3: Đưa từng người dùng vào Elasticsearch để có thể search
    users.forEach(async (user) => {
      this.elasticsearchService.index({
        index: 'users', // tên index để lưu dữ liệu
        id: String(user.id), // ID duy nhất của document
        document: user, // nội dung người dùng cần index
      });
    });
  }

  // Đồng bộ dữ liệu món ăn từ MySQL sang Elasticsearch
  async initFood() {
    await this.elasticsearchService.indices.delete({
      index: 'foods', // tên index trong Elasticsearch (giống table trong MySQL)
      ignore_unavailable: true, // không báo lỗi nếu index chưa tồn tại
    });

    // Bước 2: Lấy tất cả món ăn từ MySQL
    const foods = await this.prisma.foods.findMany();

    // Bước 3: Đưa từng món ăn vào Elasticsearch để có thể search
    foods.forEach(async (food) => {
      this.elasticsearchService.index({
        index: 'foods', // tên index để lưu dữ liệu
        id: String(food.id), // ID duy nhất của document
        document: food, // nội dung món ăn cần index
      });
    });
  }

  // Tìm kiếm full-text search trên nhiều index và nhiều trường
  async searchApp(text: string) {
    const result = await this.elasticsearchService.search({
      index: ['articles', 'users', 'foods'], // Tìm kiếm trên 3 index: articles, users, foods
      query: {
        multi_match: {
          // multi_match: tìm kiếm text trên nhiều trường cùng lúc
          query: text, // Từ khóa cần tìm kiếm
          fields: [
            // Danh sách các trường sẽ được tìm kiếm
            'titile', 
            'content', 
            'email', 
            'fulName', 
            'name', 
            'description', 
          ],
        },
      },
    });
    return result;
  }
}
