// Deploy the linked project without uploading local credentials or library exports.
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { parseEnv } from 'node:util';
const root = new URL('../', import.meta.url);
const linked = JSON.parse(await readFile(new URL('.vercel/project.json', root), 'utf8'));
const local = await readFile(new URL('../.env', root), 'utf8').then(parseEnv).catch(() => ({}));
const token = process.env.VERCEL_TOKEN || local.VERCEL_TOKEN || local.VERCEL;
if (!token) throw new Error('Set VERCEL_TOKEN or VERCEL in the repository root .env.');
const team = encodeURIComponent(linked.orgId);
const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
const projectResponse = await fetch(`https://api.vercel.com/v9/projects/${linked.projectId}?teamId=${team}`, { headers });
if (!projectResponse.ok) throw new Error(`Cannot read linked Vercel project (${projectResponse.status}).`);
const { rootDirectory } = await projectResponse.json();
const uploadPrefix = rootDirectory ? `${rootDirectory}/` : '';
const files = [];
async function add(path) {
  const file = new URL(path, root);
  if ((await stat(file)).isDirectory()) {
    for (const name of await readdir(file)) await add(`${path}/${name}`);
  } else files.push({ file: uploadPrefix + path, data: (await readFile(file)).toString('base64'), encoding: 'base64' });
}
for (const path of ['api', 'server', 'js', 'css', 'index.html', 'package.json', 'vercel.json', 'scripts/build.js']) await add(path);
const response = await fetch(`https://api.vercel.com/v13/deployments?teamId=${team}`, {
  method: 'POST', headers,
  body: JSON.stringify({ name: linked.projectName, project: linked.projectId, target: 'production', files,
    projectSettings: { framework: null, buildCommand: 'npm run build', outputDirectory: 'dist' } }),
});
const deployment = await response.json();
if (!response.ok) throw new Error(`Deployment failed (${response.status}): ${deployment.error?.code || 'unknown error'}`);
await writeFile(new URL('.vercel/deployment.json', root), JSON.stringify({
  id: deployment.id, url: deployment.url, projectId: linked.projectId, teamId: linked.orgId,
}, null, 2));
console.log(`Deployment started: https://${deployment.url} (${deployment.id})`);
