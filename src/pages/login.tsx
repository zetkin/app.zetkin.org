import { GetServerSideProps } from 'next';
import { getIronSession } from 'iron-session';

import { stringToBool } from '../utils/stringUtils';
import { AppSession } from 'utils/types';
import requiredEnvVar from 'utils/requiredEnvVar';

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

  const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
  const host =
    context.req.headers.host || process.env.ZETKIN_APP_HOST || 'localhost:3000';

  let scopes;
  const { level, redirect } = context.query;
  if (level && typeof level === 'string') {
    if (parseInt(level) > 1) {
      scopes = [`level${level}`];
    }
  }

  if (typeof redirect == 'string') {
    const session = await getIronSession<AppSession>(context.req, context.res, {
      cookieName: 'zsid',
      password: requiredEnvVar('SESSION_PASSWORD'),
    });

    // Store the URL that the user tried to access, so that they
    // can be redirected back here after logging in
    session.redirAfterLogin = redirect;

    await session.save();
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
