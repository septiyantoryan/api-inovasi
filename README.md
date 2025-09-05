# INOVASI Backend API

Backend server untuk project INOVASI yang dibangun dengan Express.js, TypeScript, dan Prisma.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 atau lebih tinggi)
- pnpm package manager
- MySQL database

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Setup environment variables:

```bash
cp .env.example .env
```

3. Setup database:

```bash
pnpm run db:generate
pnpm run db:push
```

4. Run development server:

```bash
pnpm run dev
```

Server akan berjalan di http://localhost:3001

## 📁 Project Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── routes/         # Route definitions
├── services/       # Business logic
├── utils/          # Helper functions
├── types/          # TypeScript type definitions
└── index.ts        # Main application file
```

## 🛠️ Available Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build production version
- `pnpm run start` - Start production server
- `pnpm run db:generate` - Generate Prisma client
- `pnpm run db:push` - Push schema changes to database
- `pnpm run db:migrate` - Run database migrations
- `pnpm run db:studio` - Open Prisma Studio

## 📝 API Endpoints

### API Check

- `GET /test` - Check server status
- `GET /` - Welcome message

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Request validation with express-validator
- **JWT Authentication**: Token-based authentication
- **Password Hashing**: Secure password storage with bcrypt

## 🗄️ Database

Database menggunakan MySQL dengan Prisma ORM untuk type-safe database access.

## 🌍 Environment Variables

Lihat file `.env.example` untuk daftar lengkap environment variables yang diperlukan.

## 📦 Installed Packages

### Dependencies

- express - Web framework
- prisma & @prisma/client - Database ORM
- jsonwebtoken - JWT implementation
- bcrypt - Password hashing
- helmet - Security middleware
- cors - CORS middleware
- morgan - HTTP request logger
- express-rate-limit - Rate limiting
- express-validator - Input validation
- dotenv - Environment variables

### Dev Dependencies

- typescript - TypeScript compiler
- ts-node - TypeScript execution
- nodemon - Development server
- @types/\* - TypeScript type definitions
