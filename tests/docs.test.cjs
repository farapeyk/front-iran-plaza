const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]);

test('project documents have valid local links, UTF-8 and closed fences', () => {
  for (const file of walk(path.join(root, 'docs')).filter(file => file.endsWith('.md') && path.basename(file) !== 'QA-SPECIALIST-CHECKLIST.md')) {
    const text = fs.readFileSync(file, 'utf8');
    assert.equal(text.includes('\ufffd'), false, file);
    assert.equal(/\?{3,}/.test(text), false, file + ': possible lossy text encoding');
    assert.equal(text.split(/\r?\n/).filter(line => line.startsWith('```')).length % 2, 0, file);
    for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      if (match[1].includes('://') || match[1].startsWith('#')) continue;
      assert.ok(fs.existsSync(path.resolve(path.dirname(file), match[1].split('#')[0])), file + ': ' + match[1]);
    }
  }
});

test('source map inventories all source and test files', () => {
  const text = fs.readFileSync(path.join(root, 'docs/SOURCE-MAP.md'), 'utf8');
  const listed = text.match(/```text\r?\n([\s\S]*?)```/)[1].trim().split(/\r?\n/).sort();
  const actual = [...walk(path.join(root, 'src')), ...walk(path.join(root, 'tests'))].map(file => path.relative(root, file).replaceAll('\\', '/')).sort();
  assert.deepEqual(listed, actual);
});
