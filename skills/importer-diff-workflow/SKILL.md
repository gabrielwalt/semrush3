---
name: importer-diff-workflow
description: The mechanical bash recipe for diffing a re-imported page against its reference — the loop marker-driven-import references but doesn't define. Use after running an import/parser change on projects using the marker-driven bulk runner (run-bulk-import.js) — to confirm no content was lost. Goal is spotting unintended content loss, NOT byte-identical output (DA media hashes and spacing classes legitimately differ).
---

After any parser change, diff each re-imported page against its remote reference to catch silent content loss. The remote AEM endpoint is the reference truth; the local `content/` file is what you just generated.

```bash
curl -s 'https://<branch>--<repo>--<owner>.aem.page/<path>.plain.html' -o /tmp/ref.html
diff -u /tmp/ref.html content/<path>.plain.html   # unified diff — context lines expose text drift too
```

To check **all** validated pages after a parser change (edits ripple — a fix for page A often regresses page B):
```bash
for f in content/*.plain.html; do
  path="${f#content/}"; path="${path%.plain.html}"
  curl -s "https://<branch>--<repo>--<owner>.aem.page/${path}.plain.html" -o /tmp/ref.html
  echo "=== $path ==="; diff -u /tmp/ref.html "$f"
done
```

## Triage (the only question: was content lost?)
The goal is **no content loss**, not byte-identity. Classify every diff:

| Expected — ignore | Content loss — FIX the parser |
|-------------------|-------------------------------|
| DA media hashes (`./media_<hash>.png`), `<picture>` wrapping | A heading / paragraph / list item / CTA in ref but absent locally |
| Spacing + section-divider classes | A whole section or block dropped |
| Attribute order, whitespace | Text changed or truncated inside a kept element |

Diffs **only** in the left column → import is good. **Any** right-column diff → the parser lost content; fix it (`marker-driven-import`), re-import, re-diff. Re-run across **all** validated pages — a fix for page A often regresses page B.

## Pitfalls
- Chasing byte-identity — media hashes and spacing classes always differ; not a regression.
- Diffing only the page you changed — parser edits ripple; diff every validated page.
- Letting the import write to `content/` instead of a temp/ref copy — back up first (`marker-driven-import`); never clobber the validated reference.

See also: `marker-driven-import` (the validation loop this implements; backup-before-import rule), `importer-parser-patterns` (fixing the parser when a diff shows loss)
