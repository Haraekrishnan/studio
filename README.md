# Aries Marine - Task Management System

This is a comprehensive task management application built with Next.js and Firebase Studio. It's designed to help teams organize, track, and manage their work efficiently.

## Key Features

- **Dashboard:** Get a quick overview of team activity, including task statistics and completion charts.
- **Task Management:** A Kanban-style board for managing tasks through different stages (To Do, In Progress, Completed).
- **Planner:** Schedule and organize team events with a monthly calendar view.
- **Performance Tracking:** Analyze individual and team performance with detailed charts and statistics.
- **User Management:** Admins can add, edit, and manage user accounts and roles.
- **Reporting:** Generate and download task reports in Excel or PDF format.
- **AI-Powered Suggestions:** Leverage Genkit to get AI suggestions for task priority and optimal assignees.

## Getting Started

To run the application locally, follow these steps:

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

## Tech Stack

- **Framework:** Next.js (with App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with ShadCN UI components
- **AI:** Google Genkit
- **State Management:** React Context API
- **Forms:** React Hook Form with Zod for validation

## Deploying to Vercel

This Next.js application can be easily deployed to [Vercel](https://vercel.com), a platform made by the creators of Next.js. Follow these steps to get your project live:

### 1. Push Your Code to a Git Repository

If you haven't already, make sure your project code is in a Git repository and pushed to a provider like GitHub, GitLab, or Bitbucket.

### 2. Create a Vercel Account

Sign up for a free account on [Vercel](https://vercel.com/signup), preferably using your Git provider account. This makes importing your project seamless.

### 3. Import and Deploy Your Project

1.  From your Vercel dashboard, click "**Add New...**" and select "**Project**".
2.  Vercel will ask to connect to your Git provider. Grant it access.
3.  Find your project repository in the list and click "**Import**".

### 4. Configure Your Project

Vercel will automatically detect that this is a Next.js project and set up the build commands correctly. The only thing you need to configure is the environment variable for the AI features to work.

1.  Before deploying, expand the "**Environment Variables**" section.
2.  Add the following variable:
    *   **Name:** `GOOGLE_API_KEY`
    *   **Value:** Paste your actual Google AI API key here.

### 5. Deploy

Click the "**Deploy**" button. Vercel will now build and deploy your application. Once finished, you'll be given a public URL to view your live site! Any future pushes to your Git repository's main branch will automatically trigger new deployments.
