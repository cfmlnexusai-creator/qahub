# QA Hub

Shared SDET test management using a Node.js API, Supabase Auth/Postgres and Vercel. Existing screens are preserved.

See [DEPLOYMENT.md](DEPLOYMENT.md) for database setup, data migration, account linking and deployment.

Run `npm test`, `npm run test:ui`, `npm run build`, and `npm start` from this folder.

Admins assign cases and see team progress. Contributors can create cases and edit/update only cases assigned to them, including cases created by an Admin. They can trash or restore only cases they created. New Contributor cases are automatically assigned to their creator. Shared data refreshes every 15 seconds or on window focus. The server enforces permissions and prevents stale concurrent saves.

The **Page checks** section contains 100 Patient Manager navigation and page-visibility cases, grouped into ten features. See [the readable test cases](docs/navigation-page-checks.md) or [portable JSON](data/modules/navigation-page-checks.json). These are manual definitions awaiting execution, not automated pass results.

Regenerate the artifacts with `npm run cases:build`. Preview additions with `npm run cases:publish`, then publish new records with `npm run cases:publish -- --apply`. Publishing never overwrites existing cases, assignments, completion or roles.

Real sign-in requires configured Supabase credentials and linked Auth accounts. Tests use fixtures and a mocked backend.

Admins can use **Share with everyone** on a module card or filtered module case list. Everyone can then browse that module under **Modules & Features** and select **Assign to me** on an unassigned case. Existing assignments cannot be taken over. **Stop sharing** ends team-wide visibility and new claims, while creators and existing assignees keep access. Claiming does not change the case creator; it grants assigned edit/update access but not deletion rights. Personal dashboard progress excludes other members' shared work.

Case detail pages keep **Steps** visible. **Objective** (including description/preconditions), **Overall expected result**, **History**, **Details** and **Ownership** start collapsed and have accessible Show/Hide controls.
