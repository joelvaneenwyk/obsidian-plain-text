import { closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { HighlightStyle, bracketMatching, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting } from '@codemirror/language';
import { lintKeymap } from '@codemirror/lint';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
import { Compartment, EditorState } from '@codemirror/state';
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
const obsidianTheme = EditorView.theme({
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
}, { dark: codeMirrorConfig.dark });
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
export const basicExtensions = [
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
export const languageExtension = [language.of(python())];
// TODO: Add all languages that the plugin should support
const LANGUAGES = new Map([['py', python()]]);
// TODO: This currently does not work.
export const updateLanguage = (view, ext) => {
    const LANG = LANGUAGES.get(ext);
    if (LANG) {
        // Note: this _does_ get run, but I'm not sure how the dispatch works.
        view.dispatch({
            effects: language.reconfigure(LANG)
        });
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZW1pcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZGVtaXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hHLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUM1RixPQUFPLEVBQ0wsY0FBYyxFQUNkLGVBQWUsRUFDZixVQUFVLEVBQ1YsVUFBVSxFQUNWLGFBQWEsRUFDYixrQkFBa0IsRUFDbkIsTUFBTSxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDOUMsT0FBTyxFQUFFLHlCQUF5QixFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzdFLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFhLE1BQU0sbUJBQW1CLENBQUM7QUFDeEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDbEUsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUU3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFakQsTUFBTSxnQkFBZ0IsR0FBRztJQUN2QixJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFJLEVBQUUsS0FBSztJQUNYLFVBQVUsRUFBRSwyQkFBMkI7SUFDdkMsVUFBVSxFQUFFLG9CQUFvQjtJQUNoQyxTQUFTLEVBQUUsdUJBQXVCO0lBQ2xDLE1BQU0sRUFBRSxvQkFBb0I7SUFDNUIsa0JBQWtCLEVBQUUsMkJBQTJCO0lBQy9DLGNBQWMsRUFBRSxtQ0FBbUM7SUFDbkQsVUFBVSxFQUFFLDJCQUEyQjtJQUN2QyxlQUFlLEVBQUUsbUNBQW1DO0lB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QUNaLE9BQU8sRUFBRSxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztTQUNwQyxDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xvc2VCcmFja2V0cywgY2xvc2VCcmFja2V0c0tleW1hcCwgY29tcGxldGlvbktleW1hcCB9IGZyb20gJ0Bjb2RlbWlycm9yL2F1dG9jb21wbGV0ZSc7XG5pbXBvcnQgeyBkZWZhdWx0S2V5bWFwLCBoaXN0b3J5LCBoaXN0b3J5S2V5bWFwLCBpbmRlbnRXaXRoVGFiIH0gZnJvbSAnQGNvZGVtaXJyb3IvY29tbWFuZHMnO1xuaW1wb3J0IHtcbiAgSGlnaGxpZ2h0U3R5bGUsXG4gIGJyYWNrZXRNYXRjaGluZyxcbiAgZm9sZEd1dHRlcixcbiAgZm9sZEtleW1hcCxcbiAgaW5kZW50T25JbnB1dCxcbiAgc3ludGF4SGlnaGxpZ2h0aW5nXG59IGZyb20gJ0Bjb2RlbWlycm9yL2xhbmd1YWdlJztcbmltcG9ydCB7IGxpbnRLZXltYXAgfSBmcm9tICdAY29kZW1pcnJvci9saW50JztcbmltcG9ydCB7IGhpZ2hsaWdodFNlbGVjdGlvbk1hdGNoZXMsIHNlYXJjaEtleW1hcCB9IGZyb20gJ0Bjb2RlbWlycm9yL3NlYXJjaCc7XG5pbXBvcnQgeyBDb21wYXJ0bWVudCwgRWRpdG9yU3RhdGUsIEV4dGVuc2lvbiB9IGZyb20gJ0Bjb2RlbWlycm9yL3N0YXRlJztcbmltcG9ydCB7IEVkaXRvclZpZXcsIGRyb3BDdXJzb3IsIGtleW1hcCB9IGZyb20gJ0Bjb2RlbWlycm9yL3ZpZXcnO1xuaW1wb3J0IHsgdGFncyBhcyB0IH0gZnJvbSAnQGxlemVyL2hpZ2hsaWdodCc7XG5cbmltcG9ydCB7IHB5dGhvbiB9IGZyb20gJ0Bjb2RlbWlycm9yL2xhbmctcHl0aG9uJztcblxuY29uc3QgY29kZU1pcnJvckNvbmZpZyA9IHtcbiAgbmFtZTogJ29ic2lkaWFuJyxcbiAgZGFyazogZmFsc2UsXG4gIGJhY2tncm91bmQ6ICd2YXIoLS1iYWNrZ3JvdW5kLXByaW1hcnkpJyxcbiAgZm9yZWdyb3VuZDogJ3ZhcigtLXRleHQtbm9ybWFsKScsXG4gIHNlbGVjdGlvbjogJ3ZhcigtLXRleHQtc2VsZWN0aW9uKScsXG4gIGN1cnNvcjogJ3ZhcigtLXRleHQtbm9ybWFsKScsXG4gIGRyb3Bkb3duQmFja2dyb3VuZDogJ3ZhcigtLWJhY2tncm91bmQtcHJpbWFyeSknLFxuICBkcm9wZG93bkJvcmRlcjogJ3ZhcigtLWJhY2tncm91bmQtbW9kaWZpZXItYm9yZGVyKScsXG4gIGFjdGl2ZUxpbmU6ICd2YXIoLS1iYWNrZ3JvdW5kLXByaW1hcnkpJyxcbiAgbWF0Y2hpbmdCcmFja2V0OiAndmFyKC0tYmFja2dyb3VuZC1tb2RpZmllci1hY2NlbnQpJyxcbiAga2V5d29yZDogJyNkNzNhNDknLFxuICBzdG9yYWdlOiAnI2Q3M2E0OScsXG4gIHZhcmlhYmxlOiAndmFyKC0tdGV4dC1ub3JtYWwpJyxcbiAgcGFyYW1ldGVyOiAndmFyKC0tdGV4dC1hY2NlbnQtaG92ZXIpJyxcbiAgZnVuY3Rpb246ICd2YXIoLS10ZXh0LWFjY2VudC1ob3ZlciknLFxuICBzdHJpbmc6ICd2YXIoLS10ZXh0LWFjY2VudCknLFxuICBjb25zdGFudDogJ3ZhcigtLXRleHQtYWNjZW50LWhvdmVyKScsXG4gIHR5cGU6ICd2YXIoLS10ZXh0LWFjY2VudC1ob3ZlciknLFxuICBjbGFzczogJyM2ZjQyYzEnLFxuICBudW1iZXI6ICd2YXIoLS10ZXh0LWFjY2VudC1ob3ZlciknLFxuICBjb21tZW50OiAndmFyKC0tdGV4dC1mYWludCknLFxuICBpbnZhbGlkOiAndmFyKC0tdGV4dC1lcnJvciknLFxuICByZWdleHA6ICcjMDMyZjYyJ1xufTtcblxuY29uc3Qgb2JzaWRpYW5UaGVtZSA9IEVkaXRvclZpZXcudGhlbWUoXG4gIHtcbiAgICAnJic6IHtcbiAgICAgIGNvbG9yOiBjb2RlTWlycm9yQ29uZmlnLmZvcmVncm91bmQsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvZGVNaXJyb3JDb25maWcuYmFja2dyb3VuZFxuICAgIH0sXG5cbiAgICAnLmNtLWNvbnRlbnQnOiB7IGNhcmV0Q29sb3I6IGNvZGVNaXJyb3JDb25maWcuY3Vyc29yIH0sXG5cbiAgICAnJi5jbS1mb2N1c2VkIC5jbS1jdXJzb3InOiB7IGJvcmRlckxlZnRDb2xvcjogY29kZU1pcnJvckNvbmZpZy5jdXJzb3IgfSxcbiAgICAnJi5jbS1mb2N1c2VkIC5jbS1zZWxlY3Rpb25CYWNrZ3JvdW5kLCAuY20tc2VsZWN0aW9uQmFja2dyb3VuZCwgJiA6OnNlbGVjdGlvbic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogY29kZU1pcnJvckNvbmZpZy5zZWxlY3Rpb25cbiAgICB9LFxuXG4gICAgJy5jbS1wYW5lbHMnOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvZGVNaXJyb3JDb25maWcuZHJvcGRvd25CYWNrZ3JvdW5kLFxuICAgICAgY29sb3I6IGNvZGVNaXJyb3JDb25maWcuZm9yZWdyb3VuZFxuICAgIH0sXG4gICAgJy5jbS1wYW5lbHMuY20tcGFuZWxzLXRvcCc6IHsgYm9yZGVyQm90dG9tOiAnMnB4IHNvbGlkIGJsYWNrJyB9LFxuICAgICcuY20tcGFuZWxzLmNtLXBhbmVscy1ib3R0b20nOiB7IGJvcmRlclRvcDogJzJweCBzb2xpZCBibGFjaycgfSxcblxuICAgICcuY20tc2VhcmNoTWF0Y2gnOiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvZGVNaXJyb3JDb25maWcuZHJvcGRvd25CYWNrZ3JvdW5kLFxuICAgICAgb3V0bGluZTogYDFweCBzb2xpZCAke2NvZGVNaXJyb3JDb25maWcuZHJvcGRvd25Cb3JkZXJ9YFxuICAgIH0sXG4gICAgJy5jbS1zZWFyY2hNYXRjaC5jbS1zZWFyY2hNYXRjaC1zZWxlY3RlZCc6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogY29kZU1pcnJvckNvbmZpZy5zZWxlY3Rpb25cbiAgICB9LFxuXG4gICAgJy5jbS1hY3RpdmVMaW5lJzogeyBiYWNrZ3JvdW5kQ29sb3I6IGNvZGVNaXJyb3JDb25maWcuYWN0aXZlTGluZSB9LFxuICAgICcuY20tYWN0aXZlTGluZUd1dHRlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogY29kZU1pcnJvckNvbmZpZy5iYWNrZ3JvdW5kXG4gICAgfSxcbiAgICAnLmNtLXNlbGVjdGlvbk1hdGNoJzogeyBiYWNrZ3JvdW5kQ29sb3I6IGNvZGVNaXJyb3JDb25maWcuc2VsZWN0aW9uIH0sXG5cbiAgICAnLmNtLW1hdGNoaW5nQnJhY2tldCwgLmNtLW5vbm1hdGNoaW5nQnJhY2tldCc6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogY29kZU1pcnJvckNvbmZpZy5tYXRjaGluZ0JyYWNrZXQsXG4gICAgICBvdXRsaW5lOiAnbm9uZSdcbiAgICB9LFxuICAgICcuY20tZ3V0dGVycyc6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogY29kZU1pcnJvckNvbmZpZy5iYWNrZ3JvdW5kLFxuICAgICAgY29sb3I6IGNvZGVNaXJyb3JDb25maWcuY29tbWVudCxcbiAgICAgIGJvcmRlclJpZ2h0OiAnMXB4IHNvbGlkIHZhcigtLWJhY2tncm91bmQtbW9kaWZpZXItYm9yZGVyKSdcbiAgICB9LFxuICAgICcuY20tbGluZU51bWJlcnMsIC5jbS1ndXR0ZXJFbGVtZW50JzogeyBjb2xvcjogJ2luaGVyaXQnIH0sXG5cbiAgICAnLmNtLWZvbGRQbGFjZWhvbGRlcic6IHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJ3RyYW5zcGFyZW50JyxcbiAgICAgIGJvcmRlcjogJ25vbmUnLFxuICAgICAgY29sb3I6IGNvZGVNaXJyb3JDb25maWcuZm9yZWdyb3VuZFxuICAgIH0sXG5cbiAgICAnLmNtLXRvb2x0aXAnOiB7XG4gICAgICBib3JkZXI6IGAxcHggc29saWQgJHtjb2RlTWlycm9yQ29uZmlnLmRyb3Bkb3duQm9yZGVyfWAsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvZGVNaXJyb3JDb25maWcuZHJvcGRvd25CYWNrZ3JvdW5kLFxuICAgICAgY29sb3I6IGNvZGVNaXJyb3JDb25maWcuZm9yZWdyb3VuZFxuICAgIH0sXG4gICAgJy5jbS10b29sdGlwLmNtLXRvb2x0aXAtYXV0b2NvbXBsZXRlJzoge1xuICAgICAgJyYgPiB1bCA+IGxpW2FyaWEtc2VsZWN0ZWRdJzoge1xuICAgICAgICBiYWNrZ3JvdW5kOiBjb2RlTWlycm9yQ29uZmlnLnNlbGVjdGlvbixcbiAgICAgICAgY29sb3I6IGNvZGVNaXJyb3JDb25maWcuZm9yZWdyb3VuZFxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgeyBkYXJrOiBjb2RlTWlycm9yQ29uZmlnLmRhcmsgfVxuKTtcblxuY29uc3Qgb2JzaWRpYW5IaWdobGlnaHRTdHlsZSA9IEhpZ2hsaWdodFN0eWxlLmRlZmluZShbXG4gIHsgdGFnOiB0LmtleXdvcmQsIGNvbG9yOiBjb2RlTWlycm9yQ29uZmlnLmtleXdvcmQgfSxcbiAge1xuICAgIHRhZzogW3QubmFtZSwgdC5kZWxldGVkLCB0LmNoYXJhY3RlciwgdC5tYWNyb05hbWVdLFxuICAgIGNvbG9yOiBjb2RlTWlycm9yQ29uZmlnLnZhcmlhYmxlXG4gIH0sXG4gIHsgdGFnOiBbdC5wcm9wZXJ0eU5hbWVdLCBjb2xvcjogY29kZU1pcnJvckNvbmZpZy5mdW5jdGlvbiB9LFxuICB7XG4gICAgdGFnOiBbdC5wcm9jZXNzaW5nSW5zdHJ1Y3Rpb24sIHQuc3RyaW5nLCB0Lmluc2VydGVkLCB0LnNwZWNpYWwodC5zdHJpbmcpXSxcbiAgICBjb2xvcjogY29kZU1pcnJvckNvbmZpZy5zdHJpbmdcbiAgfSxcbiAge1xuICAgIHRhZzogW3QuZnVuY3Rpb24odC52YXJpYWJsZU5hbWUpLCB0LmxhYmVsTmFtZV0sXG4gICAgY29sb3I6IGNvZGVNaXJyb3JDb25maWcuZnVuY3Rpb25cbiAgfSxcbiAge1xuICAgIHRhZzogW3QuY29sb3IsIHQuY29uc3RhbnQodC5uYW1lKSwgdC5zdGFuZGFyZCh0Lm5hbWUpXSxcbiAgICBjb2xvcjogY29kZU1pcnJvckNvbmZpZy5jb25zdGFudFxuICB9LFxuICB7XG4gICAgdGFnOiBbdC5kZWZpbml0aW9uKHQubmFtZSksIHQuc2VwYXJhdG9yXSxcbiAgICBjb2xvcjogY29kZU1pcnJvckNvbmZpZy52YXJpYWJsZVxuICB9LFxuICB7IHRhZzogW3QuY2xhc3NOYW1lXSwgY29sb3I6IGNvZGVNaXJyb3JDb25maWcuY2xhc3MgfSxcbiAge1xuICAgIHRhZzogW3QubnVtYmVyLCB0LmNoYW5nZWQsIHQuYW5ub3RhdGlvbiwgdC5tb2RpZmllciwgdC5zZWxmLCB0Lm5hbWVzcGFjZV0sXG4gICAgY29sb3I6IGNvZGVNaXJyb3JDb25maWcubnVtYmVyXG4gIH0sXG4gIHtcbiAgICB0YWc6IFt0LnR5cGVOYW1lXSxcbiAgICBjb2xvcjogY29kZU1pcnJvckNvbmZpZy50eXBlLFxuICAgIGZvbnRTdHlsZTogY29kZU1pcnJvckNvbmZpZy50eXBlXG4gIH0sXG4gIHsgdGFnOiBbdC5vcGVyYXRvciwgdC5vcGVyYXRvcktleXdvcmRdLCBjb2xvcjogY29kZU1pcnJvckNvbmZpZy5rZXl3b3JkIH0sXG4gIHtcbiAgICB0YWc6IFt0LnVybCwgdC5lc2NhcGUsIHQucmVnZXhwLCB0LmxpbmtdLFxuICAgIGNvbG9yOiBjb2RlTWlycm9yQ29uZmlnLnJlZ2V4cFxuICB9LFxuICB7IHRhZzogW3QubWV0YSwgdC5jb21tZW50XSwgY29sb3I6IGNvZGVNaXJyb3JDb25maWcuY29tbWVudCB9LFxuICB7XG4gICAgdGFnOiBbdC5hdG9tLCB0LmJvb2wsIHQuc3BlY2lhbCh0LnZhcmlhYmxlTmFtZSldLFxuICAgIGNvbG9yOiBjb2RlTWlycm9yQ29uZmlnLnZhcmlhYmxlXG4gIH0sXG4gIHsgdGFnOiB0LmludmFsaWQsIGNvbG9yOiBjb2RlTWlycm9yQ29uZmlnLmludmFsaWQgfVxuXSk7XG5cbmV4cG9ydCBjb25zdCBiYXNpY0V4dGVuc2lvbnM6IEV4dGVuc2lvbltdID0gW1xuICBoaXN0b3J5KCksXG4gIGZvbGRHdXR0ZXIoKSxcbiAgZHJvcEN1cnNvcigpLFxuICBFZGl0b3JTdGF0ZS5hbGxvd011bHRpcGxlU2VsZWN0aW9ucy5vZih0cnVlKSxcbiAgaW5kZW50T25JbnB1dCgpLFxuICBFZGl0b3JWaWV3LmxpbmVXcmFwcGluZyxcbiAgYnJhY2tldE1hdGNoaW5nKCksXG4gIGNsb3NlQnJhY2tldHMoKSxcbiAgaGlnaGxpZ2h0U2VsZWN0aW9uTWF0Y2hlcygpLFxuICBvYnNpZGlhblRoZW1lLFxuICBzeW50YXhIaWdobGlnaHRpbmcob2JzaWRpYW5IaWdobGlnaHRTdHlsZSksXG4gIGtleW1hcC5vZihbXG4gICAgLi4uY2xvc2VCcmFja2V0c0tleW1hcCxcbiAgICAuLi5kZWZhdWx0S2V5bWFwLFxuICAgIC4uLnNlYXJjaEtleW1hcCxcbiAgICAuLi5oaXN0b3J5S2V5bWFwLFxuICAgIGluZGVudFdpdGhUYWIsXG4gICAgLi4uZm9sZEtleW1hcCxcbiAgICAuLi5jb21wbGV0aW9uS2V5bWFwLFxuICAgIC4uLmxpbnRLZXltYXBcbiAgXSlcbl07XG5cbi8vIFRPRE86IERvIEkgbmVlZCB0byB1c2UgY29tcGFydG1lbnRzLCBvciBpcyB0aGVyZSBhIGJldHRlciB3YXk/XG5jb25zdCBsYW5ndWFnZSA9IG5ldyBDb21wYXJ0bWVudCgpO1xuXG4vLyBUT0RPOiBTZXQgZGVmYXVsdCB0byBzb21ldGhpbmcgbW9yZSBzYW5lLCBldmVuIHRob3VnaCBpdCBkb2Vzbid0IHRlY2huaWNhbGx5IG1hdHRlciBvbmNlIGV2ZXJ5dGhpbmcgd29ya3NcbmV4cG9ydCBjb25zdCBsYW5ndWFnZUV4dGVuc2lvbjogRXh0ZW5zaW9uW10gPSBbbGFuZ3VhZ2Uub2YocHl0aG9uKCkpXTtcblxuLy8gVE9ETzogQWRkIGFsbCBsYW5ndWFnZXMgdGhhdCB0aGUgcGx1Z2luIHNob3VsZCBzdXBwb3J0XG5jb25zdCBMQU5HVUFHRVM6IE1hcDxzdHJpbmcsIEV4dGVuc2lvbj4gPSBuZXcgTWFwKFtbJ3B5JywgcHl0aG9uKCldXSk7XG5cbi8vIFRPRE86IFRoaXMgY3VycmVudGx5IGRvZXMgbm90IHdvcmsuXG5leHBvcnQgY29uc3QgdXBkYXRlTGFuZ3VhZ2UgPSAodmlldzogRWRpdG9yVmlldywgZXh0OiBzdHJpbmcpID0+IHtcbiAgY29uc3QgTEFORyA9IExBTkdVQUdFUy5nZXQoZXh0KTtcbiAgaWYgKExBTkcpIHtcbiAgICAvLyBOb3RlOiB0aGlzIF9kb2VzXyBnZXQgcnVuLCBidXQgSSdtIG5vdCBzdXJlIGhvdyB0aGUgZGlzcGF0Y2ggd29ya3MuXG4gICAgdmlldy5kaXNwYXRjaCh7XG4gICAgICBlZmZlY3RzOiBsYW5ndWFnZS5yZWNvbmZpZ3VyZShMQU5HKVxuICAgIH0pO1xuICB9XG59O1xuIl19