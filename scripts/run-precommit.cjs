const { spawnSync } = require('node:child_process');

console.log('Running Tria. pre-commit checks...');

const result = spawnSync('pnpm', ['run', 'precommit'], {
  shell: true,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
