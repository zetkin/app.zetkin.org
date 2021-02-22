import { applySession } from 'next-session';
import Z from 'zetkin';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { AppSession } from '../types';
import stringToBool from './stringToBool';
import { ZetkinZ } from '../types/sdk';

export type ScaffoldedProps = {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: any
};

export type ScaffoldedContext = GetServerSidePropsContext<ScaffoldedProps> & {
    z: ZetkinZ
};

export type ScaffoldedGetServerSideProps = GetServerSideProps<ScaffoldedProps> & {
    (context: ScaffoldedContext): Promise<GetServerSidePropsResult<ScaffoldedProps>>
};

export const scaffold = (wrapped : ScaffoldedGetServerSideProps) : GetServerSideProps => {
    const getServerSideProps : ScaffoldedGetServerSideProps = async (context) => {
        const ctx = context as ScaffoldedContext;

        ctx.z = Z.construct({
            clientId: process.env.ZETKIN_CLIENT_ID,
            clientSecret: process.env.ZETKIN_CLIENT_SECRET,
            ssl: stringToBool(process.env.ZETKIN_USE_TLS),
            zetkinDomain: process.env.ZETKIN_API_HOST,
        });

        const { req, res } = context;
        await applySession(req, res);

        const reqWithSession = req as { session? : AppSession };
        if (reqWithSession.session) {
            ctx.z.setTokenData(reqWithSession.session.tokenData);
        }

        return wrapped(ctx);
    };

    return getServerSideProps;
};