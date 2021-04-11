# create-acot-preset

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/acot-a11y/create-acot-preset/CI?style=flat-square)](https://github.com/acot-a11y/create-acot-preset/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/create-acot-preset?style=flat-square)](https://www.npmjs.com/package/create-acot-preset)
[![MIT LICENSE](https://img.shields.io/github/license/acot-a11y/create-acot-preset?label=license&style=flat-square)](./LICENSE)

Create acot preset project.

## Quick Started

```bash
$ npx create-acot-preset foo
$ cd acot-preset-foo
$ npm run build
```

A template for the `acot-preset-foo` package is created. See [template.md](./template.md) for the generated structure.

### Next

See [Creating a preset](https://github.com/acot-a11y/acot/blob/canary/docs/developer-guide/preset.md) and develop your preset. Happy Hacking!

## Usage

Usage of `create-acot-preset` command.

```
  Create acot preset project.

  USAGE
    create-acot-preset <name> [flags]

  OPTIONS
        --npm-client  npm client to use for dependent packages installations. (npm or yarn)
        --no-color    Force disabling of color
    -h, --help        Show help
    -v, --version     Output the version number

  EXAMPLES
    $ npx create-acot-preset foo
    $ npx create-acot-preset @scoped
    $ npx create-acot-preset @scoped/foo
    $ npx create-acot-preset bar --npm-client yarn
```

### npx

```bash
$ npx create-acot-preset foo
```

### npm

```bash
$ npm init acot-preset foo
```

_`npm init <initializer>` is available in npm 6+_

### Yarn

```bash
$ npx create-acot-preset foo
```

_`yarn create <starter-kit-package>` is available in Yarn 0.25+_

## References

- [Creating a preset](https://github.com/acot-a11y/acot/blob/canary/docs/developer-guide/preset.md)
- [@acot/cli](https://github.com/acot-a11y/acot/tree/canary/packages/cli)

## License

[MIT © wadackel](./LICENSE)
