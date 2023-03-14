/* eslint-disable @next/next/no-sync-scripts */
import { Children } from 'react';
import ServerStyleSheets from '@mui/styles/ServerStyleSheets';
import theme from '../theme';
import Document, { Head, Html, Main, NextScript } from 'next/document';

// boilerplate page taken from https://github.com/mui-org/material-ui/tree/master/examples/nextjs

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en" style={{ overscrollBehaviorX: 'none' }}>
        <Head>
          {/* PWA primary color */}
          <meta content={theme.palette.primary.main} name="theme-color" />
          <script src="https://use.typekit.net/tqq3ylv.js" />
          <script>{'try{Typekit.load({ async: true })}catch(e){}'}</script>
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

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    styles: [
      ...Children.toArray(initialProps.styles),
      sheets.getStyleElement(),
    ],
  };
};
