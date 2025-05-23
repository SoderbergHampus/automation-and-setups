// dir-hash.js
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { createReadStream, existsSync, readFile, writeFile } from 'fs';
import { readdir, stat } from 'fs/promises';
import { resolve, relative, join } from 'path';
import { pipeline } from 'stream/promises';

const FILE_HASH = 'sha256';
const TREE_HASH = 'sha256';
const SEP = '\0';
const HASH_FILENAME = 'build-hash.txt';
const HASH_LOCATION = `./${HASH_FILENAME}`;

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

const hashDirectory = async (dir, { followSymlinks = false } = {}) => {
  const root = resolve(dir);
  const treeHash = createHash(TREE_HASH);

  for await (const { path, size, fileDigest } of walk(root, followSymlinks)) {
    treeHash.update(relative(root, path) + SEP + size + SEP + fileDigest + '\n');
  }

  return treeHash.digest('hex');
};

const getPrevHash = async () => {
  return new Promise((resolve, reject) => {
    if (!existsSync(HASH_LOCATION)) {
      resolve(undefined);
    }

    readFile(HASH_LOCATION, (err, data) => {
      if (err) reject(err);
      resolve(data.toLocaleString());
    });
  });
};


/*
 * Execute
 */
const args = process.argv.slice(2);

const dir = args[0];

if (!existsSync(dir)) {
  throw Error(`Directory ${dir} does not exist`);
}

const prevHashPromise = getPrevHash();
const hashPromise = hashDirectory(dir);

const prevHash = await prevHashPromise;
const hash = await hashPromise;

if (prevHash === hash) {
  console.info('No changes in directory, skipping build');
  process.exit(0);
}

writeFile(HASH_LOCATION, hash, (err) => {
  if (err) return Promise.reject(err);
});

execSync('rm -rf build && tsc');

console.info('Build finished successfully!');
process.exit(0);
