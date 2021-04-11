import meow from 'meow';
import chalk from 'chalk';
import { Logger } from '@acot/logger';
import { createAcotPreset } from './creact-acot-preset';

const logger = new Logger();

export type CLIOptions = {
  argv: string[];
};

export const main = async ({ argv }: CLIOptions) => {
  const cli = meow(
    chalk`
{bold USAGE}
  create-acot-preset <name> [flags]

{bold OPTIONS}
      --npm-client  npm client to use for dependent packages installations. (npm or yarn)
      --no-color    Force disabling of color
  -h, --help        Show help
  -v, --version     Output the version number

{bold EXAMPLES}
  $ npx create-acot-preset foo
  $ npx create-acot-preset @scoped
  $ npx create-acot-preset @scoped/foo
  $ npx create-acot-preset bar --npm-client yarn
    `,
    {
      autoHelp: false,
      autoVersion: false,
      argv,
      flags: {
        npmClient: {
          type: 'string',
          default: 'npm',
        },
        noColor: {
          type: 'boolean',
        },
        help: {
          type: 'boolean',
          alias: 'h',
        },
        version: {
          type: 'boolean',
          alias: 'v',
        },
      },
    },
  );

  if (cli.flags.help) {
    console.log(cli.help);
    return 0;
  }

  if (cli.flags.version) {
    console.log(`v${cli.pkg.version}`);
    return 0;
  }

  try {
    await createAcotPreset(cli.input[0], {
      npmClient: cli.flags.npmClient,
      cwd: process.cwd(),
      stdout: process.stdout,
      stderr: process.stderr,
    });

    return 0;
  } catch (e) {
    logger.error(e);
    return 1;
  }
};
