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

### Rules

1. front never touch db.
2. We cannot use "any" types in ts.
3. intentional names of variables and functions exagerate it.
4. simple functions.
5. packages folder is the source of truth.
