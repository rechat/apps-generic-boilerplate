# Rechat Generic App Boilerplate

A starter template for building custom apps that run inside [Rechat](https://rechat.com)'s Generic AppPlatform surface on the Today page.

## How It Works

Rechat allows third-party developers to build custom UIs that are embedded directly into the product. Your app is hosted on your own server and loaded into Rechat through the AppPlatform runtime.

The key concept: **your app does not bundle its own React or UI libraries.** Instead, Rechat injects them at runtime. This means your bundle stays small, and your UI is visually consistent with the rest of Rechat.

At runtime, Rechat loads your app's JavaScript bundle and calls its default export, passing in:

- **React**, **Material-UI**, and **react-use** libraries (available via `window.libs`)
- **Data models** like the logged-in `user`, active `brand`, and optional `impersonateUser`
- **API functions** like `close()`
- **UI Components** provided by Rechat (logo, email composer, date picker, wizard forms, etc.)
- **Utility functions** like `notify()` for showing toast notifications

Your app receives all of this through a single `EntryProps` object and renders its UI using the injected libraries.

## Project Structure

```
app/                       # Frontend source code
  index.tsx                # Entry point - receives injected props from Rechat
  App.tsx                  # Main application component
  core/libs/               # Wrappers that access injected libraries from window.libs
    react.ts               #   React
    material-ui.ts         #   Material-UI
    react-use.ts           #   react-use
  core/utils/              # Utilities (component factory, etc.)
  components/              # Your custom components
  static/                  # Icons and logos

server/                    # Express.js backend
  main.ts                  # Server entry point
  routes.ts                # Route definitions
  app/controllers/         # Route controllers

types/                     # TypeScript type definitions
  core.d.ts                # EntryProps interface and component types
  models/                  # Data model types (User, Brand, CRM helpers, etc.)
  components/              # Prop types for injected components

.configuration/            # Build tooling
  webpack/                 # Webpack configs (base, dev, production)
  build/                   # Production build script
  update-manifest/         # Manifest timestamp updater

manifest.json              # App metadata - required by Rechat
```

## The Manifest

Every Rechat app must expose a `manifest.json` at its root URL. This tells Rechat about your app:

```json
{
  "name": "Generic Boilerplate App",
  "icon": "./static/icon.png",
  "version": "1.0.0",
  "build": "1653421766",
  "inputs": [],
  "size": "md"
}
```

| Field     | Description                                          |
| --------- | ---------------------------------------------------- |
| `name`    | Display name shown in Rechat                         |
| `icon`    | Path to the app icon                                 |
| `version` | Semantic version of your app                         |
| `build`   | Unique build identifier (auto-updated on each build) |
| `inputs`  | Input configurations required by the app             |
| `size`    | UI size: `sm`, `md`, or `lg`                         |

The `inputs` array stays empty because this Generic app uses the shared AppPlatform runtime context.

The `build` value is used to reference your bundle file (`bundle.<build>.js`), so Rechat always loads the correct version.

## The Bundle

Your app's compiled output is a single ES module (`bundle.<build>.js`). Rechat imports it and calls the default export, passing in all the injected dependencies:

```typescript
// This is what Rechat does internally (simplified):
const app = await import(`https://your-app.com/bundle.1653421766.js`)
app.default({
  models: { user, brand, impersonateUser },
  api: { close },
  utils: { notify },
  hooks: {},
  Components: { Logo, DatePicker, SingleEmailComposeForm, Wizard }
})
```

Your entry point (`app/index.tsx`) receives these props and renders your app:

```typescript
export default function Bootstrap({ Components, ...props }: EntryProps) {
  return <App Components={createComponents(Components)} {...props} />
}
```

## Using Injected Libraries

Since React, Material-UI, and react-use are provided by the host platform, you **do not import them from `node_modules`**. Instead, use the wrapper modules:

```typescript
import React from '@libs/react'
import Ui from '@libs/material-ui'
import ReactUse from '@libs/react-use'
```

These read from `window.libs`, which Rechat populates before loading your bundle.

> The libraries are listed in `package.json` for TypeScript type-checking only. They are not included in your bundle.

## Injected Props Reference

Your app's default export receives an `EntryProps` object:

```typescript
interface EntryProps {
  models: {
    user: IUser                                 // The logged-in Rechat user
    brand: IBrand                               // The active Rechat brand
    impersonateUser: Nullable<IImpersonateUser> // User being impersonated, if any
  }
  api: {
    close: () => void // Close the app dialog
  }
  utils: {
    notify: (data: NotificationData) => void // Show toast notifications
  }
  hooks: {
    wizard?: {
      useSectionContext: () => IWizardSectionState
      useWizardContext: () => IWizardState
      useSectionErrorContext: () => Optional<string>
    }
  }
  Components: {
    Logo: React.FC
    DatePicker: React.FC
    SingleEmailComposeForm: React.FC
    Wizard: {
      QuestionWizard: React.FC
      QuestionSection: React.FC
      QuestionTitle: React.FC
      QuestionForm: React.FC
    }
  }
}
```

Full type definitions for all models and components are in the `types/` directory.

## Where Your App Appears

Once your app is registered with Rechat as a Generic AppPlatform application, it shows up in the **Hub Apps** row on the Today page. Users see your app's icon and name, and clicking it opens your UI in an embedded dialog.

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Access to a Rechat account

### Install Dependencies

```bash
npm install
```

If npm reports peer dependency conflicts from the legacy React hot loader packages, install with:

```bash
npm install --legacy-peer-deps
```

### Development

```bash
npm run develop
```

This starts an Express server with Webpack dev middleware and hot reloading on port **8081**.

### Testing in Rechat

Since your app runs inside Rechat, you need the actual product runtime to provide the injected libraries and data. Rechat has a built-in dev mode for this:

1. Run your local dev server:

   ```bash
   npm run develop
   ```

2. Open Rechat in your browser and navigate to the Today page.

3. Append `?dev=true&host=localhost:8081` to the URL and reload. For example:

   ```text
   https://app.rechat.com/dashboard?dev=true&host=localhost:8081
   ```

4. Open a Generic app from the Hub Apps row. Rechat will load it from your local dev server instead of the production URL.

This lets you develop with hot reloading while getting real user data, real brand data, and the full Rechat runtime environment.

### Production Build

```bash
npm run build
```

This will:

1. Update the `build` timestamp in `manifest.json`
2. Compile the frontend bundle (`dist-web/bundle.<build>.js`)
3. Compile the server (`dist-server/`)

### Start Production Server

```bash
npm start
```

### Docker

```bash
docker build -t my-rechat-generic-app .
docker run -p 8081:8081 my-rechat-generic-app
```

## Deployment

Your app must be hosted at a publicly accessible URL. Rechat needs to reach two endpoints:

1. **`GET /manifest.json`** - Returns your app's manifest
2. **`GET /bundle.<build>.js`** - Returns your compiled bundle (served as a static file)

Once deployed, register your app's URL with Rechat as a Generic AppPlatform application so the platform knows where to load it from.

## Contact

For questions about app development and integration: emil@rechat.com | ramin@rechat.com
