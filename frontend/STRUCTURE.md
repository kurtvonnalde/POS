# Frontend Project Structure

This document describes the organized React project structure following best practices for scalability and maintainability.

## Directory Structure

```
frontend/src/
├── assets/
│   ├── images/          # Images and PNG files
│   └── icons/           # SVG and icon files
├── components/
│   ├── layout/          # Layout components (Header, Footer, AppLayout)
│   │   ├── Header/      # Sidebar and header component
│   │   ├── Footer/      # Footer component
│   │   └── AppLayout/   # Main app layout wrapper
│   └── common/          # Reusable common components
│       ├── ProtectedRoute.tsx
│       └── users/
│           └── Registration/
├── pages/               # Page components (full-page views)
│   ├── Auth/
│   │   └── Login/
│   ├── Products/
│   ├── Inventory/
│   ├── Sales/
│   ├── Reports/
│   └── Settings/
├── services/            # API service functions (TO BE ADDED)
├── hooks/               # Custom React hooks (TO BE ADDED)
├── context/             # React context for state management (TO BE ADDED)
├── utils/               # Utility functions and helpers (TO BE ADDED)
├── types/               # TypeScript type definitions (TO BE ADDED)
├── App.tsx              # Main App component
├── App.scss             # Global app styles
├── main.tsx             # React entry point
└── index.css            # Global styles
```

## Naming Conventions

- **Files**: Use PascalCase for component files (e.g., `Header.tsx`, `Products.tsx`)
- **Folders**: Use PascalCase for component folders (e.g., `/Header`, `/Products`)
- **Utilities**: Use camelCase for utility files (e.g., `helpers.ts`, `validators.ts`)
- **Styles**: Match the component name with `.scss` extension (e.g., `Header.scss`)

## Component Organization

### Layout Components (`components/layout/`)
- Header: Sidebar navigation and user profile
- Footer: Footer component
- AppLayout: Wrapper for authenticated routes
- AuthLayout: Wrapper for authentication pages

### Common Components (`components/common/`)
- Reusable components used across the app
- ProtectedRoute: Route guard for authenticated pages
- Registration: User registration modal

### Pages (`pages/`)
- Full-page components representing routes
- Organized by feature (Auth, Products, Inventory, etc.)
- Each page folder contains the page component and its styles

## Import Patterns

```typescript
// Layout components
import { Header, Footer, AppLayout } from '@/components/layout';

// Common components
import { ProtectedRoute, Registration } from '@/components/common';

// Pages
import { Products, Login } from '@/pages';
```

## Future Additions

- **services/**: API call functions (e.g., `authService.ts`, `productService.ts`)
- **hooks/**: Custom hooks (e.g., `useAuth.ts`, `useFetch.ts`)
- **context/**: Global state management (e.g., `AuthContext.ts`)
- **utils/**: Helper functions (e.g., `formatters.ts`, `validators.ts`)
- **types/**: TypeScript interfaces (e.g., `User.ts`, `Product.ts`)

## Best Practices

1. Keep components focused and single-responsibility
2. Use barrel exports (`index.ts`) for cleaner imports
3. Co-locate styles with components (`.scss` files in component folders)
4. Use TypeScript for type safety
5. Implement lazy loading for pages
6. Use React Router for navigation
7. Keep component logic in custom hooks
8. Use context for global state, not component state
