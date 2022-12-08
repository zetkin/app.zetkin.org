import { useContext, useEffect, useState } from 'react';

import { EnvContext } from './env/EnvContext';
import Environment from './env/Environment';

export interface UseModelFactory<ModelType> {
  (env: Environment): ModelType;
}

export default function useModel<ModelType>(
  factory: UseModelFactory<ModelType>
) {
  const env = useContext(EnvContext);
  if (!env) {
    throw new Error('Environment must be supplied. Add EnvProvider to tree.');
  }

  const [model, setModel] = useState(() => factory(env));
  const setRandom = useState(0)[1];

  useEffect(() => {
    const unsubscribe = env.store.subscribe(() => {
      setModel(() => model);

      // TODO: Refactor to remove this, which is only used to force re-render
      setRandom(Math.random());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return model;
}
