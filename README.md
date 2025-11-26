# ai.mlord.app

> A modern, full-stack application with automated CI/CD, infrastructure as code, and production-grade deployment on AWS.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/arcalumis/mlord.app/actions/workflows/ci.yml/badge.svg)](https://github.com/arcalumis/mlord.app/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://reactjs.org/)

---

## About The Project

A production-ready full-stack application showcasing modern web development practices with enterprise-grade infrastructure. This project demonstrates:

- **Monorepo Architecture:** Efficiently managed with Turborepo for optimal build performance
- **Type-Safe Development:** End-to-end TypeScript for reliability and maintainability
- **Cloud-Native Deployment:** Containerized applications running on AWS ECS Fargate
- **Infrastructure as Code:** Complete AWS infrastructure defined in Terraform
- **Automated CI/CD:** Intelligent workflows with change detection and parallel execution
- **Modern Stack:** React 19, Express.js, Neon PostgreSQL, and Tailwind CSS v4

The project emphasizes developer experience while maintaining production-grade quality standards through comprehensive testing, automated deployments, and robust error handling.

### Screenshots

_Replace this with a screenshot of your running application._

![App Screenshot](https://via.placeholder.com/800x450.png?text=Your+App+Screenshot+Here)

### Built With

This project is built with a curated set of modern technologies:

- **Monorepo:** [Turborepo](https://turbo.build/repo)
- **Package Manager:** [Bun](https://bun.sh/)
- **Frontend:**
  - [React 19](https://reactjs.org/)
  - [Vite](https://vitejs.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend:**
  - [Express.js](https://expressjs.com/)
  - [Prisma](https://www.prisma.io/) (ORM)
  - [Neon](https://neon.tech/) (Serverless PostgreSQL)
- **Infrastructure & DevOps:**
  - [Terraform](https://www.terraform.io/) (Infrastructure as Code)
  - [AWS ECS Fargate](https://aws.amazon.com/fargate/) (Container orchestration)
  - [Amazon ECR](https://aws.amazon.com/ecr/) (Container registry)
  - [Docker](https://www.docker.com/) (Containerization)
- **CI/CD:**
  - [GitHub Actions](https://github.com/features/actions) (Automated testing & deployment)
  - Intelligent change detection for optimized builds
  - Automated database migrations
- **Testing:**
  - [Vitest](https://vitest.dev/) (Unit & Integration testing)
  - [Supertest](https://github.com/ladjs/supertest) (API testing)
- **Code Quality:**
  - [Biome](https://biomejs.dev/) (Linting & Formatting)
  - [TypeScript](https://www.typescriptlang.org/) (Type safety)
  - [EditorConfig](https://editorconfig.org/)

---

## Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

- [Bun](https://bun.sh/docs/installation)
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A running [PostgreSQL](https://www.postgresql.org/download/) database

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/arcalumis/ai.mlord.app.git
    cd ai.mlord.app
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```
3.  **Set up the backend environment:**
    - Navigate to the server directory:
      ```bash
      cd apps/server
      ```
    - Copy the example environment file:
      ```bash
      cp .env.example .env
      ```
    - Update `.env` with your PostgreSQL database connection details.
4.  **Run the development servers:**
    - From the root of the project, run:
      ```bash
      bun run dev
      ```
    ```
    This will start both the frontend and backend servers.
    -   Web app will be available at `http://localhost:5173`
    -   Server will be available at `http://localhost:3000`
    ```

---

## Project Structure

This project is a monorepo managed by Turborepo.

- `apps/web`: The React frontend application.
- `apps/server`: The Express backend application.
- `packages/`: (Optional) For shared code, such as UI components or type definitions.

---

## Infrastructure & Deployment

### AWS Architecture

The application is deployed on AWS using a modern, scalable architecture:

- **Compute:** AWS ECS Fargate (serverless containers)
- **Container Registry:** Amazon ECR
- **Database:** Neon Serverless PostgreSQL
- **Infrastructure as Code:** Terraform configurations in `terraform/`

### CI/CD Pipeline

Comprehensive GitHub Actions workflows provide automated testing and deployment:

#### Automated Testing

- **Linting:** Biome checks for code quality and style consistency
- **Type Checking:** TypeScript compilation validation
- **Unit & Integration Tests:** Vitest with coverage reporting
- **Database Tests:** Automated schema validation with test database

#### Intelligent Deployment

- **Change Detection:** Only builds and deploys modified applications (backend or frontend)
- **Automated Builds:** Docker images built and pushed to ECR on merge to main
- **Database Migrations:** Prisma migrations run automatically before deployment
- **Zero-Downtime Deploys:** Rolling updates via ECS

#### Workflow Features

- Parallel job execution for faster CI runs
- Platform-specific native bindings for optimal performance
- Credentials validation to prevent deployment failures
- Comprehensive test coverage reporting

### Deployment Workflow

1. Push to `main` branch triggers CI pipeline
2. Lint, type-check, and test jobs run in parallel
3. Change detection determines which apps need deployment
4. Docker images are built and pushed to ECR
5. Database migrations run on production database
6. ECS tasks are updated with new images
7. Health checks verify successful deployment

### Infrastructure Management

Terraform configurations are located in `terraform/`:

- VPC and networking setup
- ECS cluster and service definitions
- ECR repositories
- IAM roles and policies
- Security groups and load balancers

To deploy infrastructure:

```bash
cd terraform
terraform init
terraform plan
terraform apply
```

---

## Testing

Run tests locally:

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Generate coverage report
bun test:coverage
```

The test suite includes:

- Unit tests for business logic
- Integration tests for API endpoints
- Database integration tests
- Health check validations

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
