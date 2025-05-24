// @ts-check

import { spawn } from 'child_process';
import { createHash } from 'crypto';
import { createReadStream, existsSync, readFile } from 'fs';
import { readdir, stat } from 'fs/promises';
import { resolve, relative, join } from 'path';
import { pipeline } from 'stream/promises';

// import { runLint } from './linter.js';
import { l } from '../src/util/logger.js';

const FILE_HASH = 'sha256';
const TREE_HASH = 'sha256';
const SEP = '\0';
export const HASH_FILENAME = 'build-hash.txt';
export const HASH_LOCATION = `./${HASH_FILENAME}`;

const IGNORE_FILES = [HASH_FILENAME, 'build', 'node_modules', '.git'];

/*
 * Helpers
 */

async function* walk(current, followSymlinks) {
  const names = await readdir(current, { withFileTypes: true })
    .then((files) => {
      return files
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((file) => !IGNORE_FILES.includes(file.name));
    });

  for (const dirent of names) {
    const fullPath = join(current, dirent.name);

    if (dirent.isDirectory()) {
      yield* walk(fullPath, followSymlinks);
    } else if (dirent.isFile() || (followSymlinks && dirent.isSymbolicLink())) {
      const { size } = await stat(fullPath);
      const fileDigest = await hashFile(fullPath);
      yield { path: fullPath, size, fileDigest };
    }
  }
}

const hashFile = async (filePath) => {
  const hash = createHash(FILE_HASH);
  await pipeline(createReadStream(filePath), hash);
  return hash.digest('hex');
};

export const hashDirectory = async (dir, { followSymlinks = false } = {}) => {
  const root = resolve(dir);
  const treeHash = createHash(TREE_HASH);

  for await (const { path, size, fileDigest } of walk(root, followSymlinks)) {
    treeHash.update(relative(root, path) + SEP + size + SEP + fileDigest + '\n');
  }

  return treeHash.digest('hex');
};

export const getPrevHash = async () => {
  return new Promise((resolve, reject) => {
    if (!existsSync(HASH_LOCATION)) {
      resolve(undefined);
    } else {
      readFile(HASH_LOCATION, (err, data) => {
        if (err) reject(err);
        resolve(data.toLocaleString());
      });
    }
  });
};

export const runBuild = async () => {

  const tscPromise = new Promise((resolve) => {
    const tsc = spawn('tsc', [], { stdio: 'inherit', shell: true });
    tsc.on('exit', (code) => {
      if (code === 0) {
        l.success('tsc successfull');
        resolve(code);
      } else {
        l.error('tsc failed...');
        resolve(code);
      }
    });
  });

  const copyShPromise = new Promise((resolve) => {
    const copyfiles = spawn('copyfiles', ['-u', '1', '"src/**/*.@(sh)"', 'build'], {
      stdio: 'inherit',
      shell: true
    });

    copyfiles.on('exit', (code) => {
      if (code === 0) {
        l.success('Copy of non-node files successfull');
        resolve(code);
      } else {
        l.error('Copy of non-node files failed...');
        resolve(code);
      }
    });
  });

  const copyZshPromise = new Promise((resolve) => {
    const copyZsh = spawn('copyfiles', ['-u', '1', '"src/**/.zshrc"', '"build"'], {
      stdio: 'inherit',
      shell: true
    });

    copyZsh.on('exit', (code) => {
      if (code === 0) {
        l.success('Copy of .zshrc successfull');
        resolve(code);
      } else {
        l.error('Copy of .zshrc failed...');
        resolve(code);
      }
    });
  });

  const tscCode = await tscPromise;
  if (tscCode !== 0) return tscCode;

  const copyShCode = await copyShPromise;
  if (copyShCode !== 0) return copyShCode;

  const copyZshCode = await copyZshPromise;
  if (copyZshCode !== 0) return copyZshCode;

  return 0;
};
