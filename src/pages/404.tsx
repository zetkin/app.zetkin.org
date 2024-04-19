import Head from 'next/head';
import Link from 'next/link';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';

import { Msg } from 'core/i18n';
import ZUILogo from 'zui/ZUILogo';

import messageIds from 'core/l10n/messageIds';

export default function Custom404(): JSX.Element {
  return (
    <>
      <Head>
        <title>Zetkin</title>
      </Head>
      <AppBar color="transparent" elevation={0} position="static">
        <Toolbar>
          <Link href="/" passHref>
            <ZUILogo htmlColor="#EE323E" />
          </Link>
        </Toolbar>
      </AppBar>
      <Box mt={4}>
        <Container>
          <Typography align="center" variant="h1">
            404
          </Typography>
          <Typography align="center" variant="h4">
            <Msg id={messageIds.err404.pageNotFound} />
          </Typography>
          <Box mt={2}>
            <Typography align="center" variant="h6">
              <Link data-testid="back-home-link" href="/" passHref>
                <Msg id={messageIds.err404.backToHomePage} />
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
}
