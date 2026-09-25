# WFSA Website

Official website for the Washington Filipino Student Alliance (WFSA), a statewide organization connecting Filipino and Asian/Pacific Islander student communities across Washington.

## Tech Stack

- [Next.js](https://nextjs.org/)
- TypeScript
- React
- Tailwind CSS

## Getting Started

### Prerequisites

Install:

- Node.js 20.9+
- npm
- Git

### Installation

Clone the repository:

```bash
git clone <https://github.com/jacobArquiza/washington-fsa-site.git>
cd wfsa-site
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Populate any required environment variables in `.env.local`.

> Never commit `.env.local` or other files containing secrets.

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Development Commands

```bash
npm run dev
```

Runs the application locally in development mode.

```bash
npm run lint
```

Checks the codebase with ESLint.

```bash
npm run typecheck
```

Runs TypeScript type checking without generating output files.

```bash
npm run format
```

Formats the codebase with Prettier.

```bash
npm run format:check
```

Checks whether files conform to the project's Prettier formatting rules.

```bash
npm run build
```

Creates an optimized production build.

## Development Workflow

Development follows an issue-based Git workflow:

1. Create or select a GitHub Issue.
2. Create a feature branch from `main`.
3. Implement and locally verify the change.
4. Open a pull request linked to the Issue.
5. Pass automated quality checks.
6. Review and revise the pull request.
7. Merge into `main`.

Before opening a pull request, run:

```bash
npm run lint
npm run typecheck
npm run format:check
npm run build
```

Testing will be added to this quality gate once the project test framework is configured.

## Environment Variables

Environment variable names should be documented in:

```text
.env.example
```

Actual credentials and secrets belong only in local or deployment environment configuration and must never be committed to Git.

## Project Status

The WFSA website is currently under active development.

Initial development is focused on the core public-facing experience, including:

- Landing page
- Chapter and school information
- Events
- Leadership
- Responsive navigation

Administrative and content-management functionality will be introduced as development progresses.
