import { getIronSession } from 'iron-session';
import { GetServerSideProps } from 'next';

import { AppSession } from '../utils/types';
import requiredEnvVar from 'utils/requiredEnvVar';
import { scaffold } from '../utils/next';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (context) => {
    try {
      await context.z.resource('session').del();
    } catch (error) {
      //if user cannot log out, they are prob already logged out
    }

    const session = await getIronSession<AppSession>(context.req, context.res, {
      cookieName: 'zsid',
      password: requiredEnvVar('SESSION_PASSWORD'),
    });
    session?.destroy();

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
);

export default function NotUsed(): null {
  return null;
}
