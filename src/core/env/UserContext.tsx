import { ZetkinUser } from 'utils/types/zetkin';
import { createContext, FC, ReactNode } from 'react';

const UserContext = createContext<ZetkinUser | null>(null);

interface UserProviderProps {
  children: ReactNode;
  user: ZetkinUser | null;
}

const UserProvider: FC<UserProviderProps> = ({ children, user }) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };
