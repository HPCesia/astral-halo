# @astral-halo/i18n

[English](./README.md) | 简体中文

Astral Halo 的翻译包，使用 [`typesafe-i18n`](https://github.com/ivanhofer/typesafe-i18n) 进行翻译。

## 使用方法

对翻译字段进行任何修改前，请在项目根目录启动 `typesafe-i18n`：

```sh
pnpm run --filter @astral-halo/i18n typesafe-i18n
```

在项目中使用，请导入此包：

```js
import { L } from '@astral-halo/i18n';
```

详细使用方法请参考 `@typesafe-i18n/runtime` [文档](https://github.com/ivanhofer/typesafe-i18n/blob/main/packages/runtime/README.md)。
