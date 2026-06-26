# PROJECT-PLAN.md

The single source of executable work. Always execute the first `🔲 Open` task unless directed otherwise. Mark a task `✅ Done` the moment it is complete.

| ID | Status | Priority | Task | Files | Acceptance |
|----|--------|----------|------|-------|------------|
| T-001 | ✅ Done | High | Run migration-orientation — capture authoring model, scope, sources, fidelity, and record the migration strategy in PROJECT-DESIGN.md before any implementation. | PROJECT-DESIGN.md | `## Migration Strategy` section filled; orientation conversation complete |
| T-002 | ✅ Done | High | Build the global style foundation (the workbench) — extract brand tokens, type scale, color, spacing, and default-content styling from the live semrush.com homepage at Refined fidelity. Record tokens in PROJECT-DESIGN.md. | styles/styles.css, PROJECT-DESIGN.md | `:root` tokens populated; type scale + color + spacing recorded; detect.mjs clean |
| T-003 | 🔲 Open | High | Import the homepage content (DA `.plain.html`) and pass GATE 1 (content structure validation). | content/index.plain.html | Content imported; structure validated by user |
| T-004 | ✅ Done | High | Style the homepage block-by-block to match the original (Refined), pass GATE 2. | blocks/*, styles/* | GATE 2 passed 2026-06-26 (~97% vs live); homepage frozen |
