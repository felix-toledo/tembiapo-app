# Project Commands Guide

This guide explains how to set up, run, and manage the **Tembiapo** project. We have unified the commands to make it easier for everyone.

## Prerequisites

Before running the project, ensure you have the following installed:

1.  **Node.js**: (Version compatible with the project, e.g., v20+)
2.  **pnpm**: We use pnpm for package management.
    ```bash
    npm install -g pnpm
    ```
3.  **NestJS CLI** (Global): If you want to run backend commands directly (like generating resources) or use specific `nest` commands from the root, it's recommended to install the CLI globally.
    ```bash
    npm install -g @nestjs/cli
    ```

## Unified Commands (Root)

Run these commands from the **root** folder of the project (`tembiapo-app`).

### 1. Setup Project (Install + DB)

This command installs all dependencies for all apps and packages, and then sets up the database (resets it and runs seeds).

```bash
pnpm run setup:project
```

### 2. Start Development Server (All)

This command starts both the **Frontend** (Next.js) and **Backend** (NestJS) in parallel.

```bash
pnpm run dev
```

### 3. Database Setup Only

If you just want to reset the database and run seeds without reinstalling dependencies:

```bash
pnpm run db:setup
```

### 4. Install Dependencies Only

If you just want to install dependencies:

```bash
pnpm run install:all
```

---

## Running Individual Apps

Sometimes you might want to run only one part of the stack.

### Backend Only

You can run the backend using `pnpm` from the root:

```bash
pnpm --filter tembiapo-backend run dev
```

_Note: `tembiapo-backend` is the package name defined in `apps/back-end/package.json`._

Alternatively, navigate to the folder:

```bash
cd apps/back-end
pnpm run dev
# OR if you have nest cli installed globally:
nest start --watch
```

### Frontend Only

You can run the frontend using `pnpm` from the root:

```bash
pnpm --filter front-end run dev
```

_Note: `front-end` is the package name defined in `apps/front-end/package.json`._

Alternatively, navigate to the folder:

```bash
cd apps/front-end
pnpm run dev
```

## Troubleshooting

- **"Command not found: nest"**: Make sure you installed the Nest CLI globally (`npm i -g @nestjs/cli`) if you are trying to run `nest` commands directly.
- **Database errors**: Run `pnpm run db:setup` to ensure your local database is in sync with the schema and seeded correctly.
