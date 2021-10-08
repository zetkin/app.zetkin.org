/* eslint-disable @typescript-eslint/no-var-requires */

jest.mock('next/router', () => ({
    useRouter() {
        return {
            asPath: '',
            pathname: '',
            query: '',
            route: '',
        };
    },
}));

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

export default useRouter;
