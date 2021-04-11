import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import chalk from 'chalk';
import execa from 'execa';
import { extract, generate } from '@scaffdog/core';
import { shorthand2pkg } from '@acot/utils';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const fstat = (filepath: string) => {
  try {
    return fs.statSync(filepath);
  } catch (e) {
    return null;
  }
};

const fileExists = (filepath: string) => fstat(filepath)?.isFile() ?? false;

const directoryExists = (filepath: string) =>
  fstat(filepath)?.isDirectory() ?? false;

const dependencies = ['@acot/core'];
const devDependencies = [
  '@acot/cli',
  '@acot/tsconfig',
  '@acot/types',
  'typescript',
];

const npmClients = ['npm', 'yarn'];

export type CreateAcotPresetOptions = {
  npmClient: string;
  cwd: string;
  stdout: NodeJS.WriteStream;
  stderr: NodeJS.WriteStream;
};

export const createAcotPreset = async (
  name: string,
  options: Partial<CreateAcotPresetOptions> = {},
) => {
  const opts = {
    npmClient: 'npm',
    cwd: process.cwd(),
    stdout: process.stdout,
    stderr: process.stderr,
    ...options,
  };

  const exec = (cmd: string, args: string[]) =>
    execa(cmd, args, {
      cwd: dir,
      stdin: 'inherit',
      stdout: opts.stdout,
      stderr: opts.stderr,
    });

  const log = (msg: string) => opts.stdout.write(`${msg}\n`);

  // validation
  if (!name) {
    throw new Error('Please specify the name of package.');
  }

  if (!npmClients.includes(opts.npmClient)) {
    throw new Error(
      `An unsupported value for npm client. (actual: "${
        opts.npmClient
      }", expect: ${npmClients.map((nc) => `"${nc}"`).join(', ')})`,
    );
  }

  // prepare
  const pkg = shorthand2pkg(name, 'preset');
  const dir = path.resolve(opts.cwd, pkg.split('/').pop()!);
  if (fileExists(dir) || directoryExists(dir)) {
    throw new Error(
      `A file or directory exists at the output path. ("${dir}")`,
    );
  }

  const { variables, templates } = extract(
    fs.readFileSync(path.resolve(__dirname, '..', 'template.md'), 'utf8'),
  );

  variables.set('pkg', pkg);

  const files = generate(templates, variables, {
    cwd: opts.cwd,
    root: dir,
  });

  // output files
  log('');
  log(chalk`Creating new acot preset package in {bold.green ${dir}}.`);
  fs.mkdirSync(dir, { recursive: true });

  await Promise.all(
    files.map(async (file) => {
      await mkdir(path.dirname(file.output), { recursive: true });
      await writeFile(file.output, file.content, 'utf8');
    }),
  );

  // install packages
  const pkg2str = (deps: string[]) => deps.map((p) => chalk.cyan(p)).join(', ');

  log('');
  log('Installing packages. This might take a couple of minutes.');

  const installCmd: {
    dep: string[];
    dev: string[];
  } = {
    dep: [],
    dev: [],
  };

  switch (opts.npmClient) {
    case 'npm':
      installCmd.dep = ['install', '-S'];
      installCmd.dev = ['install', '-D'];
      break;

    case 'yarn':
      installCmd.dep = ['add'];
      installCmd.dev = ['add', '-D'];
      break;
  }

  log('');
  log(`Installing depedencies... (${pkg2str(dependencies)})`);
  await exec(opts.npmClient, [...installCmd.dep, ...dependencies]);

  log('\n');
  log(`Installing devDependencies... (${pkg2str(devDependencies)})`);
  await exec(opts.npmClient, [...installCmd.dev, ...devDependencies]);

  // success
  const scripts = {
    build: '',
    test: '',
    serve: '',
    docgen: '',
  };

  switch (opts.npmClient) {
    case 'npm':
      scripts.build = 'npm run build';
      scripts.test = 'npm test';
      scripts.serve = 'npm run serve';
      scripts.docgen = 'npm run docgen';
      break;

    case 'yarn':
      scripts.build = 'yarn build';
      scripts.test = 'yarn test';
      scripts.serve = 'yarn serve';
      scripts.docgen = 'yarn docgen';
      break;
  }

  log('\n');
  log(
    chalk`
${chalk.bold.inverse.green(' SUCCESS ')}

Created {bold.green ${pkg}} at {bold.green ${dir}}.
Inside that directory, you can run several commands:

  {bold.cyan ${scripts.build}}
    Build the source code and output the file to the lib directory.

  {bold.cyan ${scripts.test}}
    Test the rules based on the files in the docs/rules directory.

  {bold.cyan ${scripts.serve}}
    Launch a server that delivers the documentation created for the rules provided by the preset as HTML.

  {bold.cyan ${scripts.docgen}}
    Document generation of the list of rules provided by the preset.

We suggest that you begin by typing:

  {cyan cd ${pkg}}
  {cyan ${scripts.build}}
  {cyan ${scripts.serve}}
  `.trim(),
  );
};
