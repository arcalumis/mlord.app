# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-11-24

### Added
- Initial project structure with a React frontend and an Express backend.
- Monorepo support using Turborepo to manage the frontend and backend applications.
- Prisma for type-safe database access in the backend.
- A service layer in the backend to separate business logic from route handlers.
- API versioning with the `/api/v1` prefix.
- A comprehensive `.gitignore` file.
- `LICENSE`, `.editorconfig`, `CHANGELOG.md`, and `CONTRIBUTING.md` files for professional polish.
- Health check endpoint for the backend.

### Changed
- Refactored the backend to use Prisma instead of a direct `pg` connection.
- Updated the project to use `bun` as the package manager.
- Restructured the project into an `apps` and `packages` layout.
- Improved graceful shutdown logic in the backend.
