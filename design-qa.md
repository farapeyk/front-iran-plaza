# Design QA — Mobile frontend refinements

## Comparison setup

- Source visual truth:
  - `C:/Users/Hp/Downloads/1 (1).png` — login, 1508 × 1200 px.
  - `C:/Users/Hp/Downloads/2 (1).png` — mobile home/header, 328 × 719 px; the top 35 px annotation strip was excluded from the normalized app comparison.
  - `C:/Users/Hp/Downloads/3 (1).png` — open mobile menu, 524 × 1439 px.
  - `C:/Users/Hp/Downloads/4.png` — empty mobile search/category state, 1152 × 2928 px; the centered 550 px design column was used for focused comparisons and Ads were intentionally excluded per the request.
  - `C:/Users/Hp/Downloads/5.png` — recent-search state, 799 × 1593 px; Ads were intentionally excluded per the request.
- Browser-rendered implementation evidence:
  - `test-results/mobile-ui-qa/login-final-754x600-at2x.png` — 1508 × 1200 px output, 754 × 600 CSS px, device scale factor 2.
  - `test-results/mobile-ui-qa/home-final-328x684.png` — 328 × 684 px, device scale factor 1.
  - `test-results/mobile-ui-qa/menu-final-393x852.png` — 393 × 852 px, device scale factor 1.
  - `test-results/mobile-ui-qa/search-empty-final-393x852.png` — 393 × 852 px, device scale factor 1.
  - `test-results/mobile-ui-qa/search-history-cdp-393x852.png` — 393 × 852 px, device scale factor 1.
  - `test-results/reference-pages/375-business.png` — mobile business profile with the products/services switch and checked feature section.
- Combined comparison evidence:
  - `test-results/mobile-ui-qa/comparison-login.png`
  - `test-results/mobile-ui-qa/comparison-home.png`
  - `test-results/mobile-ui-qa/comparison-menu.png`
  - `test-results/mobile-ui-qa/comparison-search-header.png`
  - `test-results/mobile-ui-qa/comparison-search-categories.png`
  - `test-results/mobile-ui-qa/comparison-search-history.png`
- States checked: mobile home, menu open/close, search without history, search with history, desktop/tablet login phone step, and the mobile business-profile products/services states.
- Browser checks: narrow screens had no horizontal overflow; visible images loaded; IranSans loaded; the menu opened to the full viewport width and closed from its X control with focus restored; 15 fallback/live categories rendered; persisted recent-search rows rendered from local storage; products and services switched without co-rendering. Browser console and runtime exception collection returned no errors.

## Findings

- No actionable P0, P1, or P2 mismatch remains.
- Fonts and typography: IranSans is loaded for Persian UI. The phone prefix deliberately uses a Latin font so it renders as `+98`, matching the source. Mobile hero sizes were reduced to preserve the one-line headline at the 328 px reference width.
- Spacing and layout rhythm: the login split, image crop, form width, and field placement match the normalized source. The header action order, full-width drawer, search rows, circular category icons, dividers, and RTL alignment match the intended hierarchy without horizontal overflow.
- Colors and visual tokens: existing Iran Plaza primary green, cream surface, muted borders, and dark drawer gradient are retained. Contrast remains sufficient for text and controls.
- Image quality and asset fidelity: the supplied login photograph and existing brand/category/icon assets are used directly; no placeholder, CSS-drawn, or emoji replacement is present.
- Copy and content: requested Persian labels, category names, `+98`, back label, and recent-search heading are present. Ads are omitted intentionally.

## Comparison history

1. Initial pass found invisible white home/category icons on the light bottom bar, reversed header/search/login ordering, a narrow partial-width drawer, and `/search` reusing the desktop business listing. These were replaced with visible green assets, explicit physical direction, a full-width mobile drawer, and a dedicated mobile search experience.
2. The first browser pass found the login layout using its mobile branch at the normalized 754 CSS px source width and the phone prefix using Persian numerals. The login breakpoint was corrected and the prefix isolated to a Latin font. The home headline/search density and drawer spacing were then tightened against the normalized comparisons.
3. Final browser evidence shows zero horizontal overflow, zero console/runtime errors, and no broken visible images in the final repeated pass.

## Follow-up polish

- [P3] The reference menu frame is unusually tall; on shorter real devices the last secondary items require scrolling, while preserving the same spacing and full-width presentation.
- [P3] Live API business totals are not part of the current frontend contract. The interface therefore omits business totals and only shows a subcategory count when it can be computed from live category data.

## Implementation checklist

- [x] Visible bottom-navigation icons for Home and Businesses.
- [x] Physical left logo / physical right actions in the mobile header.
- [x] Login image-left/form-right layout with right-aligned input and Latin `+98` prefix.
- [x] Full-width mobile drawer with matching hierarchy and active Home state.
- [x] Visible close control inside the open mobile drawer.
- [x] Dedicated mobile search page without Ads and with all categories.
- [x] Search category metadata contains no fabricated business totals.
- [x] Local recent-search persistence, validation, de-duplication, and rendering.
- [x] Business features use green checks; products and priced services use a two-state tab.
- [x] Browser, lint, type, test, and production-build verification.

final result: passed
