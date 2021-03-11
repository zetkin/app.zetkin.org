import { NextPage } from 'next/types';
import { Session } from 'next-session/dist/types';

export type AppSession = Session & {
    tokenData?: {
        access_token: string;
        expires_in: number;
        refresh_token: string;
        token_type: string;
    };
};

interface GetLayout {
    (page: JSX.Element, props: Record<string, unknown>): JSX.Element;
}

export type PageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
    getLayout: GetLayout;
};