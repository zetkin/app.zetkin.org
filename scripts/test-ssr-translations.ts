/**
 * Fast SSR translation test with mocked API.
 *
 * Starts a mock API server + production Next.js server and verifies
 * that public pages render with correct translations per Accept-Language.
 *
 * Usage: npx tsx scripts/test-ssr-translations.ts
 * Requires: npm run build first
 */

import http from 'http';

const APP_PORT = 3199;
const API_PORT = 3198;
const BASE = `http://localhost:${APP_PORT}`;

// Mock API: returns 401 for auth, empty arrays for everything else
function startMockApi(): Promise<http.Server> {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = req.url || '';

      if (url.includes('/users/me') || url.includes('/session')) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unauthorized' }));
        return;
      }

      // Return empty data for any other API call
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: [] }));
    });

    server.listen(API_PORT, () => resolve(server));
  });
}

// Expected translations per locale (from compiled YAML)
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    backToHomePage: 'Back to home page',
    pageNotFound: 'Page not found',
  },
  sv: {
    backToHomePage: 'Tillbaka till startsidan',
    pageNotFound: 'Sidan hittades inte',
  },
  de: {
    backToHomePage: 'zurück zur Startseite',
    pageNotFound: 'Seite nicht gefunden',
  },
  da: {
    backToHomePage: 'Tilbage til forsiden',
    pageNotFound: 'Siden kan ikke findes',
  },
  nn: {
    backToHomePage: 'Tilbake til startsiden',
    pageNotFound: 'Fant ikke siden',
  },
};

async function fetchPage(path: string, lang: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = http.get(
      `${BASE}${path}`,
      { headers: { 'Accept-Language': lang, Cookie: '' } },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(data));
      }
    );
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${path} with lang=${lang}`));
    });
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ ${name}`);
      passed++;
    } else {
      console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`);
      failed++;
    }
  }

  // Start mock API
  console.log('Starting mock API server...');
  const apiServer = await startMockApi();

  // Configure Next.js to use mock API
  process.env.ZETKIN_API_HOST = 'localhost';
  process.env.ZETKIN_API_PORT = String(API_PORT);
  process.env.ZETKIN_USE_TLS = 'false';
  process.env.ZETKIN_API_DOMAIN = 'localhost';

  // Start Next.js production server
  console.log('Starting Next.js server...');
  const next = await import('next');
  const app = next.default({ dev: false, dir: process.cwd() });
  await app.prepare();
  const handle = app.getRequestHandler();

  const { parse } = await import('url');
  const appServer = http.createServer((req, res) => {
    const parsedUrl = parse(req.url || '/', true);
    handle(req, res, parsedUrl);
  });

  await new Promise<void>((resolve) => appServer.listen(APP_PORT, resolve));
  console.log(`Servers ready (app: ${APP_PORT}, api: ${API_PORT})\n`);

  // Test: Each locale gets correct translations
  console.log('Test: SSR translations per locale on /lost-password');
  for (const [lang, expected] of Object.entries(TRANSLATIONS)) {
    const html = await fetchPage('/lost-password', lang);
    for (const [key, text] of Object.entries(expected)) {
      assert(html.includes(text), `${lang}: "${text}" in HTML`, key);
    }
  }

  // Test: html lang attribute matches locale
  console.log('\nTest: html lang attribute on /register');
  for (const lang of ['en', 'sv', 'de', 'da', 'nn']) {
    const html = await fetchPage('/register', lang);
    const langMatch = html.match(/lang="([^"]+)"/);
    assert(
      langMatch?.[1] === lang,
      `lang="${lang}"`,
      `got "${langMatch?.[1]}"`
    );
  }

  // Test: No locale prefix in URLs
  console.log('\nTest: No locale prefix in rendered HTML');
  const svHtml = await fetchPage('/lost-password', 'sv');
  assert(!svHtml.includes('"/sv/'), 'No /sv/ links in Swedish page');

  // Test: Response size is reasonable
  console.log('\nTest: Response size');
  const enPage = await fetchPage('/lost-password', 'en');
  const pageSize = Buffer.byteLength(enPage);
  // Log the size for monitoring. Currently ~148KB because the root layout
  // passes all messages to NextIntlClientProvider. A future optimization
  // would filter messages per page/section.
  console.log(`  ℹ Response size: ${(pageSize / 1024).toFixed(1)}KB`);
  assert(
    pageSize < 80 * 1024,
    `Response < 80KB (got ${(pageSize / 1024).toFixed(1)}KB)`
  );

  // Summary
  console.log(`\n${passed} passed, ${failed} failed`);

  appServer.close();
  apiServer.close();
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
