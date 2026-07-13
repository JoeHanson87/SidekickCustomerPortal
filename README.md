This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Setup

This project uses GitHub repository secrets for secure credential management. Instead of using `.env.local` files, credentials are stored in GitHub and injected into builds via GitHub Actions and GitHub Codespaces.

### Setting Up GitHub Repository Secrets

1. Go to your repository settings: **Settings** → **Secrets and variables** → **Actions**
2. Add the following repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (from https://app.supabase.com/project/[ID]/settings/api)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous/public key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (keep this secret!)

> **Security Note**: The `SUPABASE_SERVICE_ROLE_KEY` should never be committed to version control. It's only used in server-side code through GitHub Actions workflows and server-side Codespaces configurations.

### Local Development (without Codespaces)

For local development, create a `.env.local` file in the root directory based on `.env.example`:

```bash
cp .env.example .env.local
# Edit .env.local and add your Supabase credentials
```

**Important**: `.env.local` is in `.gitignore` and will never be committed to the repository.

### Development with GitHub Codespaces

GitHub Codespaces automatically uses repository secrets for environment variables. Simply:

1. Click **Code** → **Codespaces** → **Create codespace on main**
2. The `.devcontainer.json` configuration will automatically set up Node.js 20 and all necessary VS Code extensions
3. Environment variables from repository secrets are automatically available

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## CI/CD with GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/build-and-deploy.yml`) that:

- **Builds on every push and pull request** to `main` and `develop` branches
- **Uses repository secrets** for Supabase credentials (no `.env` files needed)
- **Runs linting and type checking** to ensure code quality
- **Builds the Next.js application** with environment variables injected from secrets
- **Deploys to production** (optional - configure your deployment target in the workflow)

The workflow automatically passes repository secrets as environment variables to the build process.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
