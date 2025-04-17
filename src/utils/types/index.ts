import { NextPage } from 'next/types';

import { ZetkinTokenData } from './sdk';

export type AppSession = {
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

/**
 * This is a utility type to create a version of a type where you select
 * which optional properties are made required.
 * <br>
 * Stolen from: https://www.emmanuelgautier.com/blog/snippets/typescript-required-properties
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
