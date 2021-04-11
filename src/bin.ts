#!/usr/bin/env node
import { main } from './cli';

process.on('uncaughtException', (e: null | undefined | Partial<Error>) => {
  console.error('Uncaught exception:', e);
  process.exit(1);
});

process.on('unhandledRejection', (e: null | undefined | Partial<Error>) => {
  console.error('Unhandled rejection:', e);
  process.exit(1);
});

(async () => {
  let code = 0;

  try {
    code = await main({
      argv: process.argv.slice(2),
    });
  } catch (e) {
    console.error(e);
    code = 1;
  }

  process.exit(code);
})();
