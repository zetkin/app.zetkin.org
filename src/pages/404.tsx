import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { FormattedMessage as Msg } from 'react-intl';
import { AppBar, Box, Container, Toolbar, Typography } from '@material-ui/core';

import { getMessages } from '../utils/locale';
import ZetkinLogo from 'components/ZetkinLogo';

export const getStaticProps: GetStaticProps = async () => {
  const lang = 'en';
  const messages = await getMessages(lang, ['pages.404', 'misc.publicHeader']);
  return {
    props: { lang, messages },
  };
};

export default function Custom404(): JSX.Element {
  return (
    <>
      <Head>
        <title>Zetkin</title>
      </Head>
      <AppBar color="transparent" elevation={0} position="static">
        <Toolbar>
          <Link href="/">
            <a>
              <ZetkinLogo htmlColor="#EE323E" />
            </a>
          </Link>
        </Toolbar>
      </AppBar>
      <Box mt={4}>
        <Container>
          <Typography align="center" variant="h1">
            404
          </Typography>
          <Typography align="center" variant="h4">
            <Msg id="pages.404.pageNotFound" />
          </Typography>
          <Box mt={2}>
            <Typography align="center" variant="h6">
              <Link href="/">
                <a data-testid="back-home-link">
                  <Msg id="pages.404.backToHomePage" />
                </a>
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
