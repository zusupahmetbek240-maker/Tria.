const { execFileSync } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

const root = process.cwd();
const examplePath = join(root, '.env.example');
const exampleFiles = [
  '.env.example',
  '.env.development.example',
  '.env.staging.example',
  '.env.production.example',
];
const environmentByFile = new Map([
  ['.env.development.example', 'development'],
  ['.env.staging.example', 'staging'],
  ['.env.production.example', 'production'],
  ['.env.development', 'development'],
  ['.env.staging', 'staging'],
  ['.env.production', 'production'],
]);
const localEnvFiles = [
  '.env',
  '.env.development',
  '.env.staging',
  '.env.production',
].filter((file) => existsSync(join(root, file)));

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const parseKeys = (content) =>
  content
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#'))
    .map((line) => line.split('=')[0])
    .filter((key) => key !== undefined);

const forbiddenSecretPattern =
  /(^|\n)\s*(SUPABASE_SERVICE_ROLE|GEMINI_API_KEY|GOOGLE_API_KEY|OPENAI_API_KEY|ANTHROPIC_API_KEY|SENTRY_AUTH_TOKEN|WEATHER_API_KEY|.*SECRET.*|.*PRIVATE.*)\s*=/u;

function assertNoServerSecrets(file, content) {
  if (forbiddenSecretPattern.test(content)) {
    fail(`Server-only secrets must not be stored in ${file}.`);
  }
}

function assertHasRequiredKeys(file, content, requiredKeys) {
  const keys = new Set(parseKeys(content));
  const missingKeys = requiredKeys.filter((key) => !keys.has(key));

  if (missingKeys.length > 0) {
    fail(`${file} is missing required public keys: ${missingKeys.join(', ')}`);
  }
}

function readKeyValue(content, key) {
  const line = content
    .split(/\r?\n/u)
    .map((value) => value.trim())
    .find((value) => value.startsWith(`${key}=`));

  return line?.slice(key.length + 1);
}

function assertBooleanValue(file, content, key) {
  const value = readKeyValue(content, key);

  if (value !== 'true' && value !== 'false') {
    fail(`${file} must set ${key} to true or false.`);
  }
}

function assertSampleRateValue(file, content, key) {
  const value = readKeyValue(content, key);

  if (value === undefined) {
    fail(`${file} is missing ${key}.`);
  }

  const sampleRate = Number.parseFloat(value);

  if (!Number.isFinite(sampleRate) || sampleRate < 0 || sampleRate > 1) {
    fail(`${file} must set ${key} to a number from 0 to 1.`);
  }
}

function assertSentryConfiguration(file, content) {
  const appEnvironment = readKeyValue(content, 'EXPO_PUBLIC_APP_ENV');
  const monitoringEnabled = readKeyValue(
    content,
    'EXPO_PUBLIC_ENABLE_ERROR_MONITORING',
  );
  const sentryDsn = readKeyValue(content, 'EXPO_PUBLIC_SENTRY_DSN');

  if (
    appEnvironment !== 'development' &&
    monitoringEnabled === 'true' &&
    (sentryDsn === undefined || sentryDsn.trim() === '')
  ) {
    fail(`${file} enables error monitoring but does not set EXPO_PUBLIC_SENTRY_DSN.`);
  }
}

function assertEnvironmentMatchesFile(file, content) {
  const expectedEnvironment = environmentByFile.get(file);

  if (expectedEnvironment === undefined) {
    return;
  }

  const actualEnvironment = readKeyValue(content, 'EXPO_PUBLIC_APP_ENV');

  if (actualEnvironment !== expectedEnvironment) {
    fail(
      `${file} must set EXPO_PUBLIC_APP_ENV=${expectedEnvironment}, got ${actualEnvironment ?? 'missing'}.`,
    );
  }
}

if (!existsSync(examplePath)) {
  fail('.env.example is required.');
}

for (const exampleFile of exampleFiles) {
  if (!existsSync(join(root, exampleFile))) {
    fail(`${exampleFile} is required.`);
  }
}

if (localEnvFiles.length === 0) {
  fail('.env is missing. Run pnpm run setup:local.');
}

const exampleKeys = parseKeys(readFileSync(examplePath, 'utf8'));

for (const exampleFile of exampleFiles) {
  const exampleContent = readFileSync(join(root, exampleFile), 'utf8');

  assertHasRequiredKeys(exampleFile, exampleContent, exampleKeys);
  assertBooleanValue(
    exampleFile,
    exampleContent,
    'EXPO_PUBLIC_ENABLE_ERROR_MONITORING',
  );
  assertSampleRateValue(
    exampleFile,
    exampleContent,
    'EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE',
  );
  assertSentryConfiguration(exampleFile, exampleContent);
  assertEnvironmentMatchesFile(exampleFile, exampleContent);
  assertNoServerSecrets(exampleFile, exampleContent);
}

for (const envFile of localEnvFiles) {
  const envContent = readFileSync(join(root, envFile), 'utf8');

  assertHasRequiredKeys(envFile, envContent, exampleKeys);
  assertBooleanValue(envFile, envContent, 'EXPO_PUBLIC_ENABLE_ERROR_MONITORING');
  assertSampleRateValue(envFile, envContent, 'EXPO_PUBLIC_SENTRY_TRACES_SAMPLE_RATE');
  assertSentryConfiguration(envFile, envContent);
  assertEnvironmentMatchesFile(envFile, envContent);
  assertNoServerSecrets(envFile, envContent);
}

const trackedFiles = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
  .split(/\r?\n/u)
  .filter((file) => file.length > 0);
const trackedEnvFiles = trackedFiles.filter(
  (file) =>
    !exampleFiles.includes(file) &&
    (file === '.env' ||
      file === '.env.development' ||
      file === '.env.staging' ||
      file === '.env.production' ||
      file.startsWith('.env.')),
);

if (trackedEnvFiles.length > 0) {
  fail(
    `Real environment files must not be tracked by Git: ${trackedEnvFiles.join(', ')}`,
  );
}
