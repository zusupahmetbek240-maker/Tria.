import type { ExpoConfig } from 'expo/config';

const appEnvironments = ['development', 'staging', 'production'] as const;

type AppEnvironment = (typeof appEnvironments)[number];

type EnvironmentConfig = Readonly<{
  androidPackage: string;
  appEnv: AppEnvironment;
  bundleIdentifier: string;
  name: string;
  scheme: string;
  slug: string;
}>;

function readOptionalBuildEnv(name: string): string | undefined {
  const value = process.env[name];
  return value === undefined || value.trim() === '' ? undefined : value;
}

function readAppEnvironment(): AppEnvironment {
  const value = process.env['EXPO_PUBLIC_APP_ENV'] ?? 'development';

  if (appEnvironments.some((environment) => environment === value)) {
    return value as AppEnvironment;
  }

  throw new Error(`Invalid EXPO_PUBLIC_APP_ENV: ${value}`);
}

const environmentConfigs: Record<AppEnvironment, EnvironmentConfig> = {
  development: {
    androidPackage: 'com.tria.app.dev',
    appEnv: 'development',
    bundleIdentifier: 'com.tria.app.dev',
    name: 'Tria. Dev',
    scheme: 'tria-dev',
    slug: 'tria-dev',
  },
  staging: {
    androidPackage: 'com.tria.app.staging',
    appEnv: 'staging',
    bundleIdentifier: 'com.tria.app.staging',
    name: 'Tria. Staging',
    scheme: 'tria-staging',
    slug: 'tria-staging',
  },
  production: {
    androidPackage: 'com.tria.app',
    appEnv: 'production',
    bundleIdentifier: 'com.tria.app',
    name: 'Tria.',
    scheme: 'tria',
    slug: 'tria',
  },
};

const environmentConfig = environmentConfigs[readAppEnvironment()];
const sentryOrganization = readOptionalBuildEnv('SENTRY_ORG');
const sentryProject = readOptionalBuildEnv('SENTRY_PROJECT');
const sentryUrl = readOptionalBuildEnv('SENTRY_URL');
const sentryPluginOptions = {
  ...(sentryOrganization === undefined ? {} : { organization: sentryOrganization }),
  ...(sentryProject === undefined ? {} : { project: sentryProject }),
  ...(sentryUrl === undefined ? {} : { url: sentryUrl }),
};

const config: ExpoConfig = {
  name: environmentConfig.name,
  slug: environmentConfig.slug,
  version: '0.1.0',
  orientation: 'portrait',
  scheme: environmentConfig.scheme,
  userInterfaceStyle: 'light',
  experiments: {
    typedRoutes: true,
  },
  plugins: [
    'expo-router',
    'expo-status-bar',
    ['@sentry/react-native', sentryPluginOptions],
  ],
  ios: {
    bundleIdentifier: environmentConfig.bundleIdentifier,
    supportsTablet: false,
  },
  android: {
    package: environmentConfig.androidPackage,
  },
  web: {
    bundler: 'metro',
    output: 'static',
  },
  extra: {
    appEnv: environmentConfig.appEnv,
  },
};

export default config;
