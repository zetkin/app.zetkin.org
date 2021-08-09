import { applySession } from 'next-session';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FormattedMessage as Msg } from 'react-intl';
import { stringToBool } from '../utils/stringUtils';
import { Container, Typography } from '@material-ui/core';

import { AppSession } from '../types';
import { scaffold } from '../utils/next';

//TODO: Create module definition and revert to import.
// eslint-disable-next-line @typescript-eslint/no-var-requires

const scaffoldOptions = {
    localeScope: [
        'pages.home',
        'misc.publicHeader',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const { query, req, res } = context;

    const code = query?.code;

    if (code) {
        const protocol = stringToBool(process.env.NEXT_PUBLIC_APP_USE_TLS)? 'https' : 'http';
        const host = process.env.NEXT_PUBLIC_APP_HOST;

        let destination = '/';

        try {
            await context.z.authenticate(`${protocol}://${host}/?code=${code}`);
            await applySession(req, res);

            const reqWithSession = req as { session? : AppSession };
            if (reqWithSession.session) {
                reqWithSession.session.tokenData = context.z.getTokenData();

                if (reqWithSession.session.redirAfterLogin) {
                    // User logged in after trying to access some URL, and
                    // should be redirected to that URL once authenticated.
                    destination = reqWithSession.session.redirAfterLogin;
                    reqWithSession.session.redirAfterLogin = null;
                }
            }
        }
        catch (err) {
            // If this failed, we'll just continue anonymously
        }

        return {
            redirect: {
                destination,
                permanent: false,
            },
        };
    }
    else {
        return {
            props: {},
        };
    }
}, scaffoldOptions);

export default function Home() : JSX.Element {
    return (
        <>
            <Head>
                <title>Zetkin</title>
            </Head>
            <Container>
                <Typography variant="h4">
                    <Msg id="pages.home.welcome"/>
                </Typography>
            </Container>
        </>
    );
}
