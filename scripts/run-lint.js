// @ts-check

import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

import { runLint } from './linter.js';
import { l } from '../src/util/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(join(__dirname, '../.'));

l.subSection('Running lint');

const code = await runLint(rootDir);

process.exit(code);
