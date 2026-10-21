const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { load } = require('./helpers.cjs');

test('uncategorized product recovery includes null and unknown category references', () => {
  const { getUncategorizedProducts } = load('src/features/business/lib/product-categories.ts');
  const products = [
    { id: 'assigned', productCategoryId: 'category-1' },
    { id: 'null-category', productCategoryId: null },
    { id: 'missing-category', productCategoryId: 'deleted-category' },
  ];
  const result = getUncategorizedProducts(products, [{ id: 'category-1' }]);
  assert.deepEqual(result.map(product => product.id), ['null-category', 'missing-category']);
});
test('product actions reject missing categories and support reassignment with PATCH', async () => {
  const calls = [];
  const { addProductAction, updateProductAction } = load('src/features/business/actions/products.action.ts', {
    'next/cache': { revalidatePath: () => {} },
    '@/features/business/actions/authed-fetch': {
      authedFetch: async (...args) => {
        calls.push(args);
        return { success: true, data: { id: 'product-1', ...args[2] } };
      },
    },
  });

  const invalid = await addProductAction('business-1', {
    name: 'محصول',
    price: 100,
  });
  assert.equal(invalid.success, false);
  assert.equal(calls.length, 0);

  const validInput = { name: 'محصول', price: 100, productCategoryId: 'category-2' };
  const updated = await updateProductAction('business-1', 'product-1', validInput);
  assert.equal(updated.success, true);
  assert.deepEqual(calls[0], [
    '/api/businesses/business-1/products/product-1',
    'PATCH',
    validInput,
  ]);
});
test('new product form requires a selected subcategory', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/design/pages/product-live.tsx'), 'utf8');
  assert.match(source, /name="categoryId" required/);
  assert.doesNotMatch(source, /بدون دسته‌بندی/);
  assert.match(source, /categories\.length===0/);
});
test('owner product manager renders recovery products with edit and delete controls', () => {
  const source = fs.readFileSync(path.join(__dirname, '../src/features/business/components/profile/products-manager.tsx'), 'utf8');
  assert.match(source, /uncategorizedProducts\.map\(renderProduct\)/);
  assert.match(source, /updateProductAction\(businessId, editingProduct\.id/);
  assert.match(source, /aria-label=\{`ویرایش \$\{product\.name\}`\}/);
  assert.match(source, /handleRemoveProduct\(product\.id\)/);
});
