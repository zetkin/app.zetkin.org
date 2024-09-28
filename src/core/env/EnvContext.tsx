import { createContext, FC, PropsWithChildren } from 'react';

import Environment from './Environment';

const EnvContext = createContext<Environment | null>(null);

type EnvProviderProps = PropsWithChildren & {
  env: Environment;
};

const EnvProvider: FC<EnvProviderProps> = ({ children, env }) => {
  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
};

export { EnvContext, EnvProvider };
