import { NextPage } from 'next/types';
import { Session } from 'next-session/dist/types';

import { ZetkinTokenData } from './sdk';


export type AppSession = Session & {
    tokenData?: ZetkinTokenData | null;
    redirAfterLogin: string | null;
};

interface GetLayout {
    (page: JSX.Element, props: Record<string, unknown>): JSX.Element;
}

export type PageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
    getLayout: GetLayout;
};
