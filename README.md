# TestsSapo

## Playwright

Install dependencies and the Chromium browser:

```powershell
npm install
npx playwright install chromium
```

Copy `.env.example` to `.env` and fill in the test credentials locally. `.env` is ignored by Git; do not commit it.

Run the test:

```powershell
npm run test:sapo
```
