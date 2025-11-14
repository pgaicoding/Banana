# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nano Banana is an AI-powered image editing platform built with Next.js 16 that allows users to transform images using natural language prompts. The application features a landing page with an interactive image editor demo, showcasing multi-image upload and text-to-image capabilities.

## Technology Stack

- **Framework**: Next.js 16 (App Router with React Server Components)
- **React**: v19.2.0
- **TypeScript**: v5
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui (New York style variant)
- **Package Manager**: pnpm
- **Analytics**: Vercel Analytics

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start

# Lint the codebase
pnpm lint
```

## Architecture

### Directory Structure

- **`app/`**: Next.js App Router pages and layouts
  - `layout.tsx`: Root layout with metadata, fonts (Geist/Geist Mono), and analytics
  - `page.tsx`: Homepage assembling all landing page sections
  - `globals.css`: Global styles with Tailwind imports and CSS custom properties

- **`components/`**: React components organized by purpose
  - Top-level components: Major page sections (Header, Footer, HeroSection, ImageEditor, etc.)
  - `ui/`: shadcn/ui primitives (53+ reusable components)

- **`hooks/`**: Custom React hooks
  - `use-toast.ts`: Toast notification management
  - `use-mobile.ts`: Responsive breakpoint detection

- **`lib/`**: Utility functions
  - `utils.ts`: Contains `cn()` helper for className merging with clsx and tailwind-merge

- **`public/`**: Static assets (icons, images)

- **`styles/`**: Additional stylesheets

### Key Architectural Patterns

1. **Component Organization**: Landing page is broken into discrete section components (HeroSection, ShowcaseSection, TestimonialsSection, FAQSection) assembled in `app/page.tsx`

2. **UI Component System**: Uses shadcn/ui configured with:
   - Base color: neutral
   - CSS variables enabled for theming
   - Path aliases: `@/components`, `@/lib`, `@/hooks`, `@/ui`
   - Icon library: lucide-react

3. **Styling System**:
   - Tailwind CSS v4 with PostCSS
   - Custom design tokens using oklch color space
   - Dark mode support via CSS custom properties
   - Custom variant: `dark` selector
   - Theme values defined in `globals.css` (background, foreground, primary, secondary, etc.)

4. **Image Editor**: Client-side component (`'use client'`) with:
   - Multi-image drag-and-drop upload
   - File input for batch image selection
   - Prompt textarea for natural language commands
   - Preview gallery (currently UI-only, no backend integration)

5. **TypeScript Configuration**:
   - Strict mode enabled
   - Path alias: `@/*` maps to project root
   - Build errors ignored in Next.js config (set `typescript.ignoreBuildErrors: true`)

## Important Configuration Notes

- **Image Optimization**: Disabled (`images.unoptimized: true` in next.config.mjs)
- **TypeScript**: Build errors are currently ignored - fix type issues before committing
- **Font Loading**: Uses next/font/google for Geist and Geist Mono fonts
- **Theme Icons**: Multiple favicon variants for light/dark mode preferences

## shadcn/ui Component Management

Components are managed via `components.json`. To add new components:

```bash
npx shadcn@latest add <component-name>
```

This follows the "New York" style variant with CSS variables enabled.
