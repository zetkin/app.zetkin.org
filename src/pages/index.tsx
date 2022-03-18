import { applySession } from 'next-session';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FormattedMessage as Msg } from 'react-intl';
import { stringToBool } from '../utils/stringUtils';
import { Button, ButtonGroup, Container, Typography } from '@material-ui/core';

import { AppSession } from '../types';
import { scaffold } from '../utils/next';
import { ZetkinMembership, ZetkinUser } from '../types/zetkin';

//TODO: Create module definition and revert to import.
// eslint-disable-next-line @typescript-eslint/no-var-requires

const scaffoldOptions = {
  localeScope: ['pages.home', 'misc.publicHeader'],
};

export const getServerSideProps: GetServerSideProps = scaffold(
  async (context) => {
    const { query, req, res } = context;

    const code = query?.code;

    if (code) {
      const protocol = stringToBool(process.env.ZETKIN_USE_TLS)
        ? 'https'
        : 'http';
      const host = process.env.ZETKIN_APP_HOST;

      let destination = '/';

      try {
        await context.z.authenticate(`${protocol}://${host}/?code=${code}`);
        await applySession(req, res);

        const reqWithSession = req as { session?: AppSession };

        try {
          const userRes = await context.z.resource('users', 'me').get();
          context.user = userRes.data.data as ZetkinUser;
        } catch (error) {
          context.user = null;
        }

        if (reqWithSession.session) {
          reqWithSession.session.tokenData = context.z.getTokenData();

          if (context.user) {
            const userId = context.user.id.toString();
            try {
              const membershipsRes = await context.z
                .resource('users', userId, 'memberships')
                .get();
              const membershipsData = membershipsRes.data
                .data as ZetkinMembership[];

              reqWithSession.session.organizations = membershipsData.map(
                (membership) => membership.organization.id
              );
            } catch (error) {
              reqWithSession.session.organizations = null;
            }
          }

          if (reqWithSession.session.redirAfterLogin) {
            // User logged in after trying to access some URL, and
            // should be redirected to that URL once authenticated.
            destination = reqWithSession.session.redirAfterLogin;
            reqWithSession.session.redirAfterLogin = null;
          }
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
          <Msg id="pages.home.welcome" />
        </Typography>
        {/* TODO: remove stuff below */}
        {process.env.NODE_ENV === 'development' && (
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
              <Button href="organize/1/campaigns">Campaigns</Button>
            </ButtonGroup>
          </div>
        )}
      </Container>
    </>
  );
}
