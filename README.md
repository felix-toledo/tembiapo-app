Tembiapó App repository, we generated everything but the front and back repo.

- Packages folder will be for shared interfaces that both front and back have to use.

- We use pnpm, to install you can run

```powershell
npm install -g pnpm@latest-10
```

## 🛠️ Stack

- **Monorepo:** `pnpm` Workspaces
- **Frontend (`apps/front`):** Next.js (App Router), React, TypeScript, Tailwind.
- **Backend (`apps/back`):** NestJS, TypeScript
- **Base de Datos:** PostgreSQL
- **Contrato de Datos (`packages/db`):** Prisma
- **Tipos Compartidos (`packages/types`):** TypeScript

## First Steps

### 1. PNPM

Make sure you have pnpm globally.

### 2. Installation

````powershell
git clone https://github.com/felix-toledo/tembiapo-app.git
cd tembiapo-app
pnpm install```
````

### 3. DB Preparation

Our development environment relies on Docker to ensure a consistent and isolated PostgreSQL database, and on Prisma as our client to manage the schema and data.

#### Step-by-Step Setup

1.  **Create Environment File:**
    Navigate to the `packages/db` workspace. Copy the example environment file to a new `.env` file. The default values are already configured to match Docker.

    ```bash
    cd packages/db
    cp .env.example .env
    cd ../..
    ```

2.  **Start the Database Server:**
    From the project's root directory, start the Docker container in detached mode (`-d`).

    ```bash
    docker-compose up -d
    ```

    _Wait a few seconds for the database to initialize inside the container._

3.  **Apply Schema and Seed:**
    With the server running, you can now use Prisma to apply your schema and seed the database.

    ```bash
    # From the project root

    # Applies any pending migrations and creates the tables
    pnpm --filter db migrate dev

    # Runs the 'initial-seed.ts' script
    pnpm --filter db initial-seed
    ```

Your database is now running and populated with data.

#### Common DB Commands

All commands are run from the project root using `pnpm --filter`:

- **Apply Migrations:** `pnpm --filter db migrate dev`
- **Run Seed:** `pnpm --filter db initial-seed`
- **Open Prisma Studio (GUI):** `pnpm --filter db prisma studio`
- **Generate Prisma Client (after schema change):** `pnpm --filter db prisma generate`

### Rules

1. front never touch db.
2. We cannot use "any" types in ts.
3. intentional names of variables and functions exagerate it.
4. simple functions.
5. packages folder is the source of truth.
