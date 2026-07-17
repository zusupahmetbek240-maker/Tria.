const { copyFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');

const root = process.cwd();
const source = join(root, '.env.example');
const target = join(root, '.env');

if (!existsSync(source)) {
  console.error('.env.example is missing.');
  process.exit(1);
}

if (!existsSync(target)) {
  copyFileSync(source, target);
  console.log('Created .env from .env.example.');
} else {
  console.log('.env already exists.');
}
