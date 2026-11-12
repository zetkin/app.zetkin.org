import Document, {
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';

import { getBrowserLanguage } from 'utils/locale';
import { ZetkinUser } from 'utils/types/zetkin';
import BackendApiClient from 'core/api/client/BackendApiClient';
import oldTheme from '../theme';

// boilerplate page taken from https://github.com/mui-org/material-ui/tree/master/examples/nextjs

interface ExtendedDocumentProps extends DocumentInitialProps {
  lang: string;
  nonce?: string;
}

export default class MyDocument extends Document<ExtendedDocumentProps> {
  render(): JSX.Element {
    const { nonce } = this.props;
    if (typeof nonce === 'undefined') {
      throw new Error('nonce undefined in document renderer');
    }

    return (
      <Html lang={this.props.lang} style={{ overscrollBehaviorX: 'none' }}>
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
    ...initialProps,
    lang,
    nonce,
  };
};
