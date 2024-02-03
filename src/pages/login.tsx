import { GetServerSideProps } from 'next';

import { stringToBool } from '../utils/stringUtils';

//TODO: Create module definition and revert to import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Z = require('zetkin');

export const getServerSideProps: GetServerSideProps = async (context) => {
  const z = Z.construct({
    clientId: process.env.ZETKIN_CLIENT_ID,
    clientSecret: process.env.ZETKIN_CLIENT_SECRET,
    ssl: stringToBool(process.env.ZETKIN_USE_TLS),
    zetkinDomain: process.env.ZETKIN_API_DOMAIN,
  });

  const protocol = stringToBool(process.env.ZETKIN_USE_TLS) ? 'https' : 'http';
  const host = process.env.ZETKIN_APP_HOST;

  let scopes;
  const { level } = context.query;
  if (level && typeof level === 'string') {
    if (parseInt(level) > 1) {
      scopes = [`level${level}`];
    }
  }

  return {
    redirect: {
      destination: z.getLoginUrl(`${protocol}://${host}/`, scopes),
      permanent: false,
    },
  };
};

export default function NotUsed(): null {
  return null;
}
