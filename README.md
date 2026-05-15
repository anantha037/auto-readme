# Auto-README Generator

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

## Overview
**Auto-README** is a fully free-to-run, intelligent web application designed to automatically generate professional, open-source standard `README.md` files for any public GitHub repository. Leveraging the Gemini 2.5 Pro and Flash models, it performs deep code analysis of the repository's root architecture and critical entry files to construct factual, visually appealing documentation in seconds.

## System Architecture
*   **`src/lib/github.ts`**: Handles URL parsing and connects to the GitHub REST API to securely fetch the root directory structure and up to 5 critical files (e.g., `package.json`, entry points) while bypassing deep directories to conserve tokens and prevent rate limiting.
*   **`src/lib/gemini.ts`**: Implements dynamic model routing. Defaults to `gemini-2.5-pro` (Temperature 0.3) for high-fidelity analytical generation, with an automatic fallback mechanism to `gemini-2.5-flash` in the event of API quota limits (429) or service outages (503).
*   **`src/app/api/generate/route.ts`**: Next.js App Router API endpoint bridging the frontend request with the GitHub fetching utility and Gemini AI service, returning the raw markdown directly to the client.
*   **`src/app/page.tsx`**: The primary UI shell built with React, Tailwind CSS, and Shadcn UI. It features an interactive markdown preview rendered via `react-markdown` and `@tailwindcss/typography`, along with one-click "Copy to Clipboard" and "Download" functionality leveraging the browser's `Blob` API.

## Prerequisites
Before running the project locally, ensure you have the following installed:
*   Node.js (v18.0.0 or higher)
*   npm or yarn
*   A free Google Gemini API Key

## Installation

```bash
# Clone the repository
git clone https://github.com/anantha037/auto-readme.git
cd auto-readme

# Install core dependencies
npm install

# Install the Tailwind Typography plugin for markdown rendering
npm install -D @tailwindcss/typography

# Set up your environment variables
echo "GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here" > .env.local
```

## Usage

Start the Next.js development server:

```bash
npm run dev
```

1. Open [http://localhost:3001](http://localhost:3001) in your browser.
2. Paste any public GitHub repository URL into the input field.
3. Click **Generate** and wait for the AI to construct your documentation.
4. Review the dynamic output, and use the built-in **Copy** or **Download** buttons at the top right of the preview pane to export your new `README.md` file.

---

**Live Deployment:** [auto-readme-livid.vercel.app](https://auto-readme-livid.vercel.app/)  
**Author:** [Ananthu](https://github.com/anantha037)