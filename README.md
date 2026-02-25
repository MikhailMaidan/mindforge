# MindForge Frontend

Vue 3 + TypeScript app organized with a Feature-Sliced Design (FSD) structure, with a migration path prepared for Nuxt.

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
- `app/styles/global.css` can become Nuxt global CSS via `nuxt.config`.
- Alias style already mirrors a layered monorepo-friendly setup and avoids deep relative imports.
