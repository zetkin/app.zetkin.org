//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-var-requires */
import { applySession } from 'next-session';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { AppSession } from '../types';
import stringToBool from './stringToBool';
import { ZetkinUser } from '../interfaces/ZetkinUser';
import { ZetkinZ } from '../types/sdk';

//TODO: Create module definition and revert to import.
const Z = require('zetkin');

export type ScaffoldedProps = {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: any;
    user?: ZetkinUser;
};

export type ScaffoldedContext = GetServerSidePropsContext & {
    z: ZetkinZ;
};

export type ScaffoldedGetServerSideProps = (context: ScaffoldedContext) =>
    Promise<GetServerSidePropsResult<ScaffoldedProps>>;

interface ResultWithProps {
    props: ScaffoldedProps;
}

const hasProps = (result : any) : result is ResultWithProps => {
    return (result as ResultWithProps).props !== undefined;
};

export const scaffold = (wrapped : ScaffoldedGetServerSideProps) : GetServerSideProps => {
    const getServerSideProps : GetServerSideProps = async (contextFromNext : GetServerSidePropsContext) => {
        const ctx = contextFromNext as ScaffoldedContext;

        ctx.z = Z.construct({
            clientId: process.env.ZETKIN_CLIENT_ID,
            clientSecret: process.env.ZETKIN_CLIENT_SECRET,
            ssl: stringToBool(process.env.ZETKIN_USE_TLS),
            zetkinDomain: process.env.ZETKIN_API_HOST,
        });

        const { req, res } = contextFromNext;
        await applySession(req, res);

        const reqWithSession = req as { session? : AppSession };
        if (reqWithSession.session?.tokenData) {
            ctx.z.setTokenData(reqWithSession.session.tokenData);
        }

        const user = await ctx.z.resource('users', 'me').get();

        const result = await wrapped(ctx);

        if (hasProps(result)) {
            result.props.user = user.data.data as ZetkinUser;
        }

        return result;
    };

    return getServerSideProps;
};