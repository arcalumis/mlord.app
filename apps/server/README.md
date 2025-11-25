# Server Application

This directory contains the backend of the application, built with Express.js, TypeScript, and Prisma.

## API

The API is versioned under the `/api/v1` prefix.

### Endpoints

*   `GET /api/v1/health`: Returns the health status of the server and its database connection.

## Database

This project uses [Prisma](https://www.prisma.io/) as its ORM. The database schema is defined in `prisma/schema.prisma`.

To apply schema changes to your database, run the following command from this directory (`apps/server`):

```bash
npx prisma migrate dev --name your-migration-name
```

## Development

From the root of the monorepo, run:

```bash
bun run dev
```

The server will be available at `http://localhost:3000`.