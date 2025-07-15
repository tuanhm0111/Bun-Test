# QuickStart API Server

Một RESTful API server được xây dựng với Node.js, Express, TypeScript, Prisma và Bun runtime. Dự án này cung cấp một foundation chắc chắn cho việc phát triển API với các tính năng hiện đại như authentication, validation, logging, error handling và database management.

## 🚀 Tính năng chính

- **Express.js**: Framework web nhanh và minimalist
- **TypeScript**: Type safety và modern JavaScript features
- **Prisma ORM**: Database toolkit hiện đại với type-safe queries
- **Bun Runtime**: JavaScript runtime cực nhanh thay thế cho Node.js
- **Authentication**: JWT-based authentication system
- **Validation**: Input validation với Zod
- **Logging**: Structured logging với Winston
- **Error Handling**: Centralized error handling
- **Security**: Helmet, CORS, input sanitization
- **Database**: MySQL với Prisma migrations

## 📁 Cấu trúc dự án

```
quickstart/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── index.ts               # Server entry point
│   ├── config/
│   │   ├── database.ts        # Prisma client configuration
│   │   ├── env.ts             # Environment variables validation
│   │   └── index.ts           # Config exports
│   ├── controllers/
│   │   ├── auth.controller.ts # Authentication endpoints
│   │   ├── user.controller.ts # User management endpoints
│   │   └── index.ts           # Controller exports
│   ├── middleware/
│   │   ├── auth.middleware.ts # JWT authentication middleware
│   │   ├── error.middleware.ts # Error handling middleware
│   │   ├── logger.middleware.ts # Request logging middleware
│   │   └── validation.middleware.ts # Input validation middleware
│   ├── routes/
│   │   ├── auth.routes.ts     # Authentication routes
│   │   ├── user.routes.ts     # User management routes
│   │   └── index.ts           # Route aggregation
│   ├── services/
│   │   ├── auth.service.ts    # Authentication business logic
│   │   ├── user.service.ts    # User management business logic
│   │   └── index.ts           # Service exports
│   ├── types/
│   │   ├── auth.types.ts      # Authentication type definitions
│   │   ├── user.types.ts      # User type definitions
│   │   ├── common.type.ts     # Common type definitions
│   │   └── index.ts           # Type exports
│   └── utils/
│       ├── appError.ts        # Custom error class
│       ├── constants.ts       # Application constants
│       ├── helpers.ts         # Utility functions
│       ├── logger.ts          # Winston logger configuration
│       └── validators/        # Zod validation schemas
│           └── user.validator.ts
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── logs/                      # Application logs
├── package.json               # Dependencies và scripts
├── tsconfig.json              # TypeScript configuration
└── bun.lock                   # Bun lockfile
```

## 🗄️ Database Schema

Dự án sử dụng MySQL với các bảng chính:

- **Users**: Quản lý người dùng (id, email, username, password, profile info)
- **Categories**: Danh mục bài viết (id, name, slug, description)
- **Posts**: Bài viết (id, title, content, status, author, category)
- **Comments**: Bình luận (id, content, user, post)

## 🔧 Cài đặt và Chạy

### Yêu cầu hệ thống

- [Bun](https://bun.sh) v1.2.17 trở lên
- MySQL 8.0 trở lên
- Node.js 18+ (nếu không dùng Bun)

### Cài đặt dependencies

```bash
bun install
```

### Cấu hình môi trường

Tạo file `.env` trong thư mục root:

```env
# Server Configuration
NODE_ENV=development
PORT=3009
API_VERSION=v1
CORS_ORIGIN=*

# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/quickstart"

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d
```

### Chạy database migrations

```bash
# Tạo database và chạy migrations
bunx prisma migrate dev

# Hoặc reset database (chỉ dùng trong development)
bunx prisma migrate reset

# Generate Prisma client
bunx prisma generate

# Mở Prisma Studio để xem database
bunx prisma studio
```

### Khởi chạy server

```bash
# Development mode (hot reload)
bun dev

# Production mode
bun start
```

Server sẽ chạy tại `http://localhost:3009`

## 📚 API Documentation

### Base URL
```
http://localhost:3009/api/v1
```

### Authentication
API sử dụng JWT tokens. Thêm token vào header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### API Check
```http
GET /
```

#### Users Management
```http
GET    /api/v1/users              # Lấy danh sách users (với pagination)
GET    /api/v1/users/:id          # Lấy thông tin user theo ID
GET    /api/v1/users/:id/profile  # Lấy profile user theo ID
POST   /api/v1/users              # Tạo user mới
PUT    /api/v1/users/:id          # Cập nhật user
PATCH  /api/v1/users/:id/status   # Cập nhật trạng thái user
PATCH  /api/v1/users/:id/change-password  # Đổi password user
DELETE /api/v1/users/:id          # Xóa user
```

#### Query Parameters (GET /users)
- `page`: Trang hiện tại (default: 1)
- `limit`: Số lượng items per page (default: 10, max: 100)
- `search`: Tìm kiếm theo email, username, firstName, lastName
- `sortBy`: Sắp xếp theo field (id, email, username, firstName, lastName, createdAt, updatedAt)
- `sortOrder`: Thứ tự sắp xếp (asc/desc, default: desc)

#### Request Examples
```bash
# Lấy danh sách users với pagination
GET /api/v1/users?page=1&limit=10

# Tìm kiếm users theo tên
GET /api/v1/users?search=john&page=1&limit=10

# Sắp xếp users theo email
GET /api/v1/users?sortBy=email&sortOrder=asc

# Kết hợp nhiều parameters
GET /api/v1/users?search=admin&sortBy=createdAt&sortOrder=desc&page=1&limit=5
```

#### Response Format
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  },
  "errors": [] // Array of error messages (chỉ có khi có lỗi)
}
```

#### Pagination Response Format
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "data": [
      // Array of user objects
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🏗️ Kiến trúc và Flow

### 1. Kiến trúc Layered

```
Request → Routes → Middleware → Controller → Service → Database
```

- **Routes**: Định nghĩa endpoints và áp dụng middleware
- **Middleware**: Xử lý authentication, validation, logging
- **Controllers**: Xử lý HTTP requests/responses
- **Services**: Business logic và database operations
- **Database**: Prisma ORM với MySQL

### 2. Flow xử lý request

1. **Request đến server** → Express router
2. **Middleware pipeline**:
   - Logger middleware (log request)
   - CORS và Security headers
   - Body parsing
   - Authentication (nếu cần)
   - Validation (nếu cần)
3. **Controller** nhận request đã được validate
4. **Service** thực hiện business logic
5. **Database** operations qua Prisma
6. **Response** được format và trả về
7. **Error handling** nếu có lỗi xảy ra

### 3. Error Handling Flow

```
Error → AppError → Error Middleware → Formatted Response
```

## 🛠️ Development Guidelines

### Code Style
- Sử dụng TypeScript strict mode
- Follow ESLint và Prettier rules
- Async/await cho asynchronous operations
- Proper error handling với try-catch

### Database Operations
- Sử dụng Prisma Client cho type-safe queries
- Implement proper error handling cho database errors
- Use transactions cho complex operations
- Sử dụng Prisma migrations cho database schema changes

### Validation
- Input validation với Zod schemas
- Middleware-based validation approach
- Consistent error response format
- Type-safe validation với TypeScript inference

### Security Best Practices
- Input validation với Zod
- Password hashing với bcrypt
- JWT tokens cho authentication
- Rate limiting và CORS configuration

## 🔍 Monitoring và Logging

### Logs
- **Development**: Console output với colors
- **Production**: File-based logging
- **Levels**: error, warn, info, debug

### Log Files
- `logs/error.log`: Error logs only
- `logs/combined.log`: All logs

## 🚀 Deployment

### Production Build
```bash
# Build TypeScript
bun run build

# Start production server
bun start
```

### Environment Variables (Production)
```env
NODE_ENV=production
PORT=80
DATABASE_URL="mysql://user:pass@prod-db:3306/quickstart"
JWT_SECRET=your-production-secret-key-min-32-chars
JWT_EXPIRE=7d
CORS_ORIGIN=https://yourdomain.com
```

## 📝 License

This project is licensed under the MIT License.

---

## 📚 Resources

- [Bun Documentation](https://bun.sh/docs)
- [Prisma Documentation](https://prisma.io/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Zod Documentation](https://zod.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Node.js Roadmap](https://roadmap.sh/nodejs)

## 🔧 Troubleshooting

### Common Issues

#### 1. Database connection error
- **Vấn đề**: Không thể kết nối database
- **Giải pháp**: Kiểm tra DATABASE_URL trong file `.env`

#### 2. Validation errors
- **Vấn đề**: Zod validation failed
- **Giải pháp**: Kiểm tra request body/params format

#### 3. JWT errors
- **Vấn đề**: Token không valid
- **Giải pháp**: Kiểm tra JWT_SECRET trong `.env`

### Development Tips

```bash
# Xem database schema
bunx prisma studio

# Reset database
bunx prisma migrate reset

# Check logs
tail -f logs/error.log
tail -f logs/combined.log

# Debug với Bun
bun --inspect src/index.ts
```

## 🧪 Testing

### Manual Testing với cURL

```bash
# Create user
curl -X POST http://localhost:3009/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "password": "password123"
  }'

# Get users with search
curl -X GET "http://localhost:3009/api/v1/users?search=test&page=1&limit=10"

# Get user by ID
curl -X GET http://localhost:3009/api/v1/users/1

# Update user
curl -X PUT http://localhost:3009/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'

# Delete user
curl -X DELETE http://localhost:3009/api/v1/users/1
```
