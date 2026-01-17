# YC Hiring Bot - Architecture Documentation

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    PRESENTATION LAYER                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │    Pages    │  │ Components  │  │     UI/Styles        │  │ │
│  │  │             │  │             │  │                     │  │ │
│  │  │ • Home      │  │ • Navbar    │  │ • Tailwind CSS 4    │  │ │
│  │  │ • Companies │  │ • CompanyCard│ │ • Dark Mode         │  │ │
│  │  │ • All-Comp  │  │ • ThemeToggle│ │ • Responsive Design │  │ │
│  │  │             │  │ • AdvancedFilter│ │                   │  │ │
│  │  │             │  │ • ThemeProvider│ │                   │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    BUSINESS LOGIC LAYER                     │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │   State     │  │   Hooks     │  │     Utils            │  │ │
│  │  │ Management  │  │             │  │                     │  │ │
│  │  │             │  │             │  │                     │  │ │
│  │  │ • useState  │  │ • useEffect │  │ • Search Logic      │  │ │
│  │  │ • Pagination│  │ • useCallback│  │ • Filter Logic      │  │ │
│  │  │ • Filters   │  │ • Debounce  │  │ • Data Transform    │  │ │
│  │  │ • Search    │  │             │  │                     │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER SIDE                                │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    API LAYER (Next.js)                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │   Routes    │  │   Middleware│  │     Caching          │  │ │
│  │  │             │  │             │  │                     │  │ │
│  │  │ • /api/hiring│  │ • NextRequest│  │ • revalidate (1hr) │  │ │
│  │  │ • /api/all   │  │ • NextResponse│ │ • Static Cache     │  │ │
│  │  │             │  │             │  │                     │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   DATA PROCESSING LAYER                      │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │   Data      │  │   Filter    │  │     Pagination      │  │ │
│  │  │ Fetching    │  │   Engine    │  │                     │  │ │
│  │  │             │  │             │  │                     │  │ │
│  │  │ • Axios     │  │ • Year      │  │ • Page/Limit        │  │ │
│  │  │ • External  │  │ • Industry  │  │ • Total Pages       │  │ │
│  │  │   API       │  │ • Region    │  │ • Slice Logic       │  │ │
│  │  │             │  │ • Stage     │  │                     │  │ │
│  │  │             │  │ • Search    │  │                     │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       EXTERNAL DATA SOURCES                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐       │
│  │   YC OSS    │  │   Static    │  │     Browser          │       │
│  │   API       │  │   Assets    │  │     Storage          │       │
│  │             │  │             │  │                     │       │
│  │ • Companies │  │ • Images    │  │ • Theme Preference   │       │
│  │ • Hiring    │  │ • Icons     │  │ • Search History     │       │
│  │ • Batches   │  │ • Fonts     │  │ • Filter State       │       │
│  └─────────────┘  └─────────────┘  └─────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Architecture

```
User Interaction → Client State → API Request → Server Processing → External API → Response Processing → Client Update → UI Render

Detailed Flow:
1. User types in search bar → Debounced (500ms)
2. User applies filters → State update
3. Component triggers useEffect → API call with params
4. Next.js API route receives request → Parameter parsing
5. Server fetches from YC OSS API → Data filtering
6. Server applies pagination → Response formatting
7. Client receives paginated data → State update
8. React re-renders components → UI updates
```

## 📁 Project Structure

```
hiring-bot/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout with theme provider
│   │   ├── page.tsx                 # Home page (hiring companies)
│   │   ├── companies/page.tsx       # Companies listing page
│   │   ├── all-companies/page.tsx   # All companies directory
│   │   ├── globals.css              # Global styles & Tailwind
│   │   └── api/                     # API routes
│   │       ├── hiring/route.ts      # Hiring companies API
│   │       └── all/route.ts         # All companies API
│   ├── components/                   # Reusable UI components
│   │   ├── Navbar.tsx               # Navigation header
│   │   ├── CompanyCard.tsx          # Company display card
│   │   ├── ThemeToggle.tsx          # Dark mode toggle
│   │   ├── AdvancedFilter.tsx       # Filter panel
│   │   └── ThemeProvider.tsx        # Theme context provider
│   └── types.ts                      # TypeScript interfaces
├── public/                           # Static assets
│   ├── og.png                       # Open graph image
│   ├── icon.png                     # Favicon
│   └── favicon.ico                  # Alternative favicon
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.mjs               # PostCSS configuration
└── README.md                        # Project documentation
```

## 🎯 Component Hierarchy

```
App (layout.tsx)
├── ThemeProvider
│   └── Navbar
│       ├── Logo/Title
│       ├── Navigation Links
│       └── ThemeToggle
└── Page Components
    ├── Home (page.tsx)
    │   ├── Search Bar
    │   ├── Filter Toggle Button
    │   ├── AdvancedFilter
    │   ├── Company Grid
    │   │   └── CompanyCard (repeated)
    │   └── Pagination Controls
    ├── Companies (companies/page.tsx)
    │   └── [Similar structure to Home]
    └── All-Companies (all-companies/page.tsx)
        └── [Similar structure to Home]
```

## 🔧 Technology Stack

### Frontend Framework
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library with latest features
- **TypeScript 5** - Type safety and better DX

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **next-themes 0.4.6** - Dark mode support
- **PostCSS** - CSS processing

### Data Fetching
- **Axios 1.13.2** - HTTP client for API calls
- **Next.js API Routes** - Backend API endpoints

### Development Tools
- **ESLint 9** - Code linting
- **Babel React Compiler 1.0.0** - React optimization

## 🗄️ Data Models

### YCCompany Interface
```typescript
interface YCCompany {
  id: number;
  name: string;
  slug: string;
  former_names: string[];
  small_logo_thumb_url: string;
  website: string;
  all_locations: string;
  long_description: string;
  one_liner: string;
  team_size: number;
  industry: string;
  subindustry: string;
  launched_at: number;
  tags: string[];
  tags_highlighted: string[];
  top_company: boolean;
  isHiring: boolean;
  nonprofit: boolean;
  batch: string;
  status: string;
  industries: string[];
  regions: string[];
  stage: string;
  // ... additional fields
}
```

### PaginatedResponse Interface
```typescript
interface PaginatedResponse {
  companies: YCCompany[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## 🚀 Performance Optimizations

### Client Side
- **Debounced Search** - 500ms delay to reduce API calls
- **React.memo** - Prevent unnecessary re-renders
- **useCallback** - Memoize event handlers
- **Lazy Loading** - Load images on demand

### Server Side
- **Static Caching** - 1-hour revalidation for API routes
- **Pagination** - Limit data transfer (100 items per page)
- **Efficient Filtering** - Server-side filtering reduces payload
- **Batch Processing** - Sort and filter operations optimized

### Network
- **Axios Caching** - HTTP client with request caching
- **Compression** - Next.js automatic response compression
- **CDN Ready** - Static assets optimized for CDN

## 🔒 Security Considerations

- **CORS Headers** - Proper cross-origin configuration
- **Input Validation** - Parameter sanitization in API routes
- **Rate Limiting** - Implicit through Next.js API routes
- **No Secrets** - No API keys or sensitive data in client code

## 📱 Responsive Design Strategy

- **Mobile First** - Design starts at 320px
- **Breakpoints**: sm(640px), md(768px), lg(1024px), xl(1280px)
- **Grid System**: 1-4 columns based on screen size
- **Touch Friendly** - Appropriate button sizes and spacing

## 🎨 Theme System

- **CSS Variables** - Dynamic color switching
- **Dark Mode** - System preference detection
- **Smooth Transitions** - Theme change animations
- **Accessibility** - WCAG compliant color contrasts