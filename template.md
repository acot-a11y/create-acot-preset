# `README.md`

````markdown
# {{ pkg }}

## Installation

Install via npm:

```bash
$ npm install --save-dev {{ pkg }}
```

## Supported Rules

<!-- acot-rules:start -->
<!-- acot-rules:end -->
````

# `package.json`

```json
{
  "name": "{{ pkg }}",
  "version": "0.1.0",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "files": ["lib", "!__tests__"],
  "scripts": {
    "build": "tsc",
    "test": "acot preset test",
    "serve": "acot preset serve",
    "docgen": "acot preset docgen README.md"
  },
  "keywords": ["acot", "acot-preset"],
  "license": "MIT"
}
```

# `tsconfig.json`

```json
{
  "extends": "@acot/tsconfig",
  "compilerOptions": {
    "outDir": "lib",
    "rootDir": "src"
  }
}
```

# `src/index.ts`

```typescript
import { rules } from './rules';

export default {
  rules,
};
```

# `src/rules/index.ts`

```typescript
import type { RuleRecord } from '@acot/types';
import pageHasTitle from './page-has-title';

export const rules: RuleRecord = {
  'page-has-title': pageHasTitle,
};
```

# `src/rules/page-has-title.ts`

```typescript
import { createRule } from '@acot/core';

type Options = {};

export default createRule<Options>({
  immutable: true,

  meta: {
    help: 'https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html',
  },

  test: async (context) => {
    const title = await context.page.evaluate(() => document.title);

    context.debug('title="%s"', title);

    if (!title) {
      const node = await (async () => {
        try {
          const el = await context.page.$('head');
          return el ?? undefined;
        } catch (e) {
          context.debug(e);
          return undefined;
        }
      })();

      await context.report({
        node,
        message: 'Page MUST have a title.',
      });
    }
  },
});
```

# `docs/rules/page-has-title.md`

````markdown
# page-has-title

Web pages have titles that describe topic or purpose. WCAG 2.1 - 2.4.2.

## :white_check_mark: Correct

```html acot-head
<title>Meaningful title text</title>
```

## :warning: Incorrect

```html acot-head
<title></title>
```
````

# `.gitignore`

```
/lib
/.acot

# node
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
report.[0-9]*.[0-9]*.[0-9]*.[0-9]*.json
pids
*.pid
*.seed
*.pid.lock
lib-cov
coverage
*.lcov
.nyc_output
.grunt
bower_components
.lock-wscript
build/Release
node_modules/
jspm_packages/
typings/
*.tsbuildinfo
.npm
.eslintcache
.stylelintcache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/
.node_repl_history
*.tgz
.yarn-integrity
.env
.env.test
.env*.local
.cache
.cache/
.vscode-test
tmp/
temp/

# macOS
.DS_Store
.AppleDouble
.LSOverride
Icon
._*
.DocumentRevisions-V100
.fseventsd
.Spotlight-V100
.TemporaryItems
.Trashes
.VolumeIcon.icns
.com.apple.timemachine.donotpresent
.AppleDB
.AppleDesktop
Network Trash Folder
Temporary Items
.apdisk

# Windows
Thumbs.db
Thumbs.db:encryptable
ehthumbs.db
ehthumbs_vista.db
*.stackdump
[Dd]esktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msix
*.msm
*.msp
*.lnk
```
