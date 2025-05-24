import { exec } from 'child_process';
import { existsSync } from 'fs';
import os from 'os';
import { dirname, join } from 'path';
import * as readline from 'readline';
import { fileURLToPath } from 'url';

import { l } from '../util/logger.js';

const absolutePath = (p: string) => p.replace(/^~(?=$|\/|\\)/, os.homedir());

l.section('Running set-up script for terminal');

const mainFile = absolutePath('~/.zshrc');
const mainFileBackup = absolutePath('~/.zshrc-backup');
const customDir = absolutePath('~/custom-zsh');
const customDirBackup = absolutePath('~/custom-zsh-backup');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const sourceMainFile = join(__dirname, 'user-root/.zshrc');
const sourceCustomDir = join(__dirname, 'user-root/custom-zsh');


const rl = readline.createInterface({
  input:  process.stdin,
  output: process.stdout
});

const verifyAction = async (question: string) => {
  return new Promise<void>((resolve) => {
    rl.question(question, (answer) => {
      if (answer.toLowerCase() === 'y') {
        resolve();
      } else {
        l.warn('Exiting without making changes...');
        process.exit(0);
      }

    });
  });
};

type UpdateFilesProps = {
  target:       string;
  targetBackup: string;
  source:       string;
  isDir?:       boolean;
};
const updateTarget = async ({ target, targetBackup, source, isDir }: UpdateFilesProps) => {

  const flags = isDir ? '-r' : '';

  const targetExists = existsSync(target);

  if (targetExists) {
    await verifyAction(`${mainFile} already exist, will move it to ${mainFileBackup} and replace. Continue? [y/n] `);
  }

  const copySourceCmd = `cp ${flags} ${source} ${target}`;
  const createBackupCmd = `mv ${target} ${targetBackup}`;
  const rmBackupCmd = `rm -rf ${targetBackup}`;

  const cmd = targetExists
    ? isDir
      ? `${rmBackupCmd} && ${createBackupCmd} && ${copySourceCmd}`
      : `${createBackupCmd} && ${copySourceCmd}`
    : copySourceCmd;

  return new Promise<{ success: boolean }>((resolve, reject) => {
    exec(cmd, (error) => {
      if (error) {
        reject(error.message);
      } else {
        resolve({ success: true });
      }
    });
  });
};

await updateTarget({
  target:       mainFile,
  targetBackup: mainFileBackup,
  source:       sourceMainFile
});

await updateTarget({
  target:       customDir,
  targetBackup: customDirBackup,
  source:       sourceCustomDir,
  isDir:        true
});

rl.close();

l.sectionSuccess('Script ran successfully!');
