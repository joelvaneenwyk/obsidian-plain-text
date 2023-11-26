import { closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import {
  HighlightStyle,
  bracketMatching,
  foldGutter,
  foldKeymap,
  indentOnInput,
  syntaxHighlighting
} from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { Compartment, EditorState, Extension } from '@codemirror/state';
import { EditorView, dropCursor, keymap } from '@codemirror/view';
import { tags as t } from '@lezer/highlight';

import { python } from '@codemirror/lang-python';

const codeMirrorConfig = {
  name: 'obsidian',
  dark: false,
  background: 'var(--background-primary)',
  foreground: 'var(--text-normal)',
  selection: 'var(--text-selection)',
  cursor: 'var(--text-normal)',
  dropdownBackground: 'var(--background-primary)',
  dropdownBorder: 'var(--background-modifier-border)',
  activeLine: 'var(--background-primary)',
  matchingBracket: 'var(--background-modifier-accent)',
  keyword: '#d73a49',
  storage: '#d73a49',
  variable: 'var(--text-normal)',
  parameter: 'var(--text-accent-hover)',
  function: 'var(--text-accent-hover)',
  string: 'var(--text-accent)',
  constant: 'var(--text-accent-hover)',
  type: 'var(--text-accent-hover)',
  class: '#6f42c1',
  number: 'var(--text-accent-hover)',
  comment: 'var(--text-faint)',
  invalid: 'var(--text-error)',
  regexp: '#032f62'
};

const obsidianTheme = EditorView.theme(
  {
    '&': {
      color: codeMirrorConfig.foreground,
      backgroundColor: codeMirrorConfig.background
    },

    '.cm-content': { caretColor: codeMirrorConfig.cursor },

    '&.cm-focused .cm-cursor': { borderLeftColor: codeMirrorConfig.cursor },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, & ::selection': {
      backgroundColor: codeMirrorConfig.selection
    },

    '.cm-panels': {
      backgroundColor: codeMirrorConfig.dropdownBackground,
      color: codeMirrorConfig.foreground
    },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },

    '.cm-searchMatch': {
      backgroundColor: codeMirrorConfig.dropdownBackground,
      outline: `1px solid ${codeMirrorConfig.dropdownBorder}`
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: codeMirrorConfig.selection
    },

    '.cm-activeLine': { backgroundColor: codeMirrorConfig.activeLine },
    '.cm-activeLineGutter': {
      backgroundColor: codeMirrorConfig.background
    },
    '.cm-selectionMatch': { backgroundColor: codeMirrorConfig.selection },

    '.cm-matchingBracket, .cm-nonmatchingBracket': {
      backgroundColor: codeMirrorConfig.matchingBracket,
      outline: 'none'
    },
    '.cm-gutters': {
      backgroundColor: codeMirrorConfig.background,
      color: codeMirrorConfig.comment,
      borderRight: '1px solid var(--background-modifier-border)'
    },
    '.cm-lineNumbers, .cm-gutterElement': { color: 'inherit' },

    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: codeMirrorConfig.foreground
    },

    '.cm-tooltip': {
      border: `1px solid ${codeMirrorConfig.dropdownBorder}`,
      backgroundColor: codeMirrorConfig.dropdownBackground,
      color: codeMirrorConfig.foreground
    },
    '.cm-tooltip.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        background: codeMirrorConfig.selection,
        color: codeMirrorConfig.foreground
      }
    }
  },
  { dark: codeMirrorConfig.dark }
);

const obsidianHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: codeMirrorConfig.keyword },
  {
    tag: [t.name, t.deleted, t.character, t.macroName],
    color: codeMirrorConfig.variable
  },
  { tag: [t.propertyName], color: codeMirrorConfig.function },
  {
    tag: [t.processingInstruction, t.string, t.inserted, t.special(t.string)],
    color: codeMirrorConfig.string
  },
  {
    tag: [t.function(t.variableName), t.labelName],
    color: codeMirrorConfig.function
  },
  {
    tag: [t.color, t.constant(t.name), t.standard(t.name)],
    color: codeMirrorConfig.constant
  },
  {
    tag: [t.definition(t.name), t.separator],
    color: codeMirrorConfig.variable
  },
  { tag: [t.className], color: codeMirrorConfig.class },
  {
    tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
    color: codeMirrorConfig.number
  },
  {
    tag: [t.typeName],
    color: codeMirrorConfig.type,
    fontStyle: codeMirrorConfig.type
  },
  { tag: [t.operator, t.operatorKeyword], color: codeMirrorConfig.keyword },
  {
    tag: [t.url, t.escape, t.regexp, t.link],
    color: codeMirrorConfig.regexp
  },
  { tag: [t.meta, t.comment], color: codeMirrorConfig.comment },
  {
    tag: [t.atom, t.bool, t.special(t.variableName)],
    color: codeMirrorConfig.variable
  },
  { tag: t.invalid, color: codeMirrorConfig.invalid }
]);

export const basicExtensions: Extension[] = [
  history(),
  foldGutter(),
  dropCursor(),
  EditorState.allowMultipleSelections.of(true),
  indentOnInput(),
  EditorView.lineWrapping,
  bracketMatching(),
  closeBrackets(),
  highlightSelectionMatches(),
  obsidianTheme,
  syntaxHighlighting(obsidianHighlightStyle),
  keymap.of([
    ...closeBracketsKeymap,
    ...defaultKeymap,
    ...searchKeymap,
    ...historyKeymap,
    indentWithTab,
    ...foldKeymap,
    ...completionKeymap,
    ...lintKeymap
  ])
];

// TODO: Do I need to use compartments, or is there a better way?
const language = new Compartment();

// TODO: Set default to something more sane, even though it doesn't technically matter once everything works
export const languageExtension: Extension[] = [language.of(python())];

// TODO: Add all languages that the plugin should support
const LANGUAGES: Map<string, Extension> = new Map([['py', python()]]);

// TODO: This currently does not work.
export const updateLanguage = (view: EditorView, ext: string) => {
  const LANG = LANGUAGES.get(ext);
  if (LANG) {
    // Note: this _does_ get run, but I'm not sure how the dispatch works.
    view.dispatch({
      effects: language.reconfigure(LANG)
    });
  }
};
