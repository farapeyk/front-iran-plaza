const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./helpers.cjs');

const crop = load('src/design/lib/image-crop.ts');

function closeTo(actual, expected, tolerance = 0.001) {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not close to ${expected}`);
}

test('image crop geometry centers a landscape source inside a square frame', () => {
  const source = { width: 1600, height: 900 };
  const frame = { width: 400, height: 400 };
  const rect = crop.sourceCropRect(source, frame, { x: 0, y: 0 }, 1);

  closeTo(rect.x, 350);
  closeTo(rect.y, 0);
  closeTo(rect.width, 900);
  closeTo(rect.height, 900);
});

test('image crop geometry clamps dragging and zoom without exposing empty pixels', () => {
  const source = { width: 1600, height: 900 };
  const frame = { width: 400, height: 400 };
  const bounds = crop.cropPanBounds(source, frame, 1);
  const clamped = crop.clampCropPan({ x: 9999, y: -9999 }, source, frame, 1);
  const zoomed = crop.sourceCropRect(source, frame, { x: 0, y: 0 }, 2);

  closeTo(clamped.x, bounds.x);
  closeTo(clamped.y, -bounds.y);
  closeTo(zoomed.width, 450);
  closeTo(zoomed.height, 450);
});

test('owner image uploads open the shared editor while identity documents stay untouched', () => {
  const editor = fs.readFileSync(path.join(__dirname, '../src/design/components/image-editor.tsx'), 'utf8');
  const ownerFlows = [
    'src/features/business/components/profile/basic-info-form.tsx',
    'src/features/business/components/profile/products-manager.tsx',
    'src/features/business/components/profile/gallery-manager.tsx',
    'src/design/pages/product-live.tsx',
  ].map(file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8'));
  const documents = fs.readFileSync(path.join(__dirname, '../src/features/business/components/steps/documents-step.tsx'), 'utf8');

  assert.match(editor, /انتخاب قاب تصویر/);
  assert.match(editor, /بزرگ‌نمایی تصویر/);
  assert.match(editor, /sourceCropRect/);
  assert.match(editor, /URL\.createObjectURL\(file\)/);
  assert.match(editor, /URL\.revokeObjectURL\(url\)/);
  assert.doesNotMatch(editor, /useMemo\(\(\)=>URL\.createObjectURL/);
  for (const source of ownerFlows) assert.match(source, /<ImageEditor/);
  assert.doesNotMatch(documents, /<ImageEditor/);
});
