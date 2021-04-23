import { FunctionComponent } from 'react';

import DefaultLayout from './DefaultLayout';
import UserHomeMenu from '../UserHomeMenu';

const UserHomeLayout : FunctionComponent = ({ children }) => {
    return (
        <>
            <DefaultLayout>
                { children }
                <UserHomeMenu/>
            </DefaultLayout>
        </>
    );
};

export default UserHomeLayout;