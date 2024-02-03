import { stringToBool } from 'utils/stringUtils';

type URLDraft = {
  host: string;
  pathname: string;
  protocol: string;
};

export default function useAbsoluteUrl(path = '') {
  const draft: URLDraft = {
    host: '',
    pathname: '',
    protocol: '',
  };

  if (typeof location == 'undefined') {
    // On server
    draft.protocol = stringToBool(process.env.ZETKIN_USE_TLS)
      ? 'https:'
      : 'http:';
    draft.host = process.env.ZETKIN_APP_HOST || 'app.zetkin.org';
  } else {
    // In browser
    draft.protocol = location.protocol;
    draft.host = location.host;
  }
  draft.pathname = path;

  return `${draft.protocol}//${draft.host}${path}`;
}
