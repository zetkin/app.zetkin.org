import { getIronSession } from 'iron-session';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { Button, ButtonGroup, Container, Typography } from '@mui/material';

import { AppSession } from '../utils/types';
import getUserMemberships from 'utils/getUserMemberships';
import { Msg } from 'core/i18n';
import requiredEnvVar from 'utils/requiredEnvVar';
import { scaffold } from '../utils/next';
import { ZetkinUser } from '../utils/types/zetkin';

import messageIds from 'core/l10n/messageIds';

//TODO: Create module definition and revert to import.
// eslint-disable-next-line @typescript-eslint/no-var-requires

const scaffoldOptions = {
  localeScope: ['pages.home'],
};

export const getServerSideProps: GetServerSideProps = scaffold(
  async (context) => {
    const { query, req, res } = context;

    const code = query?.code;

    if (code) {
      const protocol = process.env.ZETKIN_APP_PROTOCOL || 'http';
      const host =
        req.headers.host || process.env.ZETKIN_APP_HOST || 'localhost:3000';

      let destination = '/';

      try {
        await context.z.authenticate(`${protocol}://${host}/?code=${code}`);
        const session = await getIronSession<AppSession>(req, res, {
          cookieName: 'zsid',
          password: requiredEnvVar('SESSION_PASSWORD'),
        });

        try {
          const userRes = await context.z.resource('users', 'me').get();
          context.user = userRes.data.data as ZetkinUser;
        } catch (error) {
          context.user = null;
        }

        if (session) {
          session.tokenData = context.z.getTokenData();
          if (context.user) {
            try {
              session.memberships = await getUserMemberships(context);
            } catch (error) {
              session.memberships = null;
            }
          }

          if (session.redirAfterLogin) {
            // User logged in after trying to access some URL, and
            // should be redirected to that URL once authenticated.
            destination = session.redirAfterLogin;
            session.redirAfterLogin = null;
          }

          await session.save();
        }
      } catch (err) {
        // If this failed, we'll just continue anonymously
      }

      return {
        redirect: {
          destination,
          permanent: false,
        },
      };
    } else {
      return {
        props: {},
      };
    }
  },
  scaffoldOptions
);

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Zetkin</title>
      </Head>
      <Container>
        <Typography variant="h4">
          <Msg id={messageIds.home.welcome} />
        </Typography>
        {/* TODO: remove stuff below */}
        {(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_APP_ENV === 'development') && (
          <div>
            <Typography variant="body1">This page is for devs only!</Typography>
            <ButtonGroup
              aria-label="vertical contained primary button group"
              color="primary"
              orientation="vertical"
              size="large"
              variant="text"
            >
              <Button href="organize/1/people">People</Button>
              <Button href="organize/1/projects">Projects</Button>
            </ButtonGroup>
          </div>
        )}
      </Container>
    </>
  );
}
