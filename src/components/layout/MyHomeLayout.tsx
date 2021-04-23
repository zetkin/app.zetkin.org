import { FunctionComponent } from 'react';

import DefaultLayout from './DefaultLayout';
import MyHomeMenu from '../MyHomeMenu';

const MyHomeLayout : FunctionComponent = ({ children }) => {
    return (
        <>
            <DefaultLayout>
                { children }
                <MyHomeMenu/>
            </DefaultLayout>
        </>
    );
};

export default MyHomeLayout;