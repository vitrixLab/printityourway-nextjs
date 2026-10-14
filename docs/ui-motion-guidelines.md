# UI motion and transition guidelines

This repository uses a CSS-first motion system so the storefront stays lightweight and easy to test.

## Motion tokens

Defined in `app/globals.css`:

- **Fast — 140 ms:** hover, focus, button press, border and color feedback.
- **Base — 220 ms:** product image changes, hover overlays, and ordinary state changes.
- **Slow — 320 ms:** restrained image scaling or larger visual emphasis.
- **Easing:** standard for state changes, enter for appearing content, and exit for content leaving.

Use transforms and opacity for motion where possible. Avoid `transition: all`; it can animate unintended layout or color changes. Keep motion subtle and never use movement as the only indicator of state.

## Implemented

- Visible keyboard focus outlines for links, buttons, form controls, summaries, and button-like elements.
- Consistent timing/easing tokens for controls and storefront interactions.
- Product-card image hover scaling and hover-image crossfade timing.
- Product gallery image-change entrance transition.
- Clearer focus treatment on filter, variation, contact, and header-search fields.
- Reduced-motion overrides that suppress nonessential animation and transitions.

## Guardrails

- Keep the existing CSS and component architecture; don't add a motion library for simple transitions.
- Do not apply transitions to every property. Prefer `opacity`, `transform`, `color`, `background-color`, and `border-color`.
- Keep controls usable without hover and ensure focus-visible states work by keyboard.
- Respect `prefers-reduced-motion: reduce`; essential information and state changes must remain visible without animation.
- Avoid introducing Next.js experimental View Transition configuration without separately validating framework support and route behavior.
- Keep the existing hero slider's reduced-motion behavior in mind when changing its animation.

## Local validation checklist

From the repository root:

1. `npm run lint`
2. `npm test`
3. `npm run build`
4. Run `npm run dev` and check product cards, product gallery thumbnails, variation selection, navigation, search/filter controls, and contact fields.
5. In browser devtools, emulate reduced motion and confirm the page remains understandable and all controls remain functional.
6. Keyboard-test with Tab and Shift+Tab; confirm each interactive element has a visible focus indicator.
7. Check narrow/mobile widths and ensure hover-only affordances aren't required to use the storefront.

These changes have been committed for local review; runtime checks should be run in your environment before merging.
