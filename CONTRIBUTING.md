# Contributing

Thank you for your interest in contributing to this project! All contributions that improve the project are welcome.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** to your local machine:
    ```bash
    git clone https://github.com/YOUR_USERNAME/ai.mlord.app.git
    cd ai.mlord.app
    ```
3.  **Install dependencies** using Bun:
    ```bash
    bun install
    ```
4.  **Set up environment variables:**
    -   Copy the example environment file for the server:
        ```bash
        cp apps/server/.env.example apps/server/.env
        ```
    -   Fill in the required variables in `apps/server/.env`.
5.  **Run the development servers:**
    ```bash
    bun run dev
    ```

## Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting. Please ensure your code adheres to the project's style by running the following commands before committing:

-   **Check for issues:**
    ```bash
    bun run lint
    ```
-   **Format your code:**
    ```bash
    cd apps/web && bun run format && cd ../..
    cd apps/server && bun run format && cd ../..
    ```

## Submitting a Pull Request

1.  Create a new branch for your feature or bug fix:
    ```bash
    git checkout -b feat/your-feature-name
    ```
2.  Make your changes and commit them with a descriptive message. This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
3.  Push your changes to your fork:
    ```bash
    git push origin feat/your-feature-name
    ```
4.  Open a **Pull Request** from your fork to the main repository's `main` branch. Provide a clear title and description of your changes.
