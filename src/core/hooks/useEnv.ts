import { EnvContext } from 'core/env/EnvContext';
import { useContext } from 'react';

export default function useEnv() {
  const env = useContext(EnvContext);
  if (!env) {
    throw new Error('EnvContext missing');
  }

  return env;
}
