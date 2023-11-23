/* eslint-disable react/no-danger */
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Card, Link, Typography } from '@mui/material';
import { GetServerSideProps, NextPage } from 'next';

import { scaffold } from 'utils/next';
import { Msg, useMessages } from 'core/i18n';

import messageIds from 'core/l10n/messageIds';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (context) => {
    const path = context.query.path || '';
    const orgQuerystring = context.query.orgId
      ? `?org=${context.query.orgId}`
      : '';
    const destination = `https://organize.${process.env.ZETKIN_API_DOMAIN}/${path}${orgQuerystring}`;

    return {
      props: {
        destination,
      },
    };
  },
  {
    localeScope: ['pages.legacy'],
  }
);

interface LegacyPageProps {
  destination: string;
}

const LegacyPage: NextPage<LegacyPageProps> = ({ destination }) => {
  const messages = useMessages(messageIds);
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{messages.legacy.header()}</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `
          html, body, body > div { height: 100%; padding: 0; margin: 0; }
          `,
          }}
        />
      </Head>
      <Box
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Card
          style={{
            margin: 10,
            maxWidth: 600,
            padding: 20,
            textAlign: 'center',
          }}
        >
          <Typography variant="h3">
            <Msg id={messageIds.legacy.header} />
          </Typography>
          <Typography
            style={{ marginBottom: 20, marginTop: 20 }}
            variant="body1"
          >
            <Msg id={messageIds.legacy.info} />
          </Typography>
          <NextLink href={destination} passHref>
            <Button color="primary" component="a" variant="contained">
              <Msg id={messageIds.legacy.continueButton} />
            </Button>
          </NextLink>
          <Typography
            color="textSecondary"
            style={{ marginTop: 4 }}
            variant="body2"
          >
            <NextLink href="/" passHref>
              <Link
                onClick={(ev) => {
                  ev.preventDefault();
                  router.back();
                }}
                underline="hover"
              >
                No, take me back!
              </Link>
            </NextLink>
          </Typography>
        </Card>
      </Box>
    </>
  );
};

export default LegacyPage;
