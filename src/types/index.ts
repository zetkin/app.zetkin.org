import { NextPage } from 'next/types';
import { Session } from 'next-session/dist/types';

import { ZetkinOrganization } from './zetkin';
import { ZetkinTokenData } from './sdk';

export type AppSession = Session & {
  organizations?: ZetkinOrganization[] | null;
  redirAfterLogin: string | null;
  tokenData?: ZetkinTokenData | null;
};

interface GetLayout {
  (page: JSX.Element, props: Record<string, unknown>): JSX.Element;
}

export type PageWithLayout<P = Record<string, unknown>> = NextPage<P> & {
  getLayout: GetLayout;
};

export interface Breadcrumb {
  href: string;
  label?: string;
  labelMsg?: string;
}
