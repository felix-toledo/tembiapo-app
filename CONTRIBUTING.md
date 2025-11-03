# TEMBIAPÓ - Contribution Workflow & Coding Standards

This document outlines the branching strategy, code commit process, and naming conventions for the TEMBIAPÓ project. Following these rules is **mandatory** to maintain code quality, sustainability, and a clean project history.

## 1. 🏛️ Branching Model (Gitflow-Lite)

We use a simplified version of Gitflow, optimized for CI/CD and monorepo development.

### Core Branches

1.  **`main`**
    - This branch is **Production**. It represents the latest, stable, deployed version of the application.
    - **Rule:** You MUST NOT commit directly to `main`. All changes must come from Pull Requests (PRs) originating from the `develop` branch (this is typically done by a release manager). Luis is the owner of the main branch.

2.  **`develop`**
    - This is our single **Integration Branch**. It is the source of truth for the _next_ version of the application.
    - All new features are merged _into_ this branch.
    - **Rule:** You MUST NOT commit directly to `develop`. All changes must come from Pull Requests (PRs) originating from `feature/` branches. Luis is the owner of the develop branch.

### 🚫 A Note on `front` and `back` Branches

We **do not** use separate `front-develop` or `back-develop` branches.

**Reasoning (The Monorepo Principle):** The core benefit of our architecture is creating **atomic changes**. A single feature (e.g., "User Profile Upload") may require changes to `apps/back` (the endpoint), `apps/front` (the UI), and `packages/db` (the schema). These changes must live in a _single feature branch_ to be reviewed and merged as one cohesive unit. This ensures our system is never in a "half-broken" state and reinforces our "Single Source of Truth" principle.

---

## 2. 🚀 Feature Workflow (Step-by-Step)

This is the standard process for adding any new feature, fix, or enhancement.

### Step 1: Get the Latest Code

Before starting any new work, ensure your `develop` branch is up-to-date with the remote repository.

```bash
# 1. Go to the develop branch
git checkout develop

# 2. Pull the latest changes
git pull origin develop
```

### Step 2: Create Your Feature Branch

All new work must be done on a `feature/` branch (or `fix/`, `chore/`).

**Branch Naming Convention:**
We use the format: `type/scope/short-description`

- **`type`**:
  - `feature/`: For a new feature (e.g., `feature/profile/add-avatar-upload`).
  - `fix/`: For a bug fix (e.g., `fix/auth/jwt-expiration-error`).
  - `chore/`: For maintenance tasks (e.g., `chore/project/update-readme`).
- **`scope`**: (Optional) The main package/app affected (`api`, `client`, `db`, `profile`, `auth`).
- **`short-description`**: A few words in `kebab-case` describing the task.

**Example Command:**

```bash
# Creates and switches to a new branch from 'develop'
git checkout -b feature/profile/add-avatar-upload
```

### Step 3: Commit Your Work (Conventional Commits)

We use **Conventional Commits** to create an explicit and readable commit history. This is non-negotiable.

**Commit Message Format:**
`type(scope): subject`

- **`type`**: `feat` (new feature), `fix` (bug fix), `refactor`, `style`, `chore`, `docs`, `test`.
- **`scope`**: (Optional) The module you worked on: `api`, `client`, `db`, `types`, `auth`, etc.
- **`subject`**: A brief, present-tense description of the change.

**Commit Examples:**

```bash
# Example 1: Adding a new endpoint to the backend
git commit -m "feat(api): create 'GET /professionals/:id' endpoint"

# Example 2: Fixing a UI bug in the frontend
git commit -m "fix(client): ensure profile avatar updates without refresh"

# Example 3: Changing the database schema
git commit -m "feat(db): add 'isIdentityVerified' to Professional model"

# Example 4: Refactoring code for "Código Sostenible"
git commit -m "refactor(client): simplify ProfileCard component state logic"

# Example 5: A simple chore
git commit -m "chore: update pnpm dependencies"
```

### Step 4: Open a Pull Request (PR)

1.  Push your feature branch to the remote repository:

    ```bash
    git push -u origin feature/profile/add-avatar-upload
    ```

2.  Go to GitHub and open a **Pull Request**.
    - **Base Branch:** `develop`
    - **Compare Branch:** `feature/profile/add-avatar-upload`

3.  Fill out the PR template, describing _what_ you did, _why_ you did it, and any steps for testing.

4.  Assign a team member to review your code.

### Step 5: Merge and Clean Up

1.  **Review:** Your PR must be reviewed and approved by at least one other team member.
2.  **Merge:** Once approved, merge the PR into `develop` using the **"Squash and Merge"** option on GitHub. This keeps our `develop` history clean.
3.  **Delete:** Delete your feature branch after it's merged.

---

## 3\. ✍️ Naming Conventions (Código Sostenible)

Our naming conventions are based on the "Código Sostenible" principle: **Names must reveal intention.** We are building a system for "Professionals" and "Clients," not "users" and "data." Use the language of the business domain (TEMBIAPÓ).

### Variables and Properties (`camelCase`)

- **Be Specific & Intentional:**
  - **Bad:** `const data = ...`, `let user = ...`, `const list = ...`
  - **Good:** `const professionalProfile = ...`, `const serviceRequest = ...`, `const availableProfessionals = ...`

- **No Abbreviations:** Write code for human readability.
  - **Bad:** `const srvReq = ...`, `const uId = ...`, `const isVerif = ...`
  - **Good:** `const serviceRequest = ...`, `const userId = ...`, `const isIdentityVerified = ...`

- **Booleans (Clarity):** Must be a clear question.
  - **Bad:** `const verified = ...`, `const profile = ...`
  - **Good:** `const isIdentityVerified = true;`, `const hasActiveSession = false;`

- **Collections (Plurals):** Arrays should always be plural.
  - **Bad:** `const professional = [...]`, `const portfolio = [...]`
  - **Good:** `const professionals = [...]`, `const portfolioItems = [...]`

### Functions & Methods (`camelCase`)

Functions are _actions_. Their names must start with a **verb**.

- **`get...`**: For synchronous, pure retrieval of data.
  - `function getProfessionalById(id: string) { ... }`
  - `function getFullName(profile: Professional) { ... }`

- **`fetch...` / `load...`**: For asynchronous retrieval of data (e.g., an API call).
  - `async function fetchProfessionalProfile(id: string) { ... }`
  - `async function loadPortfolioItems() { ... }`

- **`create...` / `update...` / `delete...`**: For C.R.U.D. operations.
  - `async function createServiceRequest(data: ServiceRequestDto) { ... }`
  - `async function updateProfileBio(id: string, newBio: string) { ... }`

- **`handle...`**: For event handlers in React components.
  - `function handleAvatarUpload(event: React.ChangeEvent) { ... }`
  - `function handleSubmitForm() { ... }`

- **`is...` / `has...`**: For functions that return a boolean.
  - `function isUserVerified(user: User): boolean { ... }`
  - `function hasPortfolio(profile: Professional): boolean { ... }`

### Components & Files

- **React Components (`PascalCase`):**
  - File: `ProfileCard.tsx`
  - Component: `function ProfileCard() { ... }`

- **NestJS Files (Nest Standard):**
  - `professional.service.ts`
  - `professional.controller.ts`
  - `professional.module.ts`

- **General Files (`kebab-case`):**
  - `use-auth-hook.ts`
  - `api-client.ts`
