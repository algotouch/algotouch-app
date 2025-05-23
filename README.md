# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/943ea41c-32cf-4f38-9bf8-8a57a35db025

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/943ea41c-32cf-4f38-9bf8-8a57a35db025) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/943ea41c-32cf-4f38-9bf8-8a57a35db025) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)

## Migrations

Recent database migrations can be found in `supabase/migrations`.

- `20250410120000_add_unique_constraint_profiles_phone.sql` adds a unique constraint to the `profiles.phone` column.

## Recovering Missing Payment Tokens

Occasionally a Cardcom webhook may be logged without storing the payment token in
`recurring_payments`. Run the script below to reprocess any webhook entries that
did not create a token or remain unprocessed:

```sh
npx ts-node scripts/reprocess-missing-tokens.ts
```

The script scans `payment_webhooks` for token information and invokes the
`process-webhook` function for any records lacking a corresponding token entry.

### Automated reprocessing

A GitHub Actions workflow runs the same script every day at **1:30&nbsp;AM UTC**.
The workflow requires the following secrets to connect to Supabase:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Ensure these secrets are defined in the repository settings so the scheduled job
can execute successfully.
