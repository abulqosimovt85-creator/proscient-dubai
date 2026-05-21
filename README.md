# ProScient Website

A production-ready React + TypeScript + Tailwind project for **PROSCIENTIFIC SOLUTIONS - FZCO**, built as a premium UAE B2B scientific solutions website.

## What’s included

- React with Vite and Tailwind CSS
- Enterprise homepage layout with hero, solutions, industry, services, brands, and CTA sections
- Products catalog page with search and category filtering
- Product detail page with specifications, applications, and quote CTA
- Solutions, services, industries, brands, case studies, insights, and contact pages
- Sticky navigation, locale/region toggles, and responsive mobile-first design
- Reusable component structure and API-ready data/service layer
- Backend-ready data models in `src/types.ts`

## Project structure

- `src/App.tsx` — route definitions and layout container
- `src/components` — shared UI components and layout elements
- `src/pages` — page-specific views and content sections
- `src/data/content.ts` — CMS-ready content data arrays
- `src/services/siteApi.ts` — mock API-like data access layer
- `src/types.ts` — typed models for products, brands, inquiries, blogs, and case studies

## Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Notes

- Tailwind is configured in `tailwind.config.js`
- Routing uses `react-router-dom`
- The current frontend is structured for NestJS-compatible API integration and Supabase/PostgreSQL-ready models
