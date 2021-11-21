class APIError extends Error {
    constructor(method: string, url: string) {
        const message = `Error making ${method} request to ${url}`;
        super(message);
        this.name = 'APIError';
    }
}

export default APIError;
