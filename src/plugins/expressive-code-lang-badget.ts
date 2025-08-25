import { definePlugin } from '@expressive-code/core';

export function pluginLanguageBadge() {
  return definePlugin({
    name: 'Language Badge',
    baseStyles: ({ cssVar }) => `
      [data-language]::before {
        position: absolute;
        z-index: 2;
        right: calc(${cssVar('borderWidth')} + ${cssVar('uiPaddingInline')} / 2);
        top: calc(${cssVar('borderWidth')} + 0.35rem);
        padding: 0.1rem 0.5rem;
        box-shadow: 0 0 1px 1px ${cssVar('codeBackground')};
        content: attr(data-language);
        font-size: 0.75rem;
        text-transform: uppercase;
        color: ${cssVar('uiSelectionForeground')};
        background: ${cssVar('uiSelectionBackground')};
        border-radius: ${cssVar('borderRadius')};
        pointer-events: none;
        transition: opacity 0.2s;
      }
      /* Prevent the language badge from overlapping the copy button */
      .frame:not(.has-title):not(.is-terminal) {
        /* If the copy button is always visible, move badget to the side */
        @media not (hover: hover) {
          [data-language]::before {
            color: $color-mix(in oklab,${cssVar('uiSelectionForeground')}75%,transparent);
            background: color-mix(in oklab,${cssVar('uiSelectionBackground')}15%,transparent);
            translate: -3rem 0;
          }
        }
        /* If it's only visible on hover, hide the language badge on hover */
        @media (hover: hover) {
          &:hover [data-language]::before {
            opacity: 0;
          }
        }
      }
    `,
  });
}
