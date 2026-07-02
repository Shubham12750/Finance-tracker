# Investment Analyzer

A small full-stack app to analyze investment allocations and forecast returns.

## Repository structure

- `backend/` - Node.js API and tests
- `frontend/` - Vite + React (TypeScript) frontend

## Prerequisites

- Node.js (16+ recommended)
- npm (bundled with Node.js)

## Quick start

1) Backend

```powershell
# from repository root
cd backend
npm install
# run tests
npm test
# start server
node server.js
```

2) Frontend (development)

```powershell
cd frontend
npm install
npm run dev
# open the dev URL printed by Vite (usually http://localhost:5173)
```

## Build for production

Backend: follow any existing deploy steps in `backend` (e.g., containerize or host on Node).

Frontend:

```powershell
cd frontend
npm run build
# serve the generated `dist/` with a static server
npx serve dist
```

## Testing

- Backend tests: run `npm test` in `backend`.
- Frontend: run any tests defined in `frontend/package.json` (if present).

## Common troubleshooting

- PowerShell execution policy: if you see "running scripts is disabled", either run the `npm` command from Command Prompt, or allow scripts for the current user:

```powershell
# safer, no admin required
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
```

- If ports are in use, change the dev server port in `vite.config.ts` or stop the occupying process.

## Contributing

Feel free to open issues or pull requests. Keep changes focused and add tests where appropriate.

## License

Specify a license as appropriate for this project.
