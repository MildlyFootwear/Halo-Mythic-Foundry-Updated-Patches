# Reference Data Tools

These scripts regenerate tracked JSON definition files from the spreadsheet CSV exports in `data/reference/`.

Run from the repository root:

```powershell
node tools/reference/generate-weapon-json.mjs
node tools/reference/generate-armor-json.mjs
```

They are development tools only. Foundry does not load this folder at runtime.
