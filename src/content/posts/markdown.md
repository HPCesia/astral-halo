---
title: Markdown Example
description: A simple example of a Markdown blog post.
category: Example
slug: '19981207'
published: 2025-01-01T12:00:00+08:00
tags:
  - markdown
  - example
---

Here is an example of a Markdown blog post.

# Heading Level 1 (I suggest not to use this level)

Heading Level 1 is reserved for the post title, so you should start with Heading Level 2.

<details>
  <summary>Or</summary>
  <p>
    Add <code>import remarkHeadingShift from './src/plugins/remark-heading-shift.mjs';</code> to the top of <code>astro.config.mjs</code> and uncomment the first line of the <code>remarkPlugins</code> array, then you can use Heading Level 1 as a regular heading in your blog posts.
  </p>
</details>

## Heading Level 2

You can use GitHub Flavored Markdown to format your blog posts. For example, you can use **bold**, _italic_ and ~~strikethrough~~ text, create a [link](https://example.com) or just write a raw URL like https://example.com, and add images:

![Example Image](../../assets/img/avatar.jpg)

Common Markdown features like:

- Lists
  - Nested lists
  - More nested lists
- More lists
- And more lists

1. Numbered lists
2. More numbered Lists
   - Nested lists
   - More nested lists
     1. Nested Numbered lists
3. And more numbered lists
   1. Another nested numbered list
   2. More nested numbered lists

> Or a blockquote.

You can use <code>\`</code> to create code line like `this`, or

````markdown
```markdown
use triple backticks to create code blocks.
```
````

$\LaTeX$ formulas are also supported, inline formula like $e^{i\pi} + 1 = 0$ or block formula like:

$$
 \int_{-\infty}^{+\infty} e^{-x^2} \mathrm{d}x = \sqrt{\pi}
$$

### Heading Level 3

Other GitHub Flavored Markdown features include:

- [x] Task lists
- [ ] More task lists
- [ ] And more task lists

And tables:
| Header 1 | Header 2 |
|----------|----------|
| Row 1 | Row 1 |
| Row 2 | Row 2 |
| A looooooooooong row | A looooooooooong row |
| A very loooooooooooooooooooooooooooooooooooooooooooooooooong row | |

You can also add footnotes[^1] or [reference links][1].

[^1]: This is a footnote.

[1]: https://example.com

[GitHub blockquote alerts](https://github.com/orgs/community/discussions/16925) is also supported:

> [!NOTE]
> This is a note.

> [!TIP]
> This is a tip.

> [!IMPORTANT]
> This is important.

> [!WARNING]
> This is a warning.

> [!CAUTION]
> This is a caution.

And that's it!

#### I Think You Want to Have a Look at Heading Level 4

##### Too Many Nested Headings is Not a Good Idea, but Here is Heading Level 5

###### Heading Level 6 is the Last One, Why You Want to Use This?
