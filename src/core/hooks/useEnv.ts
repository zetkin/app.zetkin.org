import { useContext } from 'react';

import { EnvContext } from 'core/env/EnvContext';

export default function useEnv() {
  const env = useContext(EnvContext);
  if (!env) {
    throw new Error('EnvContext missing');
  }

  return env;
}
