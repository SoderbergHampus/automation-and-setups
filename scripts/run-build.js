// @ts-check

import { existsSync, writeFile } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import { getPrevHash, HASH_LOCATION, hashDirectory, runBuild } from './build.js';
import { runLint } from './linter.js';
import { l } from '../src/util/logger.js';


l.section('Running build script');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(join(__dirname, '../.'));

if (!existsSync(rootDir)) {
  l.error(`Directory ${rootDir} does not exist`);
  process.exit(1);
}

const prevHashPromise = getPrevHash();
const hashPromise = hashDirectory(rootDir);

const prevHash = await prevHashPromise;
const hash = await hashPromise;

if (prevHash === hash) {
  l.warn('No changes in directory, skipping build');
  process.exit(0);
}

writeFile(HASH_LOCATION, hash, (err) => {
  if (err) return Promise.reject(err);
});

l.subSection('Running lint');
const lintCode = await runLint(rootDir);
if (lintCode !== 0) process.exit(0);

l.subSection('Running build commands');
const buildCode = await runBuild();
if (buildCode !== 0) {
  l.error('One or more build steps failed, exiting...');
  process.exit(buildCode);
}

l.sectionSuccess('Build finished successfully!');
process.exit(0);
