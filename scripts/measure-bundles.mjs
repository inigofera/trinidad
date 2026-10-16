import { existsSync, readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const distComponentsDir = resolve(rootDir, 'dist/components');
const outputStatsPath = resolve(rootDir, 'src/routes/lab/bundle-stats.json');

const stats = {};

if (existsSync(distComponentsDir)) {
  const entries = readdirSync(distComponentsDir);
  for (const entry of entries) {
    const entryPath = join(distComponentsDir, entry);
    if (statSync(entryPath).isDirectory()) {
      let combined = '';
      const files = readdirSync(entryPath);
      for (const file of files) {
        if (file.endsWith('.js') || file.endsWith('.svelte')) {
          combined += readFileSync(join(entryPath, file), 'utf-8');
        }
      }
      if (combined.length > 0) {
        const gzipped = gzipSync(Buffer.from(combined));
        const sizeInKb = (gzipped.length / 1024).toFixed(1);
        stats[entry] = sizeInKb;
      }
    }
  }
}

mkdirSync(dirname(outputStatsPath), { recursive: true });
writeFileSync(outputStatsPath, JSON.stringify(stats, null, 2) + '\n', 'utf-8');
console.log(`✓ Measured bundle sizes:`, stats);
