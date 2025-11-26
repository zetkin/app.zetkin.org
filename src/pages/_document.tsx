/* eslint-disable @next/next/no-sync-scripts */
import Document, {
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheets } from '@mui/styles';
import { Children } from 'react';

import oldTheme from '../theme';

// boilerplate page taken from https://github.com/mui-org/material-ui/tree/master/examples/nextjs

interface ExtendedDocumentProps extends DocumentInitialProps {
  nonce?: string;
}

export default class MyDocument extends Document<ExtendedDocumentProps> {
  render(): JSX.Element {
    const { nonce } = this.props;
    if (typeof nonce === 'undefined') {
      throw new Error('nonce undefined in document renderer');
    }

    return (
      <Html lang="en" style={{ overscrollBehaviorX: 'none' }}>
        <Head nonce={nonce}>
          {/* PWA primary color */}
          <meta content={oldTheme.palette.primary.main} name="theme-color" />
          <link href="https://use.typekit.net/tqq3ylv.css" rel="stylesheet" />
          <link href="/logo-zetkin.png" rel="shortcut icon" />
          <meta content={nonce} name="csp-nonce" />
        </Head>
        <body style={{ overscrollBehaviorX: 'none' }}>
          <Main />
          <NextScript nonce={nonce} />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  const nonce = ctx.req?.headers?.['x-nonce'] as string | undefined;
  if (typeof nonce === 'undefined') {
    throw new Error('nonce undefined in document initial props generation');
  }

  const sheets = new ServerStyleSheets({
    nonce: nonce,
  });
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) =>
        sheets.collect(<App {...props} />, {
          nonce: nonce,
        }),
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    nonce,
    styles: [
      ...Children.toArray(initialProps.styles),
      sheets.getStyleElement({
        nonce: nonce,
      }),
    ],
  };
};
