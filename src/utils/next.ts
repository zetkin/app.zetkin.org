import { getIronSession } from 'iron-session';
import { ParsedUrlQuery } from 'querystring';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';

import { AppSession } from './types';
import { getBrowserLanguage, getMessages } from './locale';
import getUserMemberships from './getUserMemberships';
import requiredEnvVar from './requiredEnvVar';
import { stringToBool } from './stringUtils';
import { ZetkinZ } from './types/sdk';
import { ApiFetch, createApiFetch } from './apiFetch';
import { ZetkinSession, ZetkinUser } from './types/zetkin';
import { hasFeature } from './featureFlags';
import { EnvVars } from 'core/env/Environment';
import { omitUndefined } from './omitUndefined';

//TODO: Create module definition and revert to import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Z = require('zetkin');

type RegularProps = {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [key: string]: any;
};

export type ScaffoldedProps = RegularProps & {
  envVars: EnvVars;
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
  featuresRequired?: string[];
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

const hasOrg = (session: AppSession | undefined, orgId: string) => {
  return Boolean(session?.memberships?.find((org) => org === parseInt(orgId)));
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
    const session = await getIronSession<AppSession>(req, res, {
      cookieName: 'zsid',
      password: requiredEnvVar('SESSION_PASSWORD'),
    });

    if (session.tokenData) {
      ctx.z.setTokenData(session.tokenData);
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
        session.redirAfterLogin = stripParams(ctx.resolvedUrl, ctx.params);

        await session.save();

        return {
          redirect: {
            destination: `/login?level=${options.authLevelRequired}`,
            permanent: false,
          },
        };
      }
    }

    const orgId = ctx.query.orgId as string;

    if (options?.featuresRequired) {
      const isMissingFeature = options.featuresRequired.some(
        (feature) => !hasFeature(feature, parseInt(orgId), process.env)
      );

      if (isMissingFeature) {
        return {
          notFound: true,
        };
      }
    }

    //if it's an org page we check if you have access
    if (orgId) {
      //superusers get in everywhere
      if (!ctx.user?.is_superuser) {
        //if the org is in your memberships, come in
        //if not, more checks
        if (!hasOrg(session, orgId)) {
          //fetch your orgs again to see if they've been updated
          try {
            const allowNonOfficials = !!options?.allowNonOfficials;
            session.memberships = await getUserMemberships(
              ctx,
              allowNonOfficials
            );
          } catch (error) {
            session.memberships = null;
          }
          //if you still don't have the org we redirect to 404
          if (!hasOrg(session, orgId)) {
            return {
              notFound: true,
            };
          }
        }
      }
    }

    // Update token data in session, in case it was refreshed
    session.tokenData = ctx.z.getTokenData();

    await session.save();

    const result = (await wrapped(ctx)) || {};

    // Figure out browser's preferred language
    const lang = ctx.user?.lang || getBrowserLanguage(contextFromNext.req);

    // TODO: Respect scope from options again
    //const localeScope = (options?.localeScope ?? []).concat(['misc', 'zui']);
    const localeScope: string[] = [];
    const messages = await getMessages(lang, localeScope);

    if (hasProps(result)) {
      result.props = {
        ...result.props,
        envVars: omitUndefined({
          FEAT_AREAS: process.env.FEAT_AREAS,
          INSTANCE_OWNER_HREF: process.env.INSTANCE_OWNER_HREF,
          INSTANCE_OWNER_NAME: process.env.INSTANCE_OWNER_NAME,
          MUIX_LICENSE_KEY: process.env.MUIX_LICENSE_KEY,
          ZETKIN_APP_DOMAIN: process.env.ZETKIN_APP_DOMAIN,
          ZETKIN_GEN2_ORGANIZE_URL: process.env.ZETKIN_GEN2_ORGANIZE_URL,
          ZETKIN_PRIVACY_POLICY_LINK: process.env.ZETKIN_PRIVACY_POLICY_LINK,
        }),
        lang,
        messages,
        user: ctx.user,
      };
    }

    return result as GetServerSidePropsResult<ScaffoldedProps>;
  };
