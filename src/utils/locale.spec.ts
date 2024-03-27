import { getBrowserLanguage } from './locale';
import { NextApiRequest } from 'next';

describe('getBrowserLanguage', () => {
  it('returns the preferred language of the user if available', () => {
    const request: Partial<NextApiRequest> = {
      headers: {
        'accept-language': 'sv',
      },
    };
    const language = getBrowserLanguage(request as NextApiRequest);
    expect(language).toEqual('sv');
  });

  it('returns a good default language if the user preference cannot be fulfilled', () => {
    const request: Partial<NextApiRequest> = {
      headers: {
        'accept-language': 'pt-BR',
      },
    };
    const language = getBrowserLanguage(request as NextApiRequest);
    expect(language).toEqual('en');
  });

  it('treats string input as an accept language header', () => {
    const language = getBrowserLanguage('sv;q=0.9,ar;q=0.8');
    expect(language).toEqual('sv');
  });
});
