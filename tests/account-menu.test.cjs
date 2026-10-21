const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { load } = require('./helpers.cjs');

function renderAccountMenu(business) {
  const { DashboardLoginButton } = load('src/design/components/dashboard-login-button.tsx', {
    'next/image': {
      __esModule: true,
      default: props => React.createElement('img', props),
    },
    '@/design/navigation': {
      Link: ({ to, children, ...props }) => React.createElement('a', { ...props, href: to }, children),
    },
    '@/design/lib/utils': {
      cn: (...values) => values.filter(Boolean).join(' '),
    },
    '@/design/components/ui/button-variants': {
      buttonVariants: () => 'button',
    },
    '@/design/components/user-avatar': {
      UserAvatar: () => React.createElement('span'),
    },
    '@/design/provider': {
      useDesignUser: () => ({ fullName: 'کاربر', phone: '09120000000' }),
      useDesignBusiness: () => business,
    },
  });

  return renderToStaticMarkup(React.createElement(DashboardLoginButton, { defaultOpen: true }));
}

test('account menu only offers business registration when the user has no business', () => {
  assert.match(renderAccountMenu(null), /href="\/business-registration"/);
  assert.doesNotMatch(renderAccountMenu({ id: 'existing-business' }), /href="\/business-registration"/);
});
test('public design providers include the current business', () => {
  for (const relativePath of ['src/app/page.tsx', 'src/app/(public)/layout.tsx']) {
    const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
    assert.match(source, /getDesignAccount\(\)/);
    assert.match(source, /business=\{business\}/);
  }
});
