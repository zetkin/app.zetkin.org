import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Z from 'zetkin';
import { applySession } from 'next-session';
import stringToBool from '../utils/stringToBool';

import { AppSession } from '../types';
import { Content, Heading } from '@adobe/react-spectrum';

export const getServerSideProps : GetServerSideProps = async (context) => {
    const { query, req, res } = context;

    const z = Z.construct({
        clientId: process.env.ZETKIN_CLIENT_ID,
        clientSecret: process.env.ZETKIN_CLIENT_SECRET,
        ssl: stringToBool(process.env.ZETKIN_USE_TLS),
        zetkinDomain: process.env.ZETKIN_API_HOST,
    });

    const code = query?.code;
    if (code) {
        const protocol = stringToBool(process.env.APP_USE_TLS)? 'https' : 'http';
        const host = process.env.APP_HOST;

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
};

export default function Home() : JSX.Element {
    return (
        <>
            <Head>
                <title>Zetkin</title>
            </Head>
            <Content>
                <Heading level={ 1 }>This will become Zetkin</Heading>
            </Content>
        </>
    );
}