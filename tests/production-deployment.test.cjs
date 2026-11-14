const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const workflow = fs.readFileSync(path.join(root, '.github/workflows/production.yml'), 'utf8');
const offlineDockerfile = fs.readFileSync(path.join(root, 'deploy/ci/Dockerfile.offline'), 'utf8');

test('production workflow creates the standalone bundle inside Alpine on the runner', () => {
  assert.match(workflow, /Prepare offline Alpine standalone bundle/);
  assert.match(workflow, /node:24\.18\.0-alpine/);
  assert.match(workflow, /pnpm install --frozen-lockfile/);
  assert.match(workflow, /cp -a \.next\/standalone\/\. \/runtime\//);
  assert.match(workflow, /frontend-runtime\.tar\.gz/);
  assert.match(workflow, /NEXT_PUBLIC_GA4_MEASUREMENT_ID: G-KBY6RHW6MQ/);
  assert.match(workflow, /NEXT_PUBLIC_CLARITY_PROJECT_ID: ytzg76hino/);
});

test('deployment package is derived from the reviewed SHA and size limited', () => {
  assert.match(workflow, /git archive --format=tar "\$GITHUB_SHA"/);
  assert.match(workflow, /deploy\/ci\/Dockerfile\.offline "\$package_root\/Dockerfile"/);
  assert.match(workflow, /test "\$archive_bytes" -le \$\(\(512 \* 1024 \* 1024\)\)/);
});

test('production hosts assemble the image without Corepack or pnpm', () => {
  assert.match(offlineDockerfile, /ADD --chown=node:node \.deploy-frontend-runtime\.tar\.gz/);
  assert.doesNotMatch(offlineDockerfile, /\b(?:corepack|pnpm|npm)\b/);
  assert.match(offlineDockerfile, /USER node/);
  assert.match(offlineDockerfile, /CMD \["node", "server\.js"\]/);
});

test('Iran deployment only refreshes its known host key after the RSA fingerprint matches the pinned value', () => {
  assert.match(workflow, /Install pinned Iranian deploy host key/);
  assert.match(workflow, /ssh-keyscan -T 10 -t rsa -p/);
  assert.match(workflow, /ssh-keygen -lf .* -E sha256/);
  assert.match(workflow, /SHA256:WPJOZzUTGx\+XKhYFii4YzFn4LY\/9PydYGGPSVOGn\+Fs/);
  assert.match(workflow, /ssh-keygen -R .*known_hosts/);
  assert.match(workflow, /StrictHostKeyChecking=yes/);
});
