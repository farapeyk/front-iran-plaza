# Business Profile Change Report

This note tracks the front-end work for the product team's 33-item report. Figma assets were not included, so visual placement remains subject to design review.

## Implemented in this branch

- Review submission accepts text without a score, sends an optional rating, renders unrated reviews without stars, and calculates averages from scored reviews only. The API contract has been updated to allow optional request ratings and nullable response ratings.
- Review replies show at most two entries inline and expose all replies in an accessible modal when there are more than two.
- Profile breadcrumbs include the linked category and its parent. Active VIP businesses show the VIP badge and a working share control next to the logo; the redundant share action was removed from the contact row. Similar-business cards query the same category and exclude the current business.
- Introduction video opens in a modal from the profile logo and business card. About text collapses at ten lines, and gallery lightbox images preserve their full aspect ratio.
- Profile location displays the map for the selected branch, the primary-branch marker, click-to-call links, and active discount/installment/feature tags. The business card repeats the address and tags with matching icons.
- Product/service tabs are hidden when either side has no entries. The existing editor already handles uncategorized products and category assignment.

## Existing behavior confirmed

The profile tab divider already exists. The shared contact sheet already supplies contact actions and icons. Product management already permits recovering products without a category, requires a category for new items, and permits changing the category of an existing product.

## Pending product or design input

- Item 18 asks whether the initial list should contain exactly two items; the report marks this count as needing confirmation.
- Item 33 needs the verified company support phone number and display format.
- The approved Figma link/assets are needed to verify badge/subscription placement, spacing, and icon styling.
- Item 17 needs confirmation whether restaurant menu entries should reuse product categories or use a distinct menu structure.
- Item 19 needs the supported installment-start choices and storage semantics.
- Item 21 needs the podcast upload, file size/type, and playback requirements.
- Item 8's sticky business card needs viewport and footer overlap acceptance criteria; current sticky positioning is only a first implementation.

## Local and review verification

- Frozen pnpm install, typecheck, lint, all 83 tests, generated-client reproducibility, production build (73 pages), and the production HTTP fixture passed.
- The workstation used Node 24.13.0 and reported the repository's Node >=24.18.0 engine warning. The reviewed Docker image was also built successfully with Node 24.18.0.
- On the isolated review server, frontend home and admin login and the backend categories API returned HTTP 200. The review database has no active public business, so a live business-profile slug was not available for an end-to-end profile smoke test.