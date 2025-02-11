---
title: Markdown Extensions
slug: q1k423y0
category: Example
tags:
  - markdown
  - example
published: 2025-02-10T21:23:23+08:00
---

This post demonstrates the use of markdown extensions.

## Directives

With [remark-directive](https://github.com/remarkjs/remark-directive), you can use three types of directives instead of HTML comments in markdown files. For example, you can generate a details element with a summary element as follows:

::::details
::summary[This is a collapsible content]
And to create this:sup[:a[1]{#fake-footnote-here data-footnote-ref href="#fake-footnote-there"}], you can use the following markdown:

````markdown
:::details
::summary[This is a collapsible content]
And to create this:sup[:a[1]{#fake-footnote-here data-footnote-ref href="#fake-footnote-there"}], you can use the following markdown:

```markdown
An infinite loop! So there is no need to write the markdown code again and again here.
```

:a[1: fake footnote here.]{#fake-footnote-there data-footnote-backref href="#fake-footnote-here"}
:::
````

:a[1: fake footnote here.]{#fake-footnote-there data-footnote-backref href="#fake-footnote-here"}
::::

Instead of using HTML comments:

```html
<details>
  <summary>This is a collapsible content</summary>
  You can't use markdown here. To create code blocks, you need to use HTML like this:
  <pre>
    <code>
      <span class="line">HTML Tags Hell!</span>
    </code>
  </pre>
</details>
```

## Components

Using directives, you can write HTML with markdown inside. But to generate complex components, it's a bit tedious, not elegant, and not easy to maintain. It's another hell of HTML tags[^1]. Fortunately, with [rehype-components](https://github.com/marekweb/rehype-components), you can use pre-defined components in markdown files.

[^1]: If you want to know how hellish it is, check the [source code](https://github.com/HPCesia/astral-halo/tree/master/src/content/posts/Markdown-Extensions.md) of this post.

### Tabs

::::tabs
::tab[Component Syntax]

```md
:::tabs
::tab[title]{active}
[content]
::tab[title]
[content]
:::
```

::tab[Parameter Description]

- `title`: The title of the tab.
- `active`: The tab is active by default, should only be used once in a tabs group.
- `content`: The content of the tab.

::tab[Component Examples]{active}

:::tabs
::tab[Tab Example 1]{active}
This is the content of tab 1.
::tab[Tab Example 2]
This is the content of tab 2.
:::

:::tabs
::tab
This is the content of tab 1.
::tab{active}
If no title, will automatically use `Tab [index]` as title.
:::

::tab[Code of Examples]

```md
:::tabs
::tab[Tab 1]{active}
This is the content of tab 1.
::tab[Tab 2]
This is the content of tab 2.
:::
```

```md
:::tabs
::tab
This is the content of tab 1.
::tab{active}
If no title, will automatically use `Tab [index]` as title.
:::
```

::::

### Inline

:::tabs
::tab[Component Syntax]

```md
:inline[content]
```

::tab[Parameter Description]

- `content`: The content of the inline component, will add `inline` class to the rendered content.

::tab[Component Examples]{active}

This is an inline img example: :inline[![Inline Image](/favicon/favicon-192x192.png)].

::tab[Code of Examples]

```md
This is an inline img example: :inline[![Inline Image](/favicon/favicon-192x192.png)].
```

:::
