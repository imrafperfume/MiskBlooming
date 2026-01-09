# 🌸 MiskBlooming - Premium Flower & Gift Delivery Platform

A modern, full-stack e-commerce platform for flower and gift delivery services built with Next.js 15, TypeScript, Prisma, PostgreSQL, and GraphQL.

![Next.js](https://img.shields.io/badge/Next.js-15.2.8-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Prisma](https://img.shields.io/badge/Prisma-7.0.0-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791)
![GraphQL](https://img.shields.io/badge/GraphQL-Apollo-E10098)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Application](#-running-the-application)
- [Project Structure](#-project-structure)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### Customer Features
- 🛍️ **Product Catalog** - Browse flowers and gifts by category
- 🔍 **Advanced Search** - Filter by occasion, price, category
- 🛒 **Shopping Cart** - Add, remove, and manage cart items
- 💳 **Multiple Payment Options** - Stripe integration & Cash on Delivery
- 🎁 **Gift Options** - Gift wrapping and personalized cards
- 📦 **Order Tracking** - Real-time order status updates
- 💰 **Coupon System** - Apply discount codes and promotions
- 👤 **User Accounts** - Order history and profile management
- 🎫 **Membership Cards** - VIP, Premium, Gold, Platinum tiers
- ⭐ **Product Reviews** - Rate and review products

### Admin Features
- 📊 **Dashboard Analytics** - Sales, revenue, and order statistics
- 📦 **Order Management** - Process and track orders
- 🌹 **Product Management** - CRUD operations with variants
- 👥 **Customer Management** - View and manage customers
- 🎟️ **Coupon Management** - Create and manage discount codes
- 🎯 **Promotion System** - Create promotional campaigns
- 🚚 **Delivery Management** - Configure delivery zones and fees
- 💳 **Payment Settings** - Configure payment methods
- 🎨 **Theme Customization** - Customize site appearance
- 📄 **Content Management** - Manage homepage, about, contact pages
- 🔔 **Notifications** - Real-time order notifications
- 👨‍💼 **Admin Role Management** - Manage admin users

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.2.8 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Custom components + shadcn/ui
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod validation
- **State Management**: Apollo Client + React Context
- **Icons**: Lucide React

### Backend
- **API**: GraphQL (Apollo Server)
- **ORM**: Prisma 7.0.0
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: Custom JWT-based auth
- **File Upload**: Cloudinary
- **Payment**: Stripe

### DevOps
- **Package Manager**: pnpm
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **pnpm** >= 8.x ([Install](https://pnpm.io/installation))
- **PostgreSQL** >= 14.x ([Download](https://www.postgresql.org/download/))
- **Redis** >= 6.x ([Download](https://redis.io/download))
- **Git** ([Download](https://git-scm.com/downloads))

### Optional but Recommended
- **Docker** (for containerized PostgreSQL/Redis)
- **Cloudinary Account** (for image uploads)
- **Stripe Account** (for payment processing)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Kanon-Hosen/MiskBlooming.git
cd MiskBlooming
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all required packages including:
- Next.js and React
- Prisma and database drivers
- Apollo Client/Server
- Tailwind CSS
- And all other dependencies

---

## 🔐 Environment Variables

### 1. Create Environment File

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Open `.env` and configure the following:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/miskblooming?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Cloudinary (Image Upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-upload-preset"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Stripe (Payment)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Email (Optional - for notifications)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### Environment Variable Details

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `REDIS_URL` | Redis connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ Yes |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ✅ Yes |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary upload preset | ✅ Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | ⚠️ For payments |
| `STRIPE_SECRET_KEY` | Stripe secret key | ⚠️ For payments |

---

## 💾 Database Setup

### Recommended: Neon DB (Serverless PostgreSQL)

This project uses **Neon DB** - a serverless PostgreSQL database that's perfect for Next.js applications.

#### 1. Create Neon Account

1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account (no credit card required)
3. Click "Create Project"

#### 2. Configure Your Project

1. **Project Name**: `miskblooming` (or your preferred name)
2. **Region**: Choose closest to your users (e.g., AWS US East, EU West)
3. **PostgreSQL Version**: 16 (latest)
4. Click "Create Project"

#### 3. Get Connection String

After project creation, you'll see your connection details:

```
Connection String (Pooled):
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
```

**Important**: Use the **Pooled Connection** string for better performance with serverless functions.

#### 4. Update Environment Variables

Copy the connection string and add to your `.env`:

```env
# Neon Database (Pooled Connection)
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

#### 5. Neon-Specific Configuration

Since you're using Neon, ensure your Prisma configuration uses the Neon adapter:

**prisma/schema.prisma** should have:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider        = "prisma-client-js"
  binaryTargets   = ["native", "linux-musl", "linux-musl-openssl-3.0.x"]
}
```

**src/lib/db.ts** should use Neon adapter:
```typescript
import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Configure WebSocket for local development
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });
```

#### 6. Neon Features You Can Use

- **Branching**: Create database branches for development
- **Auto-scaling**: Automatically scales to zero when not in use
- **Connection Pooling**: Built-in connection pooling
- **Point-in-time Recovery**: Restore to any point in time
- **Read Replicas**: Add read replicas for better performance

#### 7. Neon Dashboard Features

Access your Neon dashboard to:
- View connection details
- Monitor database usage
- Create branches
- View query statistics
- Manage backups

---

### Alternative: Local PostgreSQL

If you prefer local development:

#### 1. Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

#### 2. Create Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE miskblooming;
CREATE USER miskuser WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE miskblooming TO miskuser;
\q
```

#### 3. Update DATABASE_URL

```env
DATABASE_URL="postgresql://miskuser:your-password@localhost:5432/miskblooming?schema=public"
```

### Alternative: Docker PostgreSQL

```bash
# Run PostgreSQL in Docker
docker run --name miskblooming-db \
  -e POSTGRES_USER=miskuser \
  -e POSTGRES_PASSWORD=your-password \
  -e POSTGRES_DB=miskblooming \
  -p 5432:5432 \
  -d postgres:14
```

### Alternative: Other Cloud Databases

- **Supabase** (Free tier available)
- **Railway** (Easy deployment)
- **AWS RDS**
- **Google Cloud SQL**

---

## 🗄️ Redis Setup

### Option 1: Local Redis

**Ubuntu/Debian:**
```bash
sudo apt install redis-server
sudo systemctl start redis-server
```

**macOS (Homebrew):**
```bash
brew install redis
brew services start redis
```

**Windows:**
Use [Redis for Windows](https://github.com/microsoftarchive/redis/releases)

### Option 2: Docker Redis

```bash
docker run --name miskblooming-redis \
  -p 6379:6379 \
  -d redis:7-alpine
```

### Option 3: Cloud Redis

- **Upstash** (Serverless Redis - Free tier)
- **Redis Cloud**
- **AWS ElastiCache**

---

## 🔧 Prisma Setup

### 1. Generate Prisma Client

```bash
pnpm prisma generate
```

### 2. Run Database Migrations

```bash
pnpm prisma migrate dev
```

This will:
- Create all database tables
- Set up relationships
- Apply indexes

### 3. Seed Database (Optional)

```bash
pnpm prisma db seed
```

This will populate the database with:
- Sample categories
- Sample products
- Default admin user
- Store settings

---

## ▶️ Running the Application

### Development Mode

```bash
pnpm dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **GraphQL Playground**: http://localhost:3000/api/graphql

### Production Build

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Other Useful Commands

```bash
# Type checking
pnpm type-check

# Linting
pnpm lint

# Format code
pnpm format

# Prisma Studio (Database GUI)
pnpm prisma studio
```

---

## 📁 Project Structure

```
MiskBlooming/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.ts               # Database seeding
├── public/                    # Static assets
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (admin)/         # Admin dashboard routes
│   │   │   └── dashboard/
│   │   ├── (public)/        # Public routes
│   │   └── api/             # API routes
│   ├── components/          # React components
│   │   ├── ui/             # UI components
│   │   ├── dashboard/      # Dashboard components
│   │   └── checkout/       # Checkout components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   │   ├── db.ts          # Prisma client
│   │   ├── redis.ts       # Redis client
│   │   └── auth.ts        # Authentication
│   ├── modules/            # GraphQL modules
│   │   ├── product/       # Product resolvers & types
│   │   ├── order/         # Order resolvers & types
│   │   ├── user/          # User resolvers & types
│   │   └── ...
│   └── styles/            # Global styles
├── .env                   # Environment variables
├── .env.example          # Environment template
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm type-check` | Run TypeScript compiler |
| `pnpm prisma generate` | Generate Prisma Client |
| `pnpm prisma migrate dev` | Run migrations (dev) |
| `pnpm prisma studio` | Open Prisma Studio |
| `pnpm prisma db seed` | Seed database |

---

## 🚢 Deployment

### Vercel (Recommended)

Vercel + Neon DB is the perfect combination for deploying this application.

#### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

#### 3. Configure Environment Variables in Vercel

Add these environment variables in Vercel dashboard:

```env
# Database (Use your Neon connection string)
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"

# Redis (Use Upstash for serverless Redis)
REDIS_URL="redis://default:xxx@xxx.upstash.io:6379"

# Authentication
JWT_SECRET="your-production-jwt-secret"
JWT_EXPIRES_IN="7d"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-preset"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App URL
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
NODE_ENV="production"
```

#### 4. Run Database Migrations

After deployment, run migrations using Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Run migrations
vercel env pull .env.production
pnpm prisma migrate deploy
```

#### 5. Recommended Services for Production

- **Database**: Neon DB (already using ✅)
- **Redis**: [Upstash](https://upstash.com) (Serverless Redis)
- **File Storage**: Cloudinary
- **Payments**: Stripe
- **Monitoring**: Vercel Analytics
- **Error Tracking**: Sentry (optional)

### Docker Deployment

```bash
# Build Docker image
docker build -t miskblooming .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="..." \
  -e REDIS_URL="..." \
  miskblooming
```

### Manual Deployment (VPS)

```bash
# On your server
git clone https://github.com/Kanon-Hosen/MiskBlooming.git
cd MiskBlooming
pnpm install
pnpm build

# Use PM2 for process management
pnpm add -g pm2
pm2 start pnpm --name miskblooming -- start
pm2 save
pm2 startup
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `Can't reach database server`

**Solution**:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Verify DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
pnpm prisma db pull
```

#### 2. Redis Connection Error

**Error**: `Redis connection failed`

**Solution**:
```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Restart Redis
sudo systemctl restart redis
```

#### 3. Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
pnpm prisma generate
```

#### 4. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 pnpm dev
```

#### 5. Build Errors

**Solution**:
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm build
```

---

## 🔒 Default Admin Credentials

After seeding the database, use these credentials to access the admin dashboard:

- **Email**: `admin@miskblooming.ae`
- **Password**: `Admin@123`

**⚠️ IMPORTANT**: Change these credentials immediately in production!

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👨‍💻 Developer

**Kanon Hosen**
- GitHub: [@Kanon-Hosen](https://github.com/Kanon-Hosen)

---

## 🆘 Support

For support and questions:
- Open an issue on GitHub
- Contact: info@miskblooming.ae

---

**Made with ❤️ in Dubai, UAE**
