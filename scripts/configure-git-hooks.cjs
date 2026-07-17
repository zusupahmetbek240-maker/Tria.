const { existsSync, chmodSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const { join } = require('node:path');

const root = process.cwd();
const gitDirectory = join(root, '.git');
const hooksDirectory = join(root, '.githooks');
const preCommitHook = join(hooksDirectory, 'pre-commit');

if (!existsSync(gitDirectory) || !existsSync(preCommitHook)) {
  process.exit(0);
}

try {
  chmodSync(preCommitHook, 0o755);
} catch {
  // Windows can ignore POSIX executable bits; Git for Windows can still run the hook.
}

const result = spawnSync('git', ['config', 'core.hooksPath', '.githooks'], {
  cwd: root,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
