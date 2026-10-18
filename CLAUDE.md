# CLAUDE.md

Guidance for Claude Code (and other AI assistants) working in this repository. For general
contribution rules, read `CONTRIBUTING.md` first.

## Translations (i18n)

### How messages work

- UI text is defined as messages in `l10n/messageIds.ts` modules, e.g.
  `src/features/surveys/l10n/messageIds.ts` and `src/zui/l10n/messageIds.ts`, using
  `makeMessages('feat.callAssignments', { ... })` with `m('English text')` or
  `m<{ count: number }>('{count, plural, ...}')`. The message ID is the prefix plus the object
  path, e.g. `feat.callAssignments.targets.title`.
- The `messageIds.ts` files are the source of truth for which keys exist and for the English text,
  unless `src/locale/en.yml` has an entry for the key: then the `en.yml` text overrides the
  `messageIds.ts` text.
- Translations live in `src/locale/<lang>.yml`. The supported languages are listed in
  `src/core/i18n/languages.ts` (`en`, `da`, `sv`, `de`, `nn`, `nl`). When the UI is rendered, a
  string is looked up in `<lang>.yml` first, then in `en.yml`, and only then the `messageIds.ts`
  default is used (`src/utils/locale.ts`, `src/core/i18n/server.ts`). So `en.yml` is also the
  fallback for keys a language hasn't translated.
- `src/locale/en.yml` is generated with `npm run make-yaml`; never edit it by hand. It can lag
  behind `messageIds.ts`: keys can be missing, and old text can still override newer
  `messageIds.ts` text. Compare both before deciding which keys exist or what the English says.
- The usual way to translate is [Lyra](https://lyra.zetkin.org), which writes the locale files
  (see `CONTRIBUTING.md`, section 4). Translating with Claude means editing
  `src/locale/<lang>.yml` directly. Keep those PRs limited to the locale file, and coordinate
  with the maintainers so Lyra and direct edits don't overwrite each other.
- `nn` is Norwegian Nynorsk, but the MUI component locales for it are Bokmål (`nbNO` in
  `src/theme.ts` and `src/zui/theme/index.ts`).

### Format rules

- Messages use ICU MessageFormat. Keep every placeholder (`{name}`), every plural/select
  variable and case key (`=0`, `one`, `other`, select values) and `#` exactly as in the English.
  Translate only the text inside the branches, and do translate it: English left inside plural
  branches (`{n, plural, one {# hour} other {# hours}}`) is a common bug.
- Some placeholders are rendered React elements (bold numbers, links). Words around them cannot
  be inflected, and in flex layouts the space next to them can disappear (Dutch once rendered as
  "Voor5 personen"). Check the component when a placeholder sits mid-sentence; starting the
  sentence with the placeholder often avoids the problem.
- If the English is empty (`m('')`), don't invent a translation.
- Don't fix English text as part of translation work. Report English bugs separately (changing
  English means editing `messageIds.ts` and removing the old entries from the YAML files, see
  `CONTRIBUTING.md`).
- Edit values in place and keep the existing key order (alphabetical within each map). Don't
  re-serialize the whole file with a YAML library: it re-wraps long lines and makes noisy diffs.
  Follow the existing style: single quotes when a value needs quoting, and no invisible
  characters (zero-width spaces, non-breaking spaces).

### Checks

- `npm run lint:translations` is the check for locale files. It also runs in the pre-commit
  hook for staged `src/locale/*.yml` files. Add `-- --print-warnings` to list missing keys per
  locale.
- ESLint and Prettier ignore `src/locale/*` (`ignorePatterns` in `.eslintrc.js`,
  `.prettierignore`), so the YAML lint rules in `.eslintrc.js` don't apply to these files.
- The pre-commit hook runs `npx lint-staged && npm run check-types`, so `npm install` must have
  been run before committing.
- Before committing, also compare every changed message's placeholders with the English, and
  check the diff to be sure untouched entries didn't change.

### Translating missing keys

1. Build the full key list from the `messageIds.ts` files (or a fresh `npm run make-yaml`) and
   diff it against the locale file.
2. Use the language's existing translations as a glossary so terms stay consistent, and follow
   the language rules below.
3. Insert the new keys in alphabetical position, then run the checks above.

### Adding a new language

Register the new language code in all of these places:

- `src/locale/<code>.yml` with the translations.
- `SUPPORTED_LANGUAGES` in `src/core/i18n/languages.ts`.
- The `languages` list in `.lyra.yaml`, so that Lyra also handles the new language.
- `languageOptions` in `src/features/my/components/AppPreferences.tsx`, which holds the name
  shown in the language picker (TypeScript requires an entry for every supported language). The
  server must support the language too before users can pick it; Dutch is filtered out of that
  picker for this reason.
- The MUI locale maps in `src/theme.ts` and `src/zui/theme/index.ts`, if MUI has the language.
  Without an entry, built-in component text (date pickers, data grid) stays in English; Dutch
  has no entry today.
- Optionally, the dayjs locale import and date-picker texts in
  `src/zui/components/utils/LocaleSwitcher.tsx`, which is only used in Storybook.

### Reviewing existing translations

Strings translated without context are often wrong for the screen they appear on. For each key:

- Compare it with the English in `messageIds.ts` (not a stale `en.yml`) and with the other
  languages.
- Find where it is used: search for the path after the module name, e.g.
  `messageIds.targets.title`, `messages.targets.title()` or
  `<Msg id={messageIds.targets.title} />`. Watch for dynamic access
  (`messages.filters[type]`) and references split over two lines. Confirm with a direct search
  before treating a key as unused; about 2% of keys are not used anywhere.
- Count as mistakes: English left in (including inside plural branches); wrong meaning in
  context (a noun where a button needs a verb, an imperative used as a status, a dropped
  negation); outdated text (the English changed since translation); spelling and grammar
  errors; broken placeholders; a UI element named differently from its real label; invisible
  characters.
- Don't count: style preferences, punctuation-only differences that don't break the text,
  unused keys, and terms that need one decision for the whole file. Ask the maintainers about
  those instead of changing them piecemeal.

The Dutch review was done in batches: go through `nl.yml` in file order, stop after a fixed
number of real mistakes, and use one branch and PR per batch.

### Pull requests

In the PR template's "AI usage" section, state that the translations or corrections were made
by Claude, and whether a native speaker has reviewed them.

### Language rules

#### Dutch (`nl`)

Set by the project's Dutch reviewer. Follow these strictly:

- Keep "organizer" untranslated, never "organisator".
- "target group" is always "target-groep", never "doelgroep" (which has a second meaning).
- "Smart Search" is a brand name and is never translated (not "Slim Zoeken"). In compounds use
  a hyphen: "Smart Search-opdracht".
- Plural hours: `{n, plural, one {1 uur} other {# uren}}`.

Conventions used in the reviewed parts of `nl.yml`:

- Informal "je". Compounds are written as one word ("belopdracht", "einddatum",
  "evenementpagina") or with a hyphen where Dutch requires it ("e-mailadres", "ID-kolom",
  "massa-e-mails").
- call assignment → belopdracht; caller → beller; survey → vragenlijst; survey submission →
  inzending; journey(s) → traject(en); join form → aanmeldformulier; milestone → mijlpaal.
  "targets" and "shift(s)" stay as loanwords; e-mail is spelled "e-mail".
- Not decided yet, so keep the existing wording: "gebeurtenis" vs "event"/"evenement", "kopieën"
  vs "duplicaten" for duplicates, the name for draft ("Voorlopige versie"/"Concept"), and the
  email targets title "Doelen".

Status (October 2026): batches 1–4 reviewed `nl.yml` in file order up to and including
`feat.journeys.instance.deadlineLabel`. Continue from the next key.
