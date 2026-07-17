# Infrastructure Layer

Infrastructure adapts external systems to application ports: Supabase,
weather, Gemini, secure storage, notifications, and device capabilities. It
maps untrusted external data into validated domain values and returns Result
objects for expected failures.

No infrastructure module may import presentation code. API keys that grant
privileged access never belong in the mobile app.
