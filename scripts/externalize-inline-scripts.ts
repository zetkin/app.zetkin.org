/* eslint-disable no-console */
import fs from 'fs/promises';
import path from 'path';

/**
 * Moves inline <script> tags in statically built HTML into sibling files, so
 * that they can be served under `script-src 'self'` without a nonce. See
 * setupStaticSiteCsp() in src/middleware.ts.
 *
 * Usage: ts-node scripts/externalize-inline-scripts.ts <dir> [<dir> ...]
 */

const QUOTE_AWARE_ATTRIBUTES = `(?:"[^"]*"|'[^']*'|[^>"'])*`;
const RAW_TEXT_UNTIL_CLOSING_TAG = `[\\s\\S]*?`;
const ATTRIBUTE_VALUE = `("([^"]*)"|'([^']*)'|([^\\s"'>]+))`;

const SCRIPT_TAG = new RegExp(
  `<script(${QUOTE_AWARE_ATTRIBUTES})>(${RAW_TEXT_UNTIL_CLOSING_TAG})</script>`,
  'gi'
);
const SRC_ATTRIBUTE = new RegExp(`\\bsrc\\s*=\\s*${ATTRIBUTE_VALUE}`, 'i');
const TYPE_ATTRIBUTE = new RegExp(`\\btype\\s*=\\s*${ATTRIBUTE_VALUE}`, 'i');

const JAVASCRIPT_MIME_TYPES = [
  'application/ecmascript',
  'application/javascript',
  'module',
  'text/ecmascript',
  'text/javascript',
];

run();

async function run() {
  const dirs = process.argv.slice(2);

  if (!dirs.length) {
    console.error(
      'Usage: ts-node scripts/externalize-inline-scripts.ts <dir> [<dir> ...]'
    );
    process.exit(1);
  }

  let total = 0;

  for (const dir of dirs) {
    const stat = await fs.stat(dir).catch(() => null);

    if (!stat?.isDirectory()) {
      console.error(`ERR: not a directory: ${dir}`);
      process.exit(1);
    }

    for await (const htmlFilePath of findHtmlFiles(dir)) {
      total += await externalizeInlineScripts(htmlFilePath);
    }
  }

  console.log(`Externalized ${total} inline script(s).`);
}

async function externalizeInlineScripts(htmlFilePath: string): Promise<number> {
  const html = await fs.readFile(htmlFilePath, 'utf-8');
  const siblingDir = path.dirname(htmlFilePath);
  const prefix = `csp-inline-${path.basename(htmlFilePath, '.html')}`;

  const scripts: { content: string; siblingFileName: string }[] = [];

  const rewritten = html.replace(
    SCRIPT_TAG,
    (tag: string, attrs: string, content: string) => {
      const isInlineJavaScript =
        !SRC_ATTRIBUTE.test(attrs) && isJavaScript(attrs) && !!content.trim();

      if (!isInlineJavaScript) {
        return tag;
      }

      const siblingFileName = `${prefix}-${scripts.length}.js`;
      scripts.push({ content, siblingFileName });

      return `<script${attrs} src="./${siblingFileName}"></script>`;
    }
  );

  if (!scripts.length) {
    return 0;
  }

  await Promise.all(
    scripts.map((script) =>
      fs.writeFile(
        path.join(siblingDir, script.siblingFileName),
        script.content
      )
    )
  );
  await fs.writeFile(htmlFilePath, rewritten);

  console.log(
    `${htmlFilePath}: externalized ${scripts.length} inline script(s)`
  );

  return scripts.length;
}

function isJavaScript(attrs: string): boolean {
  const match = attrs.match(TYPE_ATTRIBUTE);
  const declaredType = (match?.[2] ?? match?.[3] ?? match?.[4] ?? '')
    .trim()
    .toLowerCase();
  const typeDefaultsToJavaScript = !declaredType;

  return (
    typeDefaultsToJavaScript || JAVASCRIPT_MIME_TYPES.includes(declaredType)
  );
}

async function* findHtmlFiles(dir: string): AsyncIterable<string> {
  const dirEnts = await fs.readdir(dir, { withFileTypes: true });
  for (const dirEnt of dirEnts) {
    const res = path.resolve(dir, dirEnt.name);
    if (dirEnt.isDirectory()) {
      yield* findHtmlFiles(res);
    } else if (res.endsWith('.html')) {
      yield res;
    }
  }
}
