# Supabase and Vercel setup

## Current live environment

- Application: https://qahub-plum.vercel.app
- Vercel project: `qahub`, team `nexus-cfml-ai`.
- Supabase project reference: `fmmhcchobjbkqwhkmcak`.
- Initial dataset: 3,815 cases, 19 modules and eight team profiles from the committed library.
- Admin email: `cfmlnexusai@gmail.com`, linked to `mbr-dossmk`.
- Additional DossMK Admin login: `kalidhasan.m@mitrahsoft.in`. Both emails map to the same existing profile through `qa_identities`; authenticated emails remain separate Supabase Auth users.
- Initial password: stored only in the git-ignored repository file `.local/admin-access.json`. Keep this file private. The password can be changed through Supabase Auth administration; the app does not yet have a password-reset screen.
- Runtime credentials are in ignored `hub/.env` and encrypted Vercel production environment variables. Management tokens remain in the repository root `.env`.
- Public Auth registration is disabled. All eight team profiles have linked Supabase Auth accounts. Only `gunanidhi.s@mitrahsoft.in`, `kalidhasan.m@mitrahsoft.in` and `cfmlnexusai@gmail.com` have Admin access. The latter two share the DossMK profile. All other members, including Selshiya, are Contributors. Team passwords are stored by Supabase Auth and are not kept in repository files.
- This deployment was uploaded from local source. Git-based automatic deployments are not connected. For subsequent deployments from this linked workspace, run `npm run deploy` from `hub/`; the script uploads only approved app source paths.
- The previous local server IP restriction is not applied to Vercel. The hosted application requires authenticated membership for all data access.

Live verification covered Admin login, real browser rendering, Contributor assignment isolation, compressed completion saves visible to Admins, forbidden foreign-case writes, stale-save rejection, and anonymous database access denial. Temporary verification users and cases were removed; their server activity and case-key tombstones remain.

## Details needed from the owner

- Supabase project URL. Confirm the project is intended for QA Hub.
- Team email addresses mapped to existing usernames, and who should be an Admin.
- Vercel team/project and Git repository/branch to deploy.
- Whether to seed the committed library or a newer full JSON export from the old app. Browser edits are not automatically in the repository.
- Whether the previous two-IP restriction is still required. The local Node allowlist remains; hosted access uses Supabase authentication. Configure any required hosted restriction in Vercel Firewall before sharing the URL.

Enter secret keys in local `.env` and Vercel environment settings. Do not send account passwords, service-role keys or Vercel tokens in chat. Direct Postgres credentials are not required.

## 1. Create the schema

Run the SQL files in `supabase/migrations/` in numeric order in the Supabase SQL editor. The first creates `qa_workspace` (JSONB snapshot with an atomic revision counter) and `qa_identities` (Auth UUID to member ID). The second allows multiple authenticated emails to map to one existing member profile.

RLS is enabled and browser roles have no table privileges. Only the server service-role key accesses these tables. The API verifies tokens against Supabase Auth and checks active membership, role and case ownership on every request. Contributors may create cases; they may edit, trash, submit for review or restore only cases they created. Cases assigned to them by an Admin remain visible but are read-only unless they are also the creator. Reassignment does not remove the creator's access. Only Admins can change assignees, approve or permanently delete cases.

The Page checks section adds NAV-001 through NAV-100 in a separate Navigation & Page Checks module with ten features. Source-based manual definitions are in `data/navigation-checks.spec.json`; generated JSON and Markdown can be rebuilt with `npm run cases:build`. Run `npm run cases:publish` for a preview and append `-- --apply` to insert missing records without replacing existing work. A default fresh seed includes both the original library and this module. These definitions have not been executed against Patient Manager.

These migrations preserve the existing document model and history in Postgres JSONB. They support one shared workspace. Migration 003 adds a service-role-only function that applies changed records and metadata atomically with a revision check. Normal saves send only these changes, rather than uploading the entire library. Conflicts require refreshing and retrying. For substantially larger libraries or high write volume, migrate to per-record tables.

Background polling requests only the revision and membership information when nothing has changed. Saves wait for any active refresh and run in order; a background refresh cannot reject an Update with a busy message. Same-record version checks and shared-revision conflict detection remain enforced. Database regression checks in `supabase/tests/incremental_workspace.sql` run inside a rolled-back transaction.

## 2. Configure and seed

Use Node 22 or later. From `hub/`, copy `.env.example` to `.env` and set:

```dotenv
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_LEGACY_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVER_ONLY_SERVICE_ROLE_JWT_KEY
```

Never expose the service-role key with a public environment-variable prefix. The browser calls the same-origin Node API.

```powershell
npm run db:seed
# Or preserve newer work using a full JSON export:
npm run db:seed -- path/to/qa-hub-export.json
```

Seeding refuses to overwrite an existing workspace and prints member IDs for account linking. Export important work from the old browser before switching deployments. Review divergent browser exports before choosing the initial shared dataset.

## 3. Create and link accounts

In Supabase Authentication, create users with confirmed team emails and passwords, or invite them and complete password setup through your configured email flow. Disable public sign-ups. Local PBKDF2 hashes are not migrated; users need Supabase passwords.

Link each Auth UUID to its existing member ID:

```sql
insert into public.qa_identities (user_id, member_id)
values ('SUPABASE_AUTH_USER_UUID', 'mbr-gunanidhi');
```

Repeat for every teammate. The target must be an active member in the shared snapshot. The in-app Team page creates profiles, not Auth accounts; link new profiles separately. Roles come from the shared workspace, never client-editable Auth metadata.

## 4. Verify locally

```powershell
npm test
npm run test:ui
npm run build
npm start
```

Open `http://127.0.0.1:5173/` and sign in with a linked email and Supabase password. Sessions expire with the access token (typically one hour), then require sign-in again. Remember-me stores the session until token expiry, capped at 12 hours. Sign-out clears this browser session. Unsaved drafts are held in memory and lost on refresh; saved changes remain in Supabase.

Tests use no real credentials. Browser smoke tests use the full 3,815-case library and a mocked cloud API backed by the real store. HTTP API tests cover authentication requirements, permissions, persistence, conflicts and compression. Live Supabase/Vercel integration still requires verification after configuration.

## 5. Deploy to Vercel

Import the repository and set:

| Setting | Value |
| --- | --- |
| Root Directory | `hub` |
| Framework | Other |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js | 22.x or 24.x |

Set the three Supabase environment variables for the intended environments. Prefer a separate Supabase project for previews. Deploy. `api/index.js` is the Node function; `vercel.json` routes `/api/*` to it. Only HTML, CSS and browser JavaScript are published in `dist`. Data files, local credentials, server source and scripts are excluded from static assets.

The library is approximately 6.6 MB. State responses use gzip for browsers to fit function response limits. Large imports use gzip in browsers supporting CompressionStream. Requests above 3.5 MB compressed or 30 MB decompressed are rejected; use smaller module imports if needed. Verify large imports on the live deployment before replacing shared work.

After deployment, assign a case to a Contributor. In a second browser sign in as that user and mark it completed. Verify the Admin report updates within 15 seconds or on window focus. Confirm non-admins cannot fetch other cases through the API. Verify `/data/library.json` and `/data/users.local.json` return 404.

## Operational notes

- Keep JSON backups and configure Supabase retention.
- Ordinary changes record authenticated members and server time. Admin imports may replace history; this is not an immutable compliance audit trail.
- Use synthetic test data only.
- Workspace deletion through the UI is disabled. Admin import/replace affects everyone.
- `data/users.local.json` was already tracked in the original repository. It is excluded from deployment. `.gitignore` does not erase tracked files or Git history; do not reuse old local passwords.
