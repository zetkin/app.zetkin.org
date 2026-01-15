import '../styles.css';

import App, { AppContext, AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import { LicenseInfo } from '@mui/x-data-grid-pro';
import { NoSsr } from '@mui/base';
import NProgress from 'nprogress';
import Router from 'next/router';
import { Theme } from '@mui/material/styles';
import { useEffect } from 'react';

import { store } from 'core/store';
import BrowserApiClient from 'core/api/client/BrowserApiClient';
import Environment from 'core/env/Environment';
import { PageWithLayout } from '../utils/types';
import Providers from 'core/Providers';
import { getNonce } from 'core/utils/getNonce';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface DefaultTheme extends Theme {}
}

// Progress bar
NProgress.configure({ showSpinner: false });
Router.events.on(
  'routeChangeStart',
  (url, { shallow }) => !shallow && NProgress.start()
);
Router.events.on(
  'routeChangeComplete',
  (url, { shallow }) => !shallow && NProgress.done()
);
Router.events.on(
  'routeChangeError',
  (url, { shallow }) => !shallow && NProgress.done()
);

declare global {
  interface Window {
    __reactRendered: boolean;
  }
}

function MyApp({
  Component,
  pageProps,
  nonce,
}: AppProps & { nonce: string }): JSX.Element {
  const { envVars, lang, messages, ...restProps } = pageProps;
  const c = Component as PageWithLayout;
  const getLayout = c.getLayout || ((page) => page);

  if (typeof window !== 'undefined') {
    window.__reactRendered = true;
  }

  if (typeof nonce === 'undefined') {
    throw new Error(`nonce undefined in app renderer`);
  }

  const env = new Environment(new BrowserApiClient(), envVars || {});

  // MUI-X license
  if (env.vars.MUIX_LICENSE_KEY) {
    LicenseInfo.setLicenseKey(env.vars.MUIX_LICENSE_KEY);
  }

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <Providers
      env={env}
      lang={lang}
      messages={messages}
      nonce={nonce}
      store={store}
      user={pageProps.user}
    >
      <CssBaseline />
      <NoSsr>{getLayout(<Component {...restProps} />, restProps)}</NoSsr>
    </Providers>
  );
}

MyApp.getInitialProps = async (appCtx: AppContext) => {
  const appProps = await App.getInitialProps(appCtx);
  const nonce = getNonce(appCtx.ctx?.req?.headers);
  if (typeof nonce === 'undefined') {
    throw new Error('nonce undefined in initial app props generation');
  }

  return { ...appProps, nonce };
};

export default MyApp;
