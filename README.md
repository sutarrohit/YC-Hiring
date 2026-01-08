# 🚀 Work at a YC Startup

A modern, high-performance dashboard designed to help developers and job seekers discover and filter YC companies that are currently hiring. Built with **Next.js 15**, **React 19**, and **Tailwind CSS 4**.

![YC Hiring Dashboard Mockup](https://raw.githubusercontent.com/sutarrohit/YC-Hiring/main-bot/public/mockup.png)

## ✨ Features

-   **🔍 Advanced Search**: Real-time filtering by name, description, tags, industry, region, and more.
-   **🏢 All Companies Directory**: Browse the full directory of YC startups beyond just hiring ones.
-   **📅 Smart Batch Filtering**: Easily filter startups by their YC batch year (e.g., S21, W22).
-   **🏢 Industry & Region Filters**: Narrow down companies by specific industries (Fintech, SaaS, AI, etc.) and locations.
-   **📊 Stage Tracking**: Filter by company stage from Seed to Late-stage.
-   **🌙 Dark Mode Support**: Sleek, eye-friendly design that adapts to your system preferences.
-   **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
-   **⚡ High Performance**: Fast data fetching with API caching and optimized React 19 components.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
-   **Library**: [React 19](https://react.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Data Fetching**: [Axios](https://axios-http.com/)
-   **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)

## 🚀 Getting Started

### Prerequisites

-   Node.js 18.x or later
-   npm, yarn, or pnpm

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/sutarrohit/YC-Hiring.git
    cd hiring-bot
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```

4.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000) to see the result.

## 📂 Project Structure

-   `src/app`: Next.js App Router pages and API routes.
-   `src/components`: Reusable UI components (CompanyCard, AdvancedFilter, etc.).
-   `src/types.ts`: TypeScript interfaces for YC company data.
-   `public/`: Static assets including images and fonts.

## 📡 API Reference

The app fetches data from a curated YC hiring dataset:
-   **Endpoint**: `/api/hiring`
-   **Parameters**:
    -   `q`: Search query
    -   `page`: Page number (default: 1)
    -   `limit`: Items per page (default: 100)
    -   `year`: Filter by batch year
    -   `industry`: Filter by industry
    -   `region`: Filter by region
    -   `stage`: Filter by stage

