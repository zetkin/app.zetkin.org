class APIError extends Error {
  constructor(method: string, url: string, more?: unknown) {
    const message = `Error making ${method} request to ${url}. ${
      more ? `More info: ${more}` : ''
    }`;
    super(message);
    this.name = 'APIError';
  }
}

export default APIError;
