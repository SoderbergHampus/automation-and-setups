// @ts-check

import { spawn } from 'child_process';

import { l } from '../src/util/logger.js';

/**
 * @param { string } rootDir
 * @returns
 */
export const runLint = async (rootDir) => {
  return new Promise((resolve) => {
    const lint = spawn('npx', ['eslint', rootDir], {
      stdio: 'inherit',
      shell: true
    }
    );

    lint.on('exit', (code) => {
      if (code === 0) {
        l.success('Linting passed');
      } else {
        l.error('Linting failed...');
      }
      resolve(code);
    });
  });
};
