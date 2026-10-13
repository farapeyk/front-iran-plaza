const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createRequire } = require('node:module');

test('Next lint root-directory globs retain brace patterns and directory-only matching without braces', () => {
  const configRequire = createRequire(require.resolve('eslint-config-next'));
  const pluginEntry = configRequire.resolve('@next/eslint-plugin-next');
  const { getRootDirs } = require(path.join(path.dirname(pluginEntry), 'utils/get-root-dirs.js'));
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'plaza-lint-glob-'));
  try {
    for (const name of ['web', 'admin', 'other']) fs.mkdirSync(path.join(directory, name));
    fs.writeFileSync(path.join(directory, 'file'), 'fixture');
    const pattern = directory.replaceAll('\\', '/') + '/{web,admin}';
    const result = getRootDirs({ cwd: directory, settings: { next: { rootDir: pattern } } });
    assert.deepEqual(result.map(name => path.resolve(name)).sort(), ['admin','web'].map(name => path.join(directory, name)));
    assert.equal(getRootDirs({ cwd: directory, settings: { next: { rootDir: directory.replaceAll('\\', '/') + '/file' } } }).length, 0);
    assert.deepEqual(getRootDirs({ cwd: directory, settings: {} }), [directory]);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
});
