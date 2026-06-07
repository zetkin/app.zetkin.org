import { IncomingMessage } from 'http';
import Negotiator from 'negotiator';
import { NextApiRequest } from 'next';

import { SUPPORTED_LANGUAGES, SupportedLanguage } from 'core/i18n/languages';

export type MessageList = Record<string, string>;

export const getBrowserLanguage = (
  req: NextApiRequest | IncomingMessage | string
): SupportedLanguage => {
  let negotiator: Negotiator;
  if (typeof req === 'string') {
    negotiator = new Negotiator({ headers: { 'accept-language': req } });
  } else {
    negotiator = new Negotiator(req);
  }
  const languages = negotiator.languages(SUPPORTED_LANGUAGES.concat());
  return languages.length ? (languages[0] as SupportedLanguage) : 'en';
};
