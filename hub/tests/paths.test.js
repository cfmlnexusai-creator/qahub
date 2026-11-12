import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { APP_ROOT, appPath } from '../scripts/paths.js';

function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

test('relative JS imports and HTML assets resolve inside the relocated app', () => {
  for (const folder of ['js', 'scripts', 'tests']) {
    for (const path of files(appPath(folder)).filter((p) => /\.(m?js)$/.test(p))) {
      const source = readFileSync(path, 'utf8');
      for (const match of source.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
        assert.ok(existsSync(resolve(dirname(path), match[1])), `${path}: ${match[1]}`);
      }
    }
  }
  const html = readFileSync(appPath('index.html'), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (match[1].startsWith('data:')) continue;
    assert.ok(existsSync(appPath(match[1])), match[1]);
  }
  for (const file of ['data/library.json', 'data/library.meta.json']) assert.ok(existsSync(appPath(file)), file);
  assert.equal(appPath('scripts/serve.js'), resolve(APP_ROOT, 'scripts/serve.js'));
});

test('Vercel build publishes only public app assets', async () => {
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, [appPath('scripts/build.js')]);
  assert.ok(existsSync(appPath('dist/index.html')));
  for (const privatePath of ['data', 'server', '.env', 'scripts', 'supabase']) {
    assert.equal(existsSync(appPath('dist/' + privatePath)), false);
  }
});
