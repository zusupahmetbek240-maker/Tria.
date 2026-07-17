export type Result<T, E extends Error = Error> =
  Readonly<{ ok: true; value: T }> | Readonly<{ ok: false; error: E }>;

export const success = <T>(value: T): Result<T> => ({ ok: true, value });

export const failure = <E extends Error>(error: E): Result<never, E> => ({
  ok: false,
  error,
});
