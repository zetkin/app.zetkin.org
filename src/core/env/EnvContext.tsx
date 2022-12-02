import { createContext, FC, ReactNode } from 'react';

import Environment from './Environment';

const EnvContext = createContext<Environment | null>(null);

interface EnvProviderProps {
  children: ReactNode;
  env: Environment;
}

const EnvProvider: FC<EnvProviderProps> = ({ children, env }) => {
  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
};

export { EnvContext, EnvProvider };
