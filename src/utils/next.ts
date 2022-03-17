import { applySession } from 'next-session';
import { ParsedUrlQuery } from 'querystring';
import { QueryClient } from 'react-query';
import { dehydrate, DehydratedState } from 'react-query/hydration';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import { AppSession } from '../types';
import { getBrowserLanguage } from './locale';
import { getMessages } from './locale';
import { stringToBool } from './stringUtils';
import { ZetkinZ } from '../types/sdk';
import { ApiFetch, createApiFetch } from './apiFetch';
import { ZetkinMembership, ZetkinSession, ZetkinUser } from '../types/zetkin';

//TODO: Create module definition and revert to import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Z = require('zetkin');

type RegularProps = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [key: string]: any;
};

export type ScaffoldedProps = RegularProps & {
  dehydratedState: DehydratedState;
  lang: string;
  messages: Record<string, string>;
  user: ZetkinUser | null;
};

export type ScaffoldedContext = GetServerSidePropsContext & {
  apiFetch: ApiFetch;
  queryClient: QueryClient;
  user: ZetkinUser | null;
  z: ZetkinZ;
};

export type ScaffoldedGetServerSideProps = (
  context: ScaffoldedContext
) => Promise<GetServerSidePropsResult<RegularProps>>;

interface ResultWithProps {
  props: ScaffoldedProps;
}

interface ScaffoldOptions {
  // Level can be 1 (simple sign-in) or 2 (two-factor authentication)
  authLevelRequired?: number;
  localeScope?: string[];
}

const hasProps = (result: any): result is ResultWithProps => {
  const resultObj = result as Record<string, unknown>;
  if (resultObj.notFound) {
    return false;
  }
  if (resultObj.redirect) {
    return !resultObj.redirect;
  }
  return true;
};

const stripParams = (relativePath: string, params?: ParsedUrlQuery) => {
  if (!params) {
    return relativePath;
  }
  /* use fake base since the WHATWG url API does not support
    incomplete urls and legacy API is depracated */
  const url = new URL(relativePath, 'https://fake-base');
  Object.keys(params).forEach((p) => url.searchParams.delete(p));
  return url.pathname + url.search;
};

export const scaffold =
  (
    wrapped: ScaffoldedGetServerSideProps,
    options?: ScaffoldOptions
  ): GetServerSideProps<ScaffoldedProps> =>
  async (contextFromNext: GetServerSidePropsContext) => {
    const ctx = contextFromNext as ScaffoldedContext;

    ctx.queryClient = new QueryClient();
    ctx.apiFetch = createApiFetch(ctx.req.headers);

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

    const reqWithSession = req as { session?: AppSession };
    if (reqWithSession.session?.tokenData) {
      ctx.z.setTokenData(reqWithSession.session.tokenData);
    }

    try {
      const userRes = await ctx.z.resource('users', 'me').get();
      ctx.user = userRes.data.data as ZetkinUser;
    } catch (error) {
      ctx.user = null;
    }

    if (ctx.user) {
      const orgId = ctx.query.orgId as string;
      const userId = ctx.user.id.toString();

      try {
        const connectionRes = await ctx.z
          .resource('orgs', orgId, 'people', userId, 'connections')
          .get();
        const connectionData = connectionRes.data.data as ZetkinMembership[];

        if (reqWithSession.session) {
          reqWithSession.session.organizations = connectionData.map(
            (conn) => conn.organization
          );
        }
      } catch (error) {
        if (reqWithSession.session) {
          reqWithSession.session.organizations = null;
        }
      }
    }

    if (options?.authLevelRequired) {
      let authLevel;

      try {
        const apiSessionRes = await ctx.z.resource('session').get();
        const apiSession = apiSessionRes.data.data as ZetkinSession;
        authLevel = apiSession.level;
      } catch (err) {
        // Not logged in, so auth level is zero (anonymous)
        authLevel = 0;
      }

      if (authLevel < options.authLevelRequired) {
        if (reqWithSession.session) {
          // Store the URL that the user tried to access, so that they
          // can be redirected back here after logging in
          reqWithSession.session.redirAfterLogin = stripParams(
            ctx.resolvedUrl,
            ctx.params
          );
        }

        return {
          redirect: {
            destination: `/login?level=${options.authLevelRequired}`,
            permanent: false,
          },
        };
      }
    }

    // Update token data in session, in case it was refreshed
    if (reqWithSession.session) {
      reqWithSession.session.tokenData = ctx.z.getTokenData();
    }

    const result = (await wrapped(ctx)) || {};

    // Figure out browser's preferred language
    const lang = getBrowserLanguage(contextFromNext.req);

    const messages = await getMessages(lang, options?.localeScope ?? []);

    if (hasProps(result)) {
      result.props = {
        ...result.props,
        dehydratedState: dehydrate(ctx.queryClient),
        lang,
        messages,
        user: ctx.user,
      };
    }

    return result as GetServerSidePropsResult<ScaffoldedProps>;
  };
