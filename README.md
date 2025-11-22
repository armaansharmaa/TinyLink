# 🔗 TinyLink

![TinyLink Banner](https://https://tiny-url-link-75ad4md32-armaan-sharmas-projects-e257b955.vercel.app/k)

> **The Premium URL Shortener for Modern Needs.**
> Built with Next.js 16, Tailwind CSS 4, and Prisma.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

## ✨ Features

- **🚀 Blazing Fast Redirects**: Optimized routing for instant link navigation.
- **📊 Detailed Analytics**: Track clicks, timestamps, and engagement.
- **🎨 Premium UI**: A stunning, dark-themed interface with smooth animations.
- **🔗 Custom Short Codes**: Create memorable vanity URLs (e.g., `/google`).
- **📱 Fully Responsive**: Works perfectly on desktop, tablet, and mobile.
- **🛡️ Type Safe**: Built with TypeScript and Zod for robust validation.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **ORM**: [Prisma](https://prisma.io/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL Database (Local or Neon)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/armaansharmaa/TinyLink.git
   cd TinyLink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@host:port/db?sslmode=require"
   ```

4. **Setup Database**
   ```bash
   npx prisma migrate dev
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📖 API Documentation

TinyLink provides a RESTful API for programmatic access.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/links` | Create a new short link |
| `GET` | `/api/links` | List all links |
| `GET` | `/api/links/:code` | Get stats for a specific link |
| `DELETE` | `/api/links/:code` | Delete a link |
| `GET` | `/healthz` | Health check endpoint |

### Example: Create a Link

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com", "code": "google"}'
```

## 📦 Deployment

Easily deploy to [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add your `DATABASE_URL` to Vercel Environment Variables.
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
