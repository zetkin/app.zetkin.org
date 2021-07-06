import React from 'react';

import { ZetkinUser } from '../types/zetkin';

const UserContext = React.createContext<ZetkinUser | null>(null);

export default UserContext;
