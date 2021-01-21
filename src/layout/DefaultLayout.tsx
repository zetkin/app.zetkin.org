import { FunctionComponent } from 'react';

const DefaultLayout : FunctionComponent = ({ children }) => (
    <div>
        <h1>Zetkin</h1>
        <div>{ children }</div>
    </div>
);
  
export default DefaultLayout;