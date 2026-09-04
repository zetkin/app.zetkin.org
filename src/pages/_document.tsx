/* eslint-disable @next/next/no-sync-scripts */
import { Children } from 'react';
import ServerStyleSheets from '@mui/styles/ServerStyleSheets';
import Document, { Head, Html, Main, NextScript } from 'next/document';

import { getBrowserLanguage } from 'utils/locale';
import { ZetkinUser } from 'utils/types/zetkin';
import BackendApiClient from 'core/api/client/BackendApiClient';
import oldTheme from '../theme';

// boilerplate page taken from https://github.com/mui-org/material-ui/tree/master/examples/nextjs

interface MyDocumentProps {
  lang: string;
}

export default class MyDocument extends Document<MyDocumentProps> {
  render(): JSX.Element {
    return (
      <Html lang={this.props.lang} style={{ overscrollBehaviorX: 'none' }}>
        <Head>
          {/* PWA primary color */}
          <meta content={oldTheme.palette.primary.main} name="theme-color" />
          <link href="https://use.typekit.net/tqq3ylv.css" rel="stylesheet" />
          <link href="/logo-zetkin.png" rel="shortcut icon" />
        </Head>
        <body style={{ overscrollBehaviorX: 'none' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    });

  const headersObject = {
    'accept-language': ctx.req?.headers['accept-language'] || '',
    cookie: ctx.req?.headers.cookie || '',
  };
  const apiClient = new BackendApiClient(headersObject);

  let user: ZetkinUser | null = null;

  try {
    user = await apiClient.get<ZetkinUser>('/api/users/me');
  } catch (e) {
    user = null;
  }

  const lang =
    user?.lang || getBrowserLanguage(ctx.req?.headers['accept-language'] || '');

  const initialProps = await Document.getInitialProps(ctx);

  return {
    lang,
    ...initialProps,
    styles: [
      ...Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
