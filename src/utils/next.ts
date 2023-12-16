import { applySession } from 'next-session';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { ParsedUrlQuery } from 'querystring';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import { AppSession } from './types';
import { getMessages } from './locale';
import getUserMemberships from './getUserMemberships';
import { stringToBool } from './stringUtils';
import { ZetkinZ } from './types/sdk';
import { ApiFetch, createApiFetch } from './apiFetch';
import { getBrowserLanguage, MessageList } from './locale';
import { ZetkinSession, ZetkinUser } from './types/zetkin';

//TODO: Create module definition and revert to import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Z = require('zetkin');

type RegularProps = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [key: string]: any;
};

export type ScaffoldedProps = RegularProps & {
  lang: string;
  messages: Record<string, string>;
  user: ZetkinUser | null;
};

export type ScaffoldedContext = GetServerSidePropsContext & {
  apiFetch: ApiFetch;
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
  allowNonOfficials?: boolean;
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

const hasOrg = (reqWithSession: { session?: AppSession }, orgId: string) => {
  return Boolean(
    reqWithSession.session?.memberships?.find((org) => org === parseInt(orgId))
  );
};

export const scaffold =
  (
    wrapped: ScaffoldedGetServerSideProps,
    options?: ScaffoldOptions
  ): GetServerSideProps<ScaffoldedProps> =>
  async (contextFromNext: GetServerSidePropsContext) => {
    const ctx = contextFromNext as ScaffoldedContext;

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
    const reqWithSession = req as IncomingMessage & {
      cookies: NextApiRequestCookies;
      session: AppSession;
    };

    if (reqWithSession.session.tokenData) {
      ctx.z.setTokenData(reqWithSession.session.tokenData);
    }

    try {
      const userRes = await ctx.z.resource('users', 'me').get();
      ctx.user = userRes.data.data as ZetkinUser;
    } catch (error) {
      ctx.user = null;
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
        // Store the URL that the user tried to access, so that they
        // can be redirected back here after logging in
        reqWithSession.session.redirAfterLogin = stripParams(
          ctx.resolvedUrl,
          ctx.params
        );

        return {
          redirect: {
            destination: `/login?level=${options.authLevelRequired}`,
            permanent: false,
          },
        };
      }
    }

    const orgId = ctx.query.orgId as string;

    //if it's an org page we check if you have access
    if (orgId) {
      //superusers get in everywhere
      if (!ctx.user?.is_superuser) {
        //if the org is in your memberships, come in
        //if not, more checks
        if (!hasOrg(reqWithSession, orgId)) {
          //fetch your orgs again to see if they've been updated
          try {
            const allowNonOfficials = !!options?.allowNonOfficials;
            reqWithSession.session.memberships = await getUserMemberships(
              ctx,
              allowNonOfficials
            );
          } catch (error) {
            reqWithSession.session.memberships = null;
          }
          //if you still don't have the org we redirect to 404
          if (!hasOrg(reqWithSession, orgId)) {
            return {
              notFound: true,
            };
          }
        }
      }
    }

    // Update token data in session, in case it was refreshed
    reqWithSession.session.tokenData = ctx.z.getTokenData();

    await reqWithSession.session.commit();

    const result = (await wrapped(ctx)) || {};

    // Figure out browser's preferred language
    const lang = ctx.user?.lang || getBrowserLanguage(contextFromNext.req);

    // TODO: Respect scope from options again
    //const localeScope = (options?.localeScope ?? []).concat(['misc', 'zui']);
    const localeScope: string[] = [];
    let messages: MessageList = {};
    if (process.env.LYRA_URL) {
      const lyraRes = await fetch(
        `${process.env.LYRA_URL}/api/translations/${lang}`
      );
      const lyraPayload = await lyraRes.json();
      messages = lyraPayload.translations;
    } else {
      messages = await getMessages(lang, localeScope);
    }

    if (hasProps(result)) {
      result.props = {
        ...result.props,
        lang,
        messages,
        user: ctx.user,
      };
    }

    return result as GetServerSidePropsResult<ScaffoldedProps>;
  };
