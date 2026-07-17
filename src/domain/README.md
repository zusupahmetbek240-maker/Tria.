# Domain Layer

The domain contains the language and rules of Tria: athlete goals, planned and
completed workouts, readiness, equipment wear, and AI change drafts. Modules in
this directory are pure TypeScript and have no dependency on Expo, React,
Supabase, storage, or network services.

Add a domain module only when a confirmed MVP rule needs it. Each module owns
its entity types, validation, calculations, and focused tests.
