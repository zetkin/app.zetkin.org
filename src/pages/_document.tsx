import type { JSX } from 'react';
import Document, { Head, Html, Main, NextScript } from 'next/document';

import oldTheme from '../theme';

// boilerplate page taken from https://github.com/mui-org/material-ui/tree/master/examples/nextjs

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en" style={{ overscrollBehaviorX: 'none' }}>
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
