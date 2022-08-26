import { NextPage } from 'next/types';
import { Session } from 'next-session/dist/types';

import { ZetkinTokenData } from './sdk';

export type AppSession = Session & {
  memberships?: number[] | null;
  redirAfterLogin: string | null;
  tokenData?: ZetkinTokenData | null;
};

interface GetLayout<P> {
  (page: JSX.Element, props: P): JSX.Element;
}

export type PageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
  getLayout: GetLayout<P>;
};

export interface Breadcrumb {
  href: string;
  label?: string;
  labelMsg?: string;
}
