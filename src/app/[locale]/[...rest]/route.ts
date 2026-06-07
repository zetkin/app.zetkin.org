import { getMessages } from 'next-intl/server';
import { NextResponse } from 'next/server';

type Props = {
  params: {
    locale: string;
  };
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET(_request: Request, { params }: Props) {
  const messages = (await getMessages({
    locale: params.locale,
  })) as Record<string, unknown>;
  const coreMessages = messages.core as {
    err404: {
      backToHomePage: string;
      pageNotFound: string;
    };
  };

  const body = `<!doctype html>
<html lang="${escapeHtml(params.locale)}">
  <body>
    <main>
      <h1>404</h1>
      <p>${escapeHtml(coreMessages.err404.pageNotFound)}</p>
      <a href="/">${escapeHtml(coreMessages.err404.backToHomePage)}</a>
    </main>
  </body>
</html>`;

  return new NextResponse(body, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
    },
    status: 404,
  });
}
