import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FormattedMessage as Msg } from 'react-intl';
import {  Container, Typography } from '@material-ui/core';

import { getMessages } from '../utils/locale';

export const getStaticProps: GetStaticProps = async () => {
    const lang = 'en';
    const messages = await getMessages(lang, [
        'pages.404',
        'misc.publicHeader',
    ]);
    return {
        props: { lang, messages },
    };
};

export default function Custom404() : JSX.Element {
    return (
        <>
            <Head>
                <title>Zetkin</title>
            </Head>
            <Container>
                <Typography align="center" variant="h4">
                    <Msg id="pages.404.pageNotFound"/>
                </Typography>
                <Typography align="center" variant="h6">
                    <a data-testid="back-home-link" href="/">
                        <Msg id="pages.404.backToHomePage"/>
                    </a>
                </Typography>
            </Container>
        </>
    );
}
