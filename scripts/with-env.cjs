const { spawnSync } = require('node:child_process');
const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

const [, , mode, command, ...args] = process.argv;
const allowedModes = new Set(['development', 'staging', 'production']);
const root = process.cwd();

if (mode === undefined || command === undefined || !allowedModes.has(mode)) {
  console.error(
    'Usage: node scripts/with-env.cjs <development|staging|production> <command> [...args]',
  );
  process.exit(1);
}

function readEnvFile(path) {
  if (!existsSync(path)) {
    return {};
  }

  return Object.fromEntries(
    readFileSync(path, 'utf8')
      .split(/\r?\n/u)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith('#'))
      .map((line) => {
        const separatorIndex = line.indexOf('=');

        if (separatorIndex === -1) {
          return [line, ''];
        }

        return [line.slice(0, separatorIndex), line.slice(separatorIndex + 1)];
      }),
  );
}

const baseEnv = readEnvFile(join(root, '.env'));
const modeEnv = readEnvFile(join(root, `.env.${mode}`));

const result = spawnSync(command, args, {
  env: {
    ...process.env,
    ...baseEnv,
    ...modeEnv,
    EXPO_PUBLIC_APP_ENV: mode,
    NODE_ENV: mode === 'production' ? 'production' : 'development',
  },
  shell: true,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
