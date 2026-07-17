# Tria

Adaptive training planning for endurance athletes. The MVP helps an athlete turn
their plan, daily readiness, weather, completed workouts, and equipment wear
into one clear next action.

## Current State

The project is intentionally at the Day 0 foundation stage. Architecture,
quality checks, a design-token baseline, and the Expo shell are ready. Product
features have not been started.

## Start Here

```powershell
npm.cmd install
Copy-Item .env.example .env
npm.cmd run start
```

## Quality Checks

```powershell
npm.cmd run format
npm.cmd run verify
npm.cmd run doctor
```

## Architecture

- [Architecture](docs/ARCHITECTURE.md)
- [Style guide](docs/ARCHITECTURAL-STYLE-GUIDE.md)
- [Recorded decisions](docs/DECISIONS.md)
- [Development workflow](docs/DEVELOPMENT.md)

Read `AGENTS.md` before implementing a feature. New functionality follows this
order: domain rule, application use case, infrastructure adapter, composition,
presentation, and tests.
