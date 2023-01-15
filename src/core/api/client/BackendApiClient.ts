import { IncomingHttpHeaders } from 'http';

import { createApiFetch } from 'utils/apiFetch';
import FetchApiClient from './FetchApiClient';

export default class BackendApiClient extends FetchApiClient {
  constructor(headers: IncomingHttpHeaders) {
    const fetch = createApiFetch(headers, '');
    super(fetch);
  }
}
