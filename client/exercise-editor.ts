// Replaces the plain textareas in the exercise create/edit form with
// CodeMirror 6 editors that highlight Markdown — including per-language
// syntax highlighting of embedded fenced code blocks (```python … ```).
//
// Bundled to `public/js/exercise-editor.js` via `bun build` (see the
// `build` target in the makefile and the Dockerfile).

import { EditorView, keymap, drawSelection } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands"
import {
  bracketMatching,
  defaultHighlightStyle,
  HighlightStyle,
  indentOnInput,
  LanguageDescription,
  syntaxHighlighting,
} from "@codemirror/language"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { languages } from "@codemirror/language-data"
import { tags } from "@lezer/highlight"

// `defaultHighlightStyle` doesn't color the `monospace` tag, which the
// Markdown grammar assigns to inline code (`like this`) and the body of
// fenced blocks without a recognized language. Give it a distinct color so
// inline code stands out from prose.
const markdownHighlightStyle = HighlightStyle.define([
  { tag: tags.monospace, color: "#6a737d" },
])

// Resolves a fenced block's info string to a language. The default
// `codeLanguages` array only matches a language's name/aliases, so e.g.
// ```hs or ```py wouldn't highlight. Fall back to matching file extensions
// (Haskell → "hs", Python → "py", Rust → "rs", …).
function findCodeLanguage(info: string): LanguageDescription | null {
  const name = info.toLowerCase()
  if (!name) return null
  return (
    LanguageDescription.matchLanguageName(languages, name, true) ??
    languages.find((lang) => lang.extensions.includes(name)) ??
    null
  )
}

// Bootstrap-flavoured look so the editor matches the form's other controls.
const theme = EditorView.theme({
  "&": {
    fontSize: "0.9rem",
    color: "#24292e",
    backgroundColor: "#fff",
    border: "1px solid #ced4da",
    borderRadius: "0.375rem",
  },
  "&.cm-focused": {
    outline: "none",
    borderColor: "#86b7fe",
    boxShadow: "0 0 0 0.25rem rgba(13, 110, 253, 0.25)",
  },
  ".cm-content": {
    fontFamily: "var(--bs-font-monospace, monospace)",
    padding: "0.5rem 0",
  },
  ".cm-line": { padding: "0 0.75rem" },
  ".cm-scroller": { lineHeight: "1.5" },
})

function enhance(textarea: HTMLTextAreaElement) {
  const rows = Number(textarea.getAttribute("rows")) || 3
  const minHeight = `${rows * 1.5 + 1}em`

  const view = new EditorView({
    state: EditorState.create({
      doc: textarea.value,
      extensions: [
        history(),
        drawSelection(),
        indentOnInput(),
        bracketMatching(),
        EditorView.lineWrapping,
        // Both must be non-fallback: a fallback highlighter is dropped
        // entirely once any non-fallback one is present, so they have to
        // share the main highlighter facet to combine.
        syntaxHighlighting(defaultHighlightStyle),
        syntaxHighlighting(markdownHighlightStyle),
        markdown({ base: markdownLanguage, codeLanguages: findCodeLanguage }),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        theme,
        EditorView.theme({ ".cm-content": { minHeight } }),
        // Mirror edits back into the hidden textarea so the form still submits
        // its value (and the "Add another" submit button keeps working).
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            textarea.value = update.state.doc.toString()
          }
        }),
      ],
    }),
  })

  textarea.style.display = "none"
  textarea.setAttribute("aria-hidden", "true")
  textarea.parentNode?.insertBefore(view.dom, textarea)
}

const textareas =
  document.querySelectorAll<HTMLTextAreaElement>("form textarea.form-control")
textareas.forEach(enhance)
