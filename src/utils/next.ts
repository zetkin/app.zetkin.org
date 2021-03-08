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
    z: ZetkinZ;
};

export type ScaffoldedGetServerSideProps = (context: ScaffoldedContext) =>
    Promise<GetServerSidePropsResult<RegularProps>>;

interface ResultWithProps {
    props: ScaffoldedProps;
}

const hasProps = (result : any) : result is ResultWithProps => {
    return (result as ResultWithProps).props !== undefined;
};

export const scaffold = (wrapped : ScaffoldedGetServerSideProps) : GetServerSideProps<ScaffoldedProps> => {
    const getServerSideProps : GetServerSideProps<ScaffoldedProps> = async (contextFromNext : GetServerSidePropsContext) => {
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

        const result = await wrapped(ctx);

        // Figure out browser's preferred language
        const negotiator = new Negotiator(contextFromNext.req);
        const languages = negotiator.languages(['en', 'sv']);
        const lang = languages.length? languages[0] : 'en';

        const messages = await getMessages(lang);

        const augmentProps = (user : ZetkinUser | null) => {
            if (hasProps(result)) {
                const scaffoldedProps : ScaffoldedProps = {
                    ...result.props,
                    lang,
                    messages,
                    user,
                };
                result.props = scaffoldedProps;
            }
        };

        try {
            const user = await ctx.z.resource('users', 'me').get();
            augmentProps(user.data.data as ZetkinUser);
        }
        catch (error) {
            augmentProps(null);
        }

        return result as GetServerSidePropsResult<ScaffoldedProps>;
    };

    return getServerSideProps;
};