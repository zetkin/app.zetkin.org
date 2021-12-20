class APIError extends Error {
    constructor(method: string, url: string, backendError?: unknown) {
        const message = `Error making ${method} request to ${url}. Response: ${backendError}`;
        super(message);
        this.name = 'APIError';
    }
}

export default APIError;
