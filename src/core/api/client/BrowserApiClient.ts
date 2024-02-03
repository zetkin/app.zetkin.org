import FetchApiClient from './FetchApiClient';

// Fetch must be wrapped, because it can't be invoked
// as a method on the class otherwise
function wrappedFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(path, init);
}

export default class BrowserApiClient extends FetchApiClient {
  constructor() {
    super(wrappedFetch);
  }
}
