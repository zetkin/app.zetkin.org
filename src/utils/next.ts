import apiUrl from './apiUrl';
import { applySession } from 'next-session';
import Negotiator from 'negotiator';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { AppSession } from '../types';
import { getMessages } from './locale';
import stringToBool from './stringToBool';
import { ZetkinUser } from '../interfaces/ZetkinUser';
import { ZetkinZ } from '../types/sdk';

//TODO: Create module definition and revert to import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Z = require('zetkin');

type RegularProps = {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [key: string]: any;
};

export type ScaffoldedProps = RegularProps & {
    user: ZetkinUser | null;
    lang: string;
    messages: Record<string,string>;
};

export type ScaffoldedContext = GetServerSidePropsContext & {
    apiFetch: (path : string, init? : RequestInit) => Promise<Response>;
    user: ZetkinUser | null;
    z: ZetkinZ;
};

export type ScaffoldedGetServerSideProps = (context: ScaffoldedContext) =>
    Promise<GetServerSidePropsResult<RegularProps>>;

interface ResultWithProps {
    props: ScaffoldedProps;
}

interface ScaffoldOptions {
    localeScope?: string[];
}

const hasProps = (result : any) : result is ResultWithProps => {
    return (result as ResultWithProps).props !== undefined;
};

export const scaffold = (wrapped : ScaffoldedGetServerSideProps, options? : ScaffoldOptions) : GetServerSideProps<ScaffoldedProps> => {
    const getServerSideProps : GetServerSideProps<ScaffoldedProps> = async (contextFromNext : GetServerSidePropsContext) => {
        const ctx = contextFromNext as ScaffoldedContext;

        ctx.apiFetch = (path, init?) => {
            return fetch(apiUrl(path), {
                ...init,
                headers: {
                    cookie: contextFromNext.req.headers.cookie || '',
                    ...init?.headers,
                },
            });
        };

        ctx.z = Z.construct({
            clientId: process.env.ZETKIN_CLIENT_ID,
            clientSecret: process.env.ZETKIN_CLIENT_SECRET,
            host: process.env.ZETKIN_API_HOST,
            port: process.env.ZETKIN_API_PORT,
            ssl: stringToBool(process.env.ZETKIN_USE_TLS),
            zetkinDomain: process.env.ZETKIN_API_DOMAIN,
        });

        const { req, res } = contextFromNext;
        await applySession(req, res);

        const reqWithSession = req as { session? : AppSession };
        if (reqWithSession.session?.tokenData) {
            ctx.z.setTokenData(reqWithSession.session.tokenData);
        }

        try {
            const userRes = await ctx.z.resource('users', 'me').get();
            ctx.user = userRes.data.data as ZetkinUser;
        }
        catch (error) {
            ctx.user = null;
        }

        const user = ctx.user;

        const result = await wrapped(ctx);

        // Figure out browser's preferred language
        const negotiator = new Negotiator(contextFromNext.req);
        const languages = negotiator.languages(['en', 'sv']);
        const lang = languages.length? languages[0] : 'en';

        const messages = await getMessages(lang, options?.localeScope ?? []);

        if (hasProps(result)) {
            const scaffoldedProps : ScaffoldedProps = {
                ...result.props,
                lang,
                messages,
                user,
            };
            result.props = scaffoldedProps;
        }

        return result as GetServerSidePropsResult<ScaffoldedProps>;
    };

    return getServerSideProps;
};
