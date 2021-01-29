import { FunctionComponent } from 'react';
import PublicHeader from '../components/PublicHeader';

const DefaultLayout : FunctionComponent = ({ children }) => (
    <>
        <PublicHeader user={ null }/>
        <div>{ children }</div>
    </>
);

export default DefaultLayout;