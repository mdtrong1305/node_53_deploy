# Cyber Community Backend

## Mô tả

Backend API cho hệ thống Cyber Community - một nền tảng cộng đồng trực tuyến. Dự án được xây dựng với NestJS framework, sử dụng Prisma ORM để quản lý database MariaDB/MySQL, tích hợp JWT authentication, validation tự động với class-validator, và nhiều tính năng hiện đại khác.

## Công nghệ sử dụng

### Core Technologies
- **NestJS v11** - Framework Node.js mạnh mẽ, có cấu trúc rõ ràng cho backend
- **TypeScript** - Ngôn ngữ lập trình với static typing
- **Prisma ORM v7** - ORM hiện đại, type-safe cho database
- **MariaDB/MySQL** - Hệ quản trị cơ sở dữ liệu quan hệ

### Authentication & Security
- **JWT (jsonwebtoken)** - Xác thực người dùng với Access Token và Refresh Token
- **bcrypt** - Mã hóa mật khẩu an toàn

### Caching & Search
- **Redis** - In-memory data store cho caching, session management, và real-time features
- **@nestjs/cache-manager** - NestJS caching module
- **@keyv/redis** - Redis adapter cho cache-manager
- **Elasticsearch** - Search engine cho full-text search trên nhiều index
- **@nestjs/elasticsearch** - NestJS Elasticsearch module
- **Kibana** - Visualization tool cho Elasticsearch

### Validation & Transformation
- **class-validator** - Validate dữ liệu đầu vào tự động
- **class-transformer** - Transform và serialize dữ liệu

### Development Tools
- **ESLint** - Linting code
- **Prettier** - Format code
- **Jest** - Testing framework

## Hướng dẫn cài đặt

## Lưu ý khi sử dụng Microservice

Khi sử dụng microservice với NestJS, cần phân biệt rõ hai kiểu giao tiếp:

- Nếu sử dụng phương thức `send` để gửi message từ client, phía service nhận phải sử dụng decorator `@MessagePattern` để lắng nghe message tương ứng. Nếu không có `@MessagePattern`, message sẽ không được xử lý.

	**Ví dụ:**
	```ts
	// Client gửi message
	this.client.send('createOrder', data)
  
	// Service nhận message
	@MessagePattern('createOrder')
	handleCreateOrder(data: any) {
		// Xử lý order
	}
	```
	> Lưu ý: `send` luôn phải đi đôi với `@MessagePattern` ở phía nhận.

- Nếu sử dụng phương thức `emit` để gửi sự kiện từ client, phía service nhận phải sử dụng decorator `@EventPattern` để lắng nghe sự kiện tương ứng. Nếu không có `@EventPattern`, sự kiện sẽ không được xử lý.

	**Ví dụ:**
	```ts
	// Client gửi sự kiện
	this.client.emit('createEmail', data)
  
	// Service nhận sự kiện
	@EventPattern('createEmail')
	handleOrderCreated(data: any) {
		// Xử lý sự kiện createEmail
	}
	```
	> Lưu ý: `emit` luôn phải đi đôi với `@EventPattern` ở phía nhận.

### Yêu cầu
- Node.js >= 18
- npm hoặc yarn
- MariaDB hoặc MySQL
- Redis (optional, cho caching)
- Git

###  Bonus: cách cài modules nhanh bẳng lệnh
```bash
nest g resource 'folder chứa module'/'tên module'
```

### Các bước cài đặt

1. **Clone repository**
```bash
git clone <repository-url>
cd cyber-comunity
```

2. **Cài đặt dependencies**
```bash
npm install
```

**Lưu ý:** Nếu bạn muốn sử dụng Redis caching, đảm bảo cài đặt:
```bash
npm install @nestjs/cache-manager @keyv/redis cache-manager
```
## Cài đặt Redis (Docker)

Dự án sử dụng Redis cho caching và session management. Chạy lệnh sau để khởi động Redis container:

```bash
docker run --name some-redis -d -p host:6379 redis
```

## Cài đặt RabbitMQ (Docker)

Dự án có thể sử dụng RabbitMQ cho message queue. Chạy lệnh sau để khởi động RabbitMQ container:

```bash
docker run -d --hostname my-rabbit --name rabbit-node53 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=12345 -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

## Cài đặt Elasticsearch (Docker)

Dự án sử dụng Elasticsearch cho tìm kiếm và phân tích dữ liệu. Chạy các lệnh sau:

```bash
# Tạo network cho Elasticsearch
docker network create elastic

# Pull Elasticsearch image
docker pull docker.elastic.co/elasticsearch/elasticsearch:9.2.4

# Chạy Elasticsearch container
docker run --name es01 --net elastic -p 9200:9200 -it -m 1GB -d docker.elastic.co/elasticsearch/elasticsearch:9.2.4

# Pull Kibana image
docker pull docker.elastic.co/kibana/kibana:9.2.4

# Chạy Kibana container
docker run --name kib01 --net elastic -p 5601:5601 -d docker.elastic.co/kibana/kibana:9.2.4
```

3. **Tạo file .env**
Tạo file `.env` ở thư mục gốc với nội dung:
```env
# Server
PORT=3000

# Database
DATABASE_URL="mysql://username:password@localhost:3306/database_name"

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here

# Redis Cache (format: redis://[username]:[password]@host:port)
DATABASE_REDIS=redis://localhost:6379

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (optional)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. **Cấu hình Database**
- Tạo database trong MariaDB/MySQL
- Cập nhật DATABASE_URL trong file .env

5. **Setup Prisma**

### Trường hợp đã có sẵn database và bảng
Nếu bạn đã tạo sẵn database và các bảng thủ công (không dùng migration), hãy làm theo các bước sau để đồng bộ Prisma với database:

1. Đảm bảo DATABASE_URL trong file .env trỏ đúng vào database đã có bảng.
2. Cài đặt prisma bằng lệnh sau
```bash
npm install prisma @types/node --save-dev
npm install @prisma/client @prisma/adapter-mariadb dotenv
```
3. Chạy lệnh sau để tạo ra schema.prisma
```bash
npx prisma init --datasource-provider mysql
```
4. Chạy lệnh sau để Prisma tự động lấy cấu trúc bảng về file schema.prisma:

```bash
npx prisma db pull
```
5. Sau khi thay đổi file `prisma/schema.prisma`, chạy lệnh sau để generate client:
```bash
npx prisma generate
```

> Sau khi chạy `npx prisma generate`, bạn cần tạo PrismaService để sử dụng Prisma Client trong NestJS:
>
> **Bước 1:** Tạo file `src/modules-system/prisma/prisma.service.ts`
> ```ts
> import { Injectable } from '@nestjs/common';
> import { PrismaClient } from './generated/prisma/client';
> import { PrismaMariaDb } from '@prisma/adapter-mariadb';
> import { DATABASE_URL } from 'src/common/constant/app.constant';
> 
> @Injectable()
> export class PrismaService extends PrismaClient {
>   constructor() {
>     // Parse DATABASE_URL để lấy thông tin kết nối
>     const url = new URL(DATABASE_URL as string);
>     
>     // Khởi tạo MariaDB adapter với các thông số từ DATABASE_URL
>     const adapter = new PrismaMariaDb({
>       host: url.hostname,           // Hostname từ URL
>       user: url.username,           // Username từ URL
>       password: url.password,       // Password từ URL
>       database: url.pathname.substring(1), // Database name (bỏ dấu / đầu)
>       port: Number(url.port),       // Port number
>       connectionLimit: 5            // Giới hạn số kết nối đồng thời
>     });
>     
>     // Gọi constructor của PrismaClient với adapter
>     super({ adapter });
>   }
> }
> ```
>
> **Bước 2:** Tạo file `src/modules-system/prisma/prisma.module.ts`
> ```ts
> import { Global, Module } from '@nestjs/common';
> import { PrismaService } from './prisma.service';
> 
> @Global() // Đánh dấu module này là global, có thể dùng ở mọi nơi không cần import
> @Module({
>   providers: [PrismaService],  // Đăng ký PrismaService làm provider
>   exports: [PrismaService],    // Export để các module khác có thể sử dụng
> })
> export class PrismaModule {}
> ```
>
> **Bước 3:** Import `PrismaModule` vào `src/app.module.ts`
> ```ts
> import { Module } from '@nestjs/common';
> import { ConfigModule } from '@nestjs/config';
> import { PrismaModule } from './modules-system/prisma/prisma.module';
> // ... import các module khác
> 
> @Module({
>   imports: [
>     PrismaModule,            // Import PrismaModule để sử dụng Prisma trong toàn app
>     // ... các module khác
>   ],
>   controllers: [],
>   providers: [],
> })
> export class AppModule {}
> ```

## Cấu trúc Database

Project sử dụng các bảng chính sau:

### Users
- Quản lý thông tin người dùng
- Hỗ trợ đăng nhập thông thường và OAuth (Google)
- Các trường: id, email, fullName, avatar, password, googleId

### Articles
- Quản lý bài viết của người dùng
- Các trường: id, title, content, imageUrl, views, userId

### Foods & Orders
- Quản lý món ăn và đơn hàng
- Liên kết giữa Users và Foods thông qua Orders

### Chat System (ChatGroups, ChatGroupMembers, ChatMessages)
- Hệ thống chat nhóm
- Quản lý nhóm chat, thành viên và tin nhắn

## Chạy ứng dụng

```bash
# Development mode với auto-reload
npm run start:dev

# Production mode
npm run start:prod

# Debug mode
npm run start:debug
```

Server sẽ chạy tại: `http://localhost:{port}`

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## Build

```bash
# Build project
npm run build

# Build output sẽ ở thư mục dist/
```

## API Endpoints

| Method | Endpoint | Mô tả | Công nghệ sử dụng (chỉ ghi nếu có service logic) |
|--------|----------|-------|------------------|
| POST | `/api/auth/login` | Đăng nhập | JWT, bcrypt, class-validator |
| GET | `/api/article` | Lấy danh sách bài viết (có cache 5s) | Prisma ORM, Redis cache, @nestjs/cache-manager |
| POST | `/api/order` | Tạo đơn hàng mới (có microservice) | RabbitMQ client, class-validator |
| GET | `/api/search-app` | Tìm kiếm toàn văn trên articles, users, foods | Elasticsearch, @nestjs/elasticsearch |

## Cấu trúc thư mục

```
cyber-comunity/
├── prisma/
│   ├── schema.prisma          # Định nghĩa schema cho Prisma
│   └── migrations/            # Thư mục migration của Prisma
├── src/
│   ├── common/
│   │   ├── constant/          # Hằng số toàn app
│   │   ├── decorators/        # Custom decorators
│   │   ├── guards/            # Guard bảo vệ route
│   │   ├── helper/            # Helper functions
│   │   └── interceptors/      # Interceptor toàn cục
│   ├── modules-api/           # Các module API chính
│   │   ├── article/           # Quản lý bài viết
│   │   │   ├── dto/
│   │   │   ├── article.controller.ts
│   │   │   ├── article.service.ts
│   │   │   └── article.module.ts
│   │   ├── auth/              # Đăng nhập, xác thực
│   │   │   ├── dto/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── order/             # Quản lý đơn hàng, giao tiếp microservice (client)
│   │   │   ├── dto/
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   └── order.module.ts
│   │   ├── search-app/        # Tìm kiếm toàn văn
│   │   │   ├── search-app.controller.ts
│   │   │   ├── search-app.service.ts
│   │   │   └── search-app.module.ts
│   ├── modules-system/        # Các module hệ thống, tích hợp ngoài
│   │   ├── elastic-search/    # Tích hợp Elasticsearch
│   │   │   └── elastic-search.module.ts
│   │   ├── prisma/            # Cấu hình Prisma, PrismaService
│   │   │   ├── prisma.module.ts
│   │   │   ├── prisma.service.ts
│   │   │   └── generated/
│   │   ├── rabbit-mq/         # Cấu hình RabbitMQ (client)
│   │   │   └── rabbit-mq.module.ts
│   │   ├── token/             # Xử lý JWT, token
│   │   │   ├── token.module.ts
│   │   │   └── token.service.ts
│   └── main.ts                # File khởi động app (REST API)
├── test/                      # Thư mục test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── package.json
├── tsconfig.json
├── ...
```

> Lưu ý: Nếu là microservice server (consumer), file main.ts sẽ dùng createMicroservice và lắng nghe queue, còn nếu là client thì cấu hình client proxy ở modules-system/rabbit-mq hoặc tương tự.