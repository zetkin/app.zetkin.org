import { applySession } from 'next-session';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FormattedMessage as Msg } from 'react-intl';
import stringToBool from '../utils/stringToBool';
import { Content, Heading } from '@adobe/react-spectrum';

import { AppSession } from '../types';
import { scaffold } from '../utils/next';

//TODO: Create module definition and revert to import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Z = require('zetkin');

const scaffoldOptions = {
    localeScope: [
        'pages.home',
        'misc.publicHeader',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    const { query, req, res } = context;

    const z = Z.construct({
        clientId: process.env.ZETKIN_CLIENT_ID,
        clientSecret: process.env.ZETKIN_CLIENT_SECRET,
        ssl: stringToBool(process.env.ZETKIN_USE_TLS),
        zetkinDomain: process.env.ZETKIN_API_HOST,
    });

    const code = query?.code;
    if (code) {
        const protocol = stringToBool(process.env.NEXT_PUBLIC_APP_USE_TLS)? 'https' : 'http';
        const host = process.env.NEXT_PUBLIC_APP_HOST;

        try {
            await z.authenticate(`${protocol}://${host}/?code=${code}`);
            await applySession(req, res);

            const reqWithSession = req as { session? : AppSession };
            if (reqWithSession.session) {
                reqWithSession.session.tokenData = z.getTokenData();
            }
        }
        catch (err) {
            // If this failed, we'll just continue anonymously
        }

        return {
            redirect: {
                destination: '/',
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
            <Content>
                <Heading level={ 1 }>
                    <Msg id="pages.home.welcome"/>
                </Heading>
            </Content>
        </>
    );
}