import { GetServerSideProps } from 'next';

import stringToBool from '../utils/stringToBool';
import { scaffold } from '../utils/next';
// TODO: Fix lint warning ts(7016)
import Cookies from 'cookies';

//TODO: Create module definition and revert to import.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Z = require('zetkin');

const scaffoldOptions = {
    localeScope: [
        'pages.home',
        'misc.publicHeader',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async (context) => {
    // Remove the session when logging out
    context.z.resource("session").del();

    // Clear the session cookie
    const cookies = new Cookies(context.req, context.res);
    cookies.set('sid');
    
    return {
        redirect: {
            destination: '/',
            permanent: false,
        },
    };

}, scaffoldOptions);

export default function NotUsed() : null {
    return null;
}