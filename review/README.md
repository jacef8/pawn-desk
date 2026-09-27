# The review bundles

Three, for three situations. All are rebuilt by tools, never hand-edited —
an earlier hand-rolled extractor duplicated a block and two reviewers
reported the duplicate as a bug in the app.

| File | Size | Use it for |
|---|---|---|
| `PASTE-THIS.md` | ~30K tokens | **The pricing core.** 22 extracted sections: the catalog, the question run, the offer arithmetic, the search, the lookup ladder, both guards. Fits anywhere. |
| `FULL-APP.md` | ~258K tokens | **The whole app.** Both front ends, the server, the tools, data samples. Upload as a file; it will not fit most paste boxes. |
| `FULL-APP-part1..4.md` | 219K / 14K / 23K / <1K | The same, split on file boundaries, for pasting in sequence. Part 1 is still large because `app.js` is 700KB and there is no honest way to shrink it. |

Rebuild before every review — the code moves daily:

    node tools/make-review-bundle.mjs     # the focused one
    node tools/make-full-bundle.mjs       # the whole app, and the parts

Both refuse to ship a bundle that duplicates a declaration, and the focused
one parses itself as JavaScript before writing.

**No secrets.** The app never holds an API key; the Railway service reads
them from the environment. The bundles carry env var *names* only. Scan
before handing one out if you have changed the server.
