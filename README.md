# Veritas Forum at JHU

A modern, minimalistic publishing platform for the Johns Hopkins University chapter of the [Veritas Forum](https://www.veritas.org/) / Augustine Collective. Members write and publish essays, reflections, and reviews exploring truth, meaning, and faith within the Hopkins community.

Design inspired by [Yale Logos](https://www.yalelogos.org/) and [Terrain Journal](https://www.terrainjournal.org/) — clean typography, generous whitespace, and a focus on the written word.

## Screenshots

*Coming soon.*

## Tech Stack

| Layer         | Technology                                                  |
| ------------- | ----------------------------------------------------------- |
| Framework     | [Next.js 15](https://nextjs.org/) (App Router, React 19)   |
| Language      | TypeScript                                                  |
| Styling       | Tailwind CSS 4 + `@tailwindcss/typography`                  |
| Database      | PostgreSQL via [Prisma](https://www.prisma.io/) ORM         |
| Auth          | [NextAuth.js v5](https://authjs.dev/) (credentials)         |
| Rich Editor   | [Tiptap](https://tiptap.dev/) (ProseMirror-based)           |
| Fonts         | Playfair Display (serif) + Inter (sans) via `next/font`     |
| Deployment    | [Railway](https://railway.app/)                             |

## Features

### Public Site
- Homepage with featured article hero, recent articles grid, and category navigation
- Individual article pages with rich HTML rendering and author attribution
- Archive page with full article listing
- About page
- Category filtering
- Newsletter subscription form

### Member Dashboard
- Credential-based authentication (email + password)
- Write new articles with the Tiptap rich text editor (images, links, formatting)
- Save drafts and submit for review
- Edit or delete your own articles
- View article status (Draft, Pending, Published, Rejected)

### Admin Panel
- Review and approve/reject pending submissions
- Manage users and roles
- Feature articles on the homepage

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **PostgreSQL** database (local or hosted)
- **npm** (ships with Node)

### 1. Clone and install

```bash
git clone <repo-url> jhu-veritas
cd jhu-veritas
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/jhu_veritas"
AUTH_SECRET="generate-a-random-string-here"
```

Generate `AUTH_SECRET` with:

```bash
npx auth secret
```

### 3. Set up the database

```bash
# Create tables from the Prisma schema
npx prisma migrate dev --name init

# (Optional) Seed with sample data
npx prisma db seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Useful Prisma commands

```bash
npx prisma studio    # Visual database browser at localhost:5555
npx prisma generate  # Regenerate the Prisma client after schema changes
npx prisma migrate deploy  # Apply migrations in production
```

## Project Structure

```
jhu-veritas/
├── prisma/
│   ├── schema.prisma        # Data models (User, Article, Category, NewsletterSubscriber)
│   └── seed.ts              # Database seed script
├── public/                  # Static assets
├── src/
│   ├── app/
│   │   ├── (public)/        # Public routes (articles, archive, about, category)
│   │   ├── api/             # API routes (auth, articles CRUD, newsletter, users)
│   │   ├── auth/            # Login page
│   │   ├── dashboard/       # Authenticated member & admin pages
│   │   │   ├── write/       # New article editor
│   │   │   ├── edit/[id]    # Edit existing article
│   │   │   ├── submissions/ # Admin: review pending articles
│   │   │   └── users/       # Admin: manage users
│   │   ├── layout.tsx       # Root layout (fonts, header, footer)
│   │   └── page.tsx         # Homepage
│   ├── auth.ts              # NextAuth configuration
│   ├── components/
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── editor/          # Tiptap rich text editor
│   │   └── layout/          # Header, Footer
│   ├── lib/
│   │   ├── prisma.ts        # Prisma client singleton
│   │   └── utils.ts         # Shared utilities
│   └── types/               # TypeScript type definitions
├── middleware.ts             # Auth middleware (protects /dashboard/*)
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Deployment

This project is designed to deploy on **Railway**.

1. Create a new Railway project and provision a **PostgreSQL** database.
2. Connect your GitHub repository.
3. Set the following environment variables in Railway:
   - `DATABASE_URL` — provided automatically by the Railway Postgres plugin
   - `AUTH_SECRET` — a random secret string
4. Railway will detect the Next.js project and run `npm run build` automatically.
5. Run database migrations on first deploy:

```bash
npx prisma migrate deploy
```

For other platforms (Vercel, Fly.io, etc.), the process is similar — provision a PostgreSQL database, set environment variables, and ensure migrations run during the build or release step.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please keep code style consistent with the existing codebase and test your changes locally before submitting.

## License

This project is licensed under the [MIT License](LICENSE).
