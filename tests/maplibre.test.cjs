const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('both business map views use the shared MapLibre map', () => {
  for (const file of [
    'src/features/business/components/profile/location-picker.tsx',
    'src/features/public/components/static-location-map.tsx',
  ]) {
    const source = read(file);
    assert.match(source, /@\/components\/maps\/raster-map/);
    assert.doesNotMatch(source, /react-leaflet|leaflet\/dist/);
  }
});

test('shared map uses MapLibre raster XYZ tiles and keeps click coordinates in latitude/longitude order', () => {
  const source = read('src/components/maps/raster-map.tsx');
  assert.match(source, /void import\("maplibre-gl"\)/);
  assert.match(source, /type: "raster"/);
  assert.match(source, /tiles: \[TILE_URL\]/);
  assert.match(source, /https:\/\/tile\.openstreetmap\.org\/\{z\}\/\{x\}\/\{y\}\.png/);
  assert.match(source, /event\.lngLat\.lat, event\.lngLat\.lng/);
  assert.match(source, /interactive,\s*scrollZoom: false/);
});

test('static location map disables interaction and Docker exposes the optional build-time tile URL', () => {
  const staticMap = read('src/features/public/components/static-location-map.tsx');
  const dockerfile = read('Dockerfile');
  const workflow = read('.github/workflows/production.yml');
  assert.match(staticMap, /interactive=\{false\}/);
  assert.match(dockerfile, /ARG NEXT_PUBLIC_MAP_TILE_URL[\s\S]*ENV NEXT_PUBLIC_MAP_TILE_URL=\$NEXT_PUBLIC_MAP_TILE_URL/);
  assert.match(workflow, /NEXT_PUBLIC_MAP_TILE_URL: \$\{\{ vars\.NEXT_PUBLIC_MAP_TILE_URL \}\}/);
  assert.match(workflow, /--env NEXT_PUBLIC_MAP_TILE_URL/);
});
