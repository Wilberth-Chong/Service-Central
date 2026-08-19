# Open Support Ticket Completion Design

## Goal

Complete the coded support-ticket flow through request details, contact information, and review/submission while preserving the selected instrument and all entered data between steps.

## Scope

- Reuse the existing native shell, `PlatformActionBar`, and cancel-confirmation modal.
- Expose a reusable four-step `TicketStepViewer` component.
- Add `open-support-ticket-contact` and `open-support-ticket-review` routes.
- Store selected instrument, request data, uploaded files, and contact data in one in-memory ticket draft.
- Render the Figma-derived empty and filled layouts for steps 2 and 3, and a dynamic review for step 4.

## Interaction rules

- Required values enable Continue only when the current step is valid.
- Step 1 routes to step 2, step 2 to step 3, and step 3 to step 4.
- Back returns to the immediately preceding step. Cancel confirms and returns to the request-support entry route.
- Step 4 shows a local success toast after Submit request; no backend data is transmitted.
- Files are shown only after selection and appear before the upload requirements.

## Visual rules

- Retain Komodo typography, form controls, colors, and the native-flow page chrome.
- Use the blue information icon and the shared tooltip treatment.
- Match the provided Figma frames for request-detail upload cards, instrument information, contact fields, review hierarchy, and step states at the canonical desktop frame.
