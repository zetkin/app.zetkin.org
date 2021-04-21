//TODO: Enable eslint rule and fix errors
/* eslint-disable  @typescript-eslint/no-non-null-assertion */
import { FunctionComponent } from 'react';

import DefaultLayout from './DefaultLayout';
import UserHomeMenu from '../UserHomeMenu';

const UserHomeLayout : FunctionComponent = ({ children }) => {
    return (
        <>
            <DefaultLayout>
                { children }
            </DefaultLayout>
            <UserHomeMenu/>
        </>
    );
};

export default UserHomeLayout;