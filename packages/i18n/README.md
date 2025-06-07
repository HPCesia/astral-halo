# @astral-halo/i18n

English | [简体中文](./README.zh-CN.md)

Translation package for Astral Halo, using [`typesafe-i18n`](https://github.com/ivanhofer/typesafe-i18n) for translation.

## Usage

Before making any changes to the translation fields, please start `typesafe-i18n` in the root directory of the project:

```sh
pnpm run --filter @astral-halo/i18n typesafe-i18n
```

To use in the project, please import this package:

```js
import { L } from '@astral-halo/i18n';
```

For detailed usage, please refer to the `@typesafe-i18n/runtime` [documentation](https://github.com/ivanhofer/typesafe-i18n/blob/main/packages/runtime/README.md).
