declare namespace Cypress {
    interface Chainable<> {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        waitUntilReactRendered(timeout? : number) : Chainable<any>;
    }
}