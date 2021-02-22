import { Session } from 'next-session/dist/types';

export type AppSession = Session & {
    tokenData?: {
        access_token: string;
        expires_in: number;
        refresh_token: string;
        token_type: string
    }
};