# Application Layer

The application layer coordinates user intentions through use cases and ports.
Ports are interfaces owned here; infrastructure adapters implement them. A use
case can depend on the domain and application ports, but never on Expo,
Supabase, a device API, or a presentation component.

Use React hooks here only to coordinate UI state around a use case. Keep the
business decision itself in a testable function or use case module.
