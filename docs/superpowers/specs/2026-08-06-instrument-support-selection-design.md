# Instrument support selection

## Goal

Add the Figma node `8036:174500` as the first Instrument support step that opens from the Request support page's **Open a support ticket** button.

## Route and interaction

- Add an `instrument-support-selection` route using the Figma frame's 1440×2339 canvas.
- Change **Open a support ticket** on `request-support` to navigate to this route.
- The new page presents the initial wizard state: **Select instrument** active, followed by **Add request details**, **Confirm contact information**, and **Review and submit**.
- Instrument rows are selectable; the primary continuation action remains unavailable until an instrument is selected.

## Visual scope

Match the Figma frame's Services Central chrome, breadcrumb, page heading, wizard progress indicator, search-and-filter controls, paginated instrument table, and bottom action bar. Preserve the existing prototype's image-canvas scaling and route hotspot pattern.

## Verification

Click **Open a support ticket** from `#request-support`, confirm that the new Instrument support selection screen renders, select an instrument row, and confirm the primary continuation action becomes available.
