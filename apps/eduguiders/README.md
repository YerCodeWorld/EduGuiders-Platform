# EduGuiders Web Application

This is the main web application for EduGuiders platform, allowing students to connect with teachers and access educational resources.

## Features

- User authentication and authorization with different roles (Admin, Teacher, Student)
- Teacher profiles and discovery
- Course browsing and enrollment
- Educational games and competitions
- Educational articles and resources

## Development

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+

### Getting Started

From the root of the monorepo:

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev --filter=eduguiders
```

To build:

```bash
pnpm build --filter=eduguiders
```

To lint:

```bash
pnpm lint --filter=eduguiders
```

### Folder Structure

```
src/
├── assets/         # Static assets (images, icons, etc.)
├── components/     # Reusable UI components
├── contexts/       # React contexts (auth, etc.)
├── pages/          # Page components
├── services/       # API services
├── styles/         # Global and scoped styles
└── utils/          # Utility functions
```

## Using Shared Components

This app is part of a monorepo and can use shared components from the `@repo/ui` package:

```tsx
// Import shared UI components
import { Button } from '@repo/ui/button';
import { Card } from '@repo/ui/card';

function MyComponent() {
  return (
    <div>
      <Card title="My Card" href="#">
        Card content
      </Card>
      <Button appName="EduGuiders">Click me</Button>
    </div>
  );
}
```

## Configuration

The app is configured to use Vite for bundling and TypeScript for type checking.
It extends configuration from the monorepo's shared configuration packages:

- `@repo/typescript-config` - TypeScript configuration
- `@repo/eslint-config` - ESLint configuration