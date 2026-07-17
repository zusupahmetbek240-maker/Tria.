const appEnvironmentValues = ['development', 'staging', 'production'] as const;

export type AppEnvironment = (typeof appEnvironmentValues)[number];

function isAppEnvironment(value: string): value is AppEnvironment {
  return appEnvironmentValues.some((environment) => environment === value);
}

function readOptionalPublicEnv(name: string): string | undefined {
  const value = process.env[name];
  return value === undefined || value.trim() === '' ? undefined : value;
}

function readBooleanPublicEnv(name: string): boolean {
  const value = readOptionalPublicEnv(name);

  if (value === undefined) {
    return false;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(`Invalid boolean environment variable ${name}: ${value}`);
}

function readNumberPublicEnv(name: string): number | undefined {
  const value = readOptionalPublicEnv(name);

  if (value === undefined) {
    return undefined;
  }

  const parsedValue = Number.parseFloat(value);

  if (!Number.isFinite(parsedValue)) {
    throw new Error(`Invalid number environment variable ${name}: ${value}`);
  }

  return parsedValue;
}

function readSampleRatePublicEnv(name: string): number {
  const value = readNumberPublicEnv(name) ?? 0;

  if (value < 0 || value > 1) {
    throw new Error(`Invalid sample rate environment variable ${name}: ${value}`);
  }

  return value;
}

function readAppEnvironment(): AppEnvironment {
  const value = readOptionalPublicEnv('EXPO_PUBLIC_APP_ENV') ?? 'development';

  if (isAppEnvironment(value)) {
    return value;
  }

  throw new Error(`Invalid EXPO_PUBLIC_APP_ENV: ${value}`);
}

export const environment = {
  aiGatewayUrl: readOptionalPublicEnv('EXPO_PUBLIC_AI_GATEWAY_URL'),
  appEnv: readAppEnvironment(),
  errorMonitoringEnabled: readBooleanPublicEnv('EXPO_PUBLIC_ENABLE_ERROR_MONITORING'),
  sentryDsn: readOptionalPublicEnv('EXPO_PUBLIC_SENTRY_DSN'),
  sentryTracesSampleRate: readSampleRatePublicEnv(
    'EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE',
  ),
  supabaseAnonKey: readOptionalPublicEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseUrl: readOptionalPublicEnv('EXPO_PUBLIC_SUPABASE_URL'),
  weatherApiBaseUrl: readOptionalPublicEnv('EXPO_PUBLIC_WEATHER_API_BASE_URL'),
} as const;

export const isProduction = environment.appEnv === 'production';
export const isDevelopment = environment.appEnv === 'development';
