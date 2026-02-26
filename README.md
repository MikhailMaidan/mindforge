# MindForge Frontend

Vue 3 + TypeScript app organized with a Feature-Sliced Design (FSD) structure, with a migration path prepared for Nuxt.

## Tailwind CSS Setup

Tailwind CSS v4 is connected through PostCSS and loaded from `src/app/styles/global.scss`.

### Install

```bash
npm install
npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer sass
```

### Config files

`postcss.config.js`:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

`src/app/styles/global.scss`:

```scss
@use 'sass:meta';
@include meta.load-css('tailwindcss');
```

Tailwind entry SCSS is already imported in `src/main.ts` via `@/app/styles/global.scss`.

### Run

```bash
npm run dev
```

## Layer Structure

```
src/
  app/        # global styles, providers, app init
  pages/      # route-level pages (composition only)
  widgets/    # large UI blocks composed from features/entities
  features/   # user actions and scenarios
  entities/   # business domain units (session, user, etc.)
  shared/     # reusable UI kit, lib, types, config
```

## Aliases

Configured in `vite.config.ts` and `tsconfig.app.json`:

- `@/*` -> `src/*`
- `~app/*`, `~pages/*`, `~widgets/*`, `~features/*`, `~entities/*`, `~shared/*`

## Nuxt Migration Notes

- Keep business logic and UI in `features/entities/shared`; these folders can move almost unchanged.
- Current `pages/*` can map to Nuxt `pages/*` with minimal rewrite.
- `app/styles/global.scss` can become Nuxt global CSS via `nuxt.config`.
- Alias style already mirrors a layered monorepo-friendly setup and avoids deep relative imports.
