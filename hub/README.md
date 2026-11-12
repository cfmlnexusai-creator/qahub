# QA Hub

Shared SDET test management using a Node.js API, Supabase Auth/Postgres and Vercel. Existing screens are preserved.

See [DEPLOYMENT.md](DEPLOYMENT.md) for database setup, data migration, account linking and deployment.

Run `npm test`, `npm run test:ui`, `npm run build`, and `npm start` from this folder.

Admins assign cases and see team progress. Other users receive only assigned cases. Shared data refreshes every 15 seconds or on window focus. The server enforces permissions and prevents stale concurrent saves.

Real sign-in requires configured Supabase credentials and linked Auth accounts. Tests use fixtures and a mocked backend.
