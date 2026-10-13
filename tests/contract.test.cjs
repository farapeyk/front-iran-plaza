const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const read = name => JSON.parse(fs.readFileSync(path.join(__dirname, '../contracts', name), 'utf8'));

test('frontend contract keeps the reviewed backend names and operations, with complete public fields', () => {
  const schema = read('openapi.json');
  const baseline = read('openapi-names.json');
  assert.deepEqual(Object.keys(schema.components.schemas).sort(), baseline.schemas);
  const enums = {};
  const visit = (node, location) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node.enum)) enums[location] = node.enum;
    if (node.$ref) {
      assert.ok(node.$ref.startsWith('#/'), 'External references require explicit review');
      let target = schema;
      for (const part of node.$ref.slice(2).split('/')) target = target?.[part.replace(/~1/g, '/').replace(/~0/g, '~')];
      assert.ok(target, node.$ref);
    }
    for (const [key, value] of Object.entries(node)) visit(value, location + '/' + key);
  };
  visit(schema.components.schemas, 'schemas');
  assert.deepEqual(enums, baseline.enums);
  visit(schema.paths, 'paths');
  const methods = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'];
  const operations = Object.entries(schema.paths).flatMap(([route, item]) => Object.entries(item)
    .filter(([method]) => methods.includes(method))
    .map(([method, operation]) => ({ route, method, operationId: operation.operationId })));
  const sort = items => items.sort((a, b) => `${a.route}:${a.method}`.localeCompare(`${b.route}:${b.method}`));
  assert.deepEqual(sort(operations), sort(read('openapi-operations.json')));
  assert.equal(new Set(operations.map(operation => operation.operationId)).size, operations.length);
  const profile = schema.paths['/api/businesses/slug/{slug}'].get.responses['200'].content['application/json'].schema;
  assert.equal(profile.properties.id.type, 'string');
  assert.equal(profile.properties.name.type, 'string');
  assert.equal(profile.properties.products.type, 'array');
  const upload = schema.paths['/api/files/upload'].post.requestBody.content['multipart/form-data'].schema;
  assert.equal(upload.properties.file.format, 'binary');
  for (const {route, method} of operations) {
    for (const match of route.matchAll(/\{([^}]+)\}/g)) {
      const parameter = schema.paths[route][method].parameters.find(item => item.in === 'path' && item.name === match[1]);
      assert.equal(parameter.required, true);
      assert.equal(parameter.schema.type, 'string');
    }
  }
  for (const status of ['400','401','429']) {
    const error = schema.paths['/api/auth/refresh'].post.responses[status].content['application/json'].schema;
    assert.ok(error.required.includes('errorCode'));
    assert.ok(error.required.includes('statusCode'));
  }
});
