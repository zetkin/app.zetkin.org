import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Card, Link, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';
import { GetServerSideProps, NextPage } from 'next';

import { scaffold } from 'utils/next';

export const getServerSideProps: GetServerSideProps = scaffold(
  async (context) => {
    const path = context.query.path || '';
    const orgQuerystring = context.query.orgId
      ? `?org=${context.query.orgId}`
      : '';
    const destination = `https://organize.zetk.in/${path}${orgQuerystring}`;

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
  const intl = useIntl();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'pages.legacy.header' })}</title>
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
            <FormattedMessage id="pages.legacy.header" />
          </Typography>
          <Typography
            style={{ marginBottom: 20, marginTop: 20 }}
            variant="body1"
          >
            <FormattedMessage id="pages.legacy.info" />
          </Typography>
          <NextLink href={destination} passHref>
            <Button color="primary" component="a" variant="contained">
              <FormattedMessage id="pages.legacy.continueButton" />
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
