import { GetServerSideProps } from 'next';

import { AppSession } from '../utils/types';
import { scaffold } from '../utils/next';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (context) => {
    try {
      await context.z.resource('session').del();
    } catch (error) {
      //if user cannot log out, they are prob already logged out
    }

    const reqWithSession = context.req as { session?: AppSession };
    reqWithSession.session?.destroy();

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
