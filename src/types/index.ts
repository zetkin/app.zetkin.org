import { NextPage } from 'next/types';
import { Session } from 'next-session/dist/types';

import { ZetkinTokenData } from './sdk';


export type AppSession = Session & {
    redirAfterLogin: string | null;
    tokenData?: ZetkinTokenData | null;
};

interface GetLayout {
    (page: JSX.Element, props: Record<string, unknown>): JSX.Element;
}

export type PageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
    getLayout: GetLayout;
};

export interface BookedEvent {
    activity: { id: number; title: string };
    campaign: { id: number; title: string };
    contact: string | null;
    end_time: string;
    id: number;
    info_text: string;
    location: { id: number; lat: number; lng: number; title: string };
    num_participants_required: number;
    num_participants_available: number;
    start_time: string;
    title: string | null;
}