# Services Central prototype

Pixel-accurate implementation of the Services Central Figma prototype, including its independent workflow and regional starting points.

## Run locally

```bash
python3 -m http.server 4173
```

Then open <http://localhost:4173>.

## Included

- Sign-in start screen with a functional username field and Next action
- Complete 1440 × 2537 Services Central dashboard
- Connected dashboard navigation, cards, CTAs, ticket links, and instrument links
- 10 primary product destinations: instruments, add instruments, installations, support history, service plan contacts, request support, notifications, consumables, education, and ticket detail
- 13 independent Figma flow starts, including email-entry workflows and Europe, North America, and Korea regional dashboards
- An **All flows** directory available from every routed screen
- Responsive scaling and keyboard-accessible interaction hotspots
- Local Figma renders, so the implementation does not depend on expiring Figma asset URLs
- Sign-in help dialog, browser history routing, and prototype action feedback
- The bottom navigation icon opens the Figma Get help modal over the current page

The implementation begins at Figma node `3351:86838` and keeps every captured Figma render in `assets/flows/` so navigation remains stable after the temporary Figma asset URLs expire.
