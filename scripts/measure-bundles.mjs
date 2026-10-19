import { existsSync, readdirSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const distComponentsDir = resolve(rootDir, 'dist/components');
const srcComponentsDir = resolve(rootDir, 'src/lib/components');
const outputStatsPath = resolve(rootDir, 'src/routes/lab/bundle-stats.json');

const stats = {};

async function measureComponent(name, entryPath) {
  try {
    const output = await build({
      configFile: false,
      logLevel: 'error',
      resolve: {
        alias: {
          $lib: existsSync(resolve(rootDir, 'dist'))
            ? resolve(rootDir, 'dist')
            : resolve(rootDir, 'src/lib')
        }
      },
      plugins: [svelte({ compilerOptions: { runes: true } })],
      build: {
        write: false,
        minify: true,
        lib: {
          entry: entryPath,
          formats: ['es'],
          fileName: name
        },
        rollupOptions: {
          external: ['svelte', /^svelte\//]
        }
      }
    });

    const chunk = Array.isArray(output) ? output[0].output[0] : output.output[0];
    if (chunk && chunk.code) {
      const gzipped = gzipSync(Buffer.from(chunk.code));
      return (gzipped.length / 1024).toFixed(1);
    }
  } catch (err) {
    console.warn(
      `[measure-bundles] Warning: Programmatic bundle of ${name} failed, falling back.`,
      err.message
    );
  }
  return null;
}

async function run() {
  const targetDir = existsSync(distComponentsDir) ? distComponentsDir : srcComponentsDir;
  if (!existsSync(targetDir)) {
    console.warn('Neither dist/components nor src/lib/components found.');
    return;
  }

  const entries = readdirSync(targetDir);
  for (const entry of entries) {
    const entryPath = join(targetDir, entry);
    if (!statSync(entryPath).isDirectory()) continue;

    const jsEntry = join(entryPath, 'index.js');
    const tsEntry = join(entryPath, 'index.ts');
    const chosenEntry = existsSync(jsEntry) ? jsEntry : existsSync(tsEntry) ? tsEntry : null;

    if (chosenEntry) {
      const size = await measureComponent(entry, chosenEntry);
      if (size !== null) {
        stats[entry] = size;
      }
    }
  }

  mkdirSync(dirname(outputStatsPath), { recursive: true });
  writeFileSync(outputStatsPath, JSON.stringify(stats, null, 2) + '\n', 'utf-8');
  console.log(`✓ Measured real minified bundle sizes:`, stats);
}

run();
