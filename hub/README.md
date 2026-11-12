# QA Hub

Shared SDET test management using a Node.js API, Supabase Auth/Postgres and Vercel. Existing screens are preserved.

See [DEPLOYMENT.md](DEPLOYMENT.md) for database setup, data migration, account linking and deployment.

Run `npm test`, `npm run test:ui`, `npm run build`, and `npm start` from this folder.

Admins assign cases and see team progress. Contributors can create cases and edit, trash or restore only cases they created. They can also read cases assigned to them; assignment alone does not grant edit/delete access. New Contributor cases are automatically assigned to their creator. Shared data refreshes every 15 seconds or on window focus. The server enforces permissions and prevents stale concurrent saves.

The **Page checks** section contains 100 Patient Manager navigation and page-visibility cases, grouped into ten features. See [the readable test cases](docs/navigation-page-checks.md) or [portable JSON](data/modules/navigation-page-checks.json). These are manual definitions awaiting execution, not automated pass results.

Regenerate the artifacts with `npm run cases:build`. Preview additions with `npm run cases:publish`, then publish new records with `npm run cases:publish -- --apply`. Publishing never overwrites existing cases, assignments, completion or roles.

Real sign-in requires configured Supabase credentials and linked Auth accounts. Tests use fixtures and a mocked backend.
