import { FunctionComponent } from 'react';

const DefualtLayout : FunctionComponent = ({ children }) => (
    <div>
        <h1>Zetkin</h1>
        <div>{ children }</div>
    </div>
);
  
export default DefualtLayout;