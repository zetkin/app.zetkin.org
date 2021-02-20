import React from 'react';
import { ZetkinUser } from '../interfaces/ZetkinUser';

export const UserContext = React.createContext(null);

export const useUser = () : ZetkinUser | null => {
    return React.useContext(UserContext);
};