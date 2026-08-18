# Request Support native page design

## Goal

Replace the image-backed `#request-support` flow with a native, interactive Services Central page matching Figma node `8026:173099` at the 1440px desktop reference size.

## Scope

- Keep the shared Services Central platform header, collapsible sidebar, footer, and flow-toolbar conventions already used by the native Dashboard, My Instruments, Support History, Service Plan Contacts, Consumables, and Installations pages.
- Render a two-column Request Support landing page below the page title.
- Use only existing repository icon and product assets from `assets/icons` and `assets/instruments`.
- Preserve existing routes: instrument support opens `instrument-support-selection`; preventive maintenance opens `pm-cycle`; service-plan and compliance quotes show a local acknowledgement; installation opens `installation-order`.

## Layout

At 1440px, the shell is 1440px wide with the fixed platform header and collapsed sidebar. The title bar reads `Request support` and uses the same page-header treatment as other native screens.

The content area starts with `Submit a request for your instrument(s)` and a short explanatory sentence. A left column presents six stacked, bordered request rows. Each row has a title, concise description, and trailing action button. The right column presents a preventive-maintenance promotion followed by two compact informational banners. The source uses substantial white space and thin neutral borders; the page should not introduce rounded card treatments that are absent from the Figma frame.

## Components and behavior

- **Header/navigation:** reuse `mi-header`, `platform-sidebar`, `mi-footer`, and their existing fixed/collapsed behavior.
- **Request rows:** semantic article rows with a text block and an accessible button. The Instrument support CTA routes to the ticket instrument-selection page. Preventive maintenance and Installation CTAs route to their existing flows. Quote CTAs display the existing toast acknowledgment.
- **Promotion cards:** native, non-interactive information cards using the Figma copy and layout density. They do not add unreferenced conversion paths.
- **Responsive behavior:** preserve the two-column desktop frame; below 980px, stack the promotion rail under the request list while retaining full-width actions and readable spacing.

## Styling and accessibility

- Use existing `--mi-*` colors, `mi-button`, header/sidebar styles, and repository Komodo icon SVGs.
- Keep page controls as real buttons/links, retain visible focus outlines, and label decorative icons with empty alt text.
- Use a 1440px desktop shell as the canonical visual target. The page will be visually verified against the accessible Figma frame and browser-rendered local page.

## Validation

- Request Support renders natively without the `assets/flows/request-support.png` screen image.
- Verify each primary CTA’s destination or toast behavior.
- Inspect the desktop view and a narrower responsive view for clipping or overlapping regions.
- Check the browser console and run `git diff --check`.
