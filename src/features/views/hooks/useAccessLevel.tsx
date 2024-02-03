import { createContext, FC, useContext } from 'react';

import { ZetkinObjectAccess } from 'core/api/types';

type UseAccessLevelReturn = [boolean, ZetkinObjectAccess['level'] | null];

const AccessLevelContext = createContext<UseAccessLevelReturn>([false, null]);

type AccessLevelProviderProps = {
  accessLevel?: ZetkinObjectAccess['level'] | null;
  children: JSX.Element | null;
  isRestricted?: boolean;
};

const AccessLevelProvider: FC<AccessLevelProviderProps> = ({
  accessLevel = null,
  children,
  isRestricted = false,
}) => {
  return (
    <AccessLevelContext.Provider value={[isRestricted, accessLevel]}>
      {children}
    </AccessLevelContext.Provider>
  );
};

export { AccessLevelProvider };

export default function useAccessLevel(): UseAccessLevelReturn {
  return useContext(AccessLevelContext);
}
