const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./helpers.cjs');

const {
  getRichTextYoutubeEmbedSrc,
  normalizeRichTextImageSrc,
  normalizeRichTextYoutubeSrc,
} = load('src/features/content/lib/rich-text-media.ts');

test('rich-text images accept internal and HTTPS sources but reject executable URLs', () => {
  const origin = 'https://iran-plaza.ir';
  assert.equal(normalizeRichTextImageSrc('/uploads/article.webp', origin), 'https://iran-plaza.ir/uploads/article.webp');
  assert.equal(normalizeRichTextImageSrc('https://cdn.example.com/image.jpg', origin), 'https://cdn.example.com/image.jpg');
  assert.equal(normalizeRichTextImageSrc('javascript:alert(1)', origin), null);
  assert.equal(normalizeRichTextImageSrc('data:image/svg+xml,test', origin), null);
});

test('rich-text YouTube embeds normalize supported URLs and reject unrelated hosts', () => {
  assert.equal(normalizeRichTextYoutubeSrc('https://youtu.be/dQw4w9WgXcQ'), 'https://youtu.be/dQw4w9WgXcQ');
  assert.equal(getRichTextYoutubeEmbedSrc('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  assert.equal(getRichTextYoutubeEmbedSrc('https://youtu.be/dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  assert.equal(getRichTextYoutubeEmbedSrc('https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'), 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ');
  assert.equal(normalizeRichTextYoutubeSrc('https://example.com/watch?v=dQw4w9WgXcQ'), null);
  assert.equal(normalizeRichTextYoutubeSrc('http://youtube.com/watch?v=dQw4w9WgXcQ'), null);
});
