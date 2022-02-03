/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';

async function globalTeardown() {
  // Remove .env.production
  fs.unlink(path.join(__dirname, '..', '.env.production'), (err) => {
    if (err) {
      console.error('Error deleting .env.production');
      throw err;
    }
  });
}

module.exports = globalTeardown;
