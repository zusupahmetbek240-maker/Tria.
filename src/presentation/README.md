# Presentation Layer

Presentation renders application state and forwards user events to hooks or use
cases. It contains Expo Router-adjacent screens, feature components, shared UI
primitives, providers, and theme decisions.

It never imports a Supabase client, calls fetch, reads device APIs, or contains
domain calculations. Route files in `app/` stay thin and only compose this
layer with the composition root.
