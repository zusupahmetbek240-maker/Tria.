const { existsSync, readFileSync } = require('node:fs');
const { join } = require('node:path');

const root = process.cwd();
const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const packageJson = readJson(join(root, 'package.json'));
const nodeMajor = Number.parseInt(process.versions.node.split('.')[0] ?? '', 10);

if (!Number.isInteger(nodeMajor) || nodeMajor < 22) {
  fail(`Node.js 22 or newer is required. Current version: ${process.versions.node}`);
}

if (packageJson.packageManager !== 'pnpm@11.9.0') {
  fail('packageManager must stay pinned to pnpm@11.9.0.');
}

const forbiddenLockfiles = ['package-lock.json', 'yarn.lock', 'bun.lock', 'bun.lockb'];
const foundForbiddenLockfile = forbiddenLockfiles.find((file) =>
  existsSync(join(root, file)),
);

if (foundForbiddenLockfile !== undefined) {
  fail(
    `Remove ${foundForbiddenLockfile}. pnpm-lock.yaml is the only allowed lockfile.`,
  );
}

if (!existsSync(join(root, 'pnpm-lock.yaml'))) {
  fail('pnpm-lock.yaml is required. Run pnpm install.');
}

const requiredPaths = [
  'app/_layout.tsx',
  'app/(onboarding)/index.tsx',
  'app/(tabs)/_layout.tsx',
  'src/domain',
  'src/application',
  'src/infrastructure',
  'src/presentation',
  'src/composition',
];

for (const requiredPath of requiredPaths) {
  if (!existsSync(join(root, requiredPath))) {
    fail(`Required project foundation path is missing: ${requiredPath}`);
  }
}
