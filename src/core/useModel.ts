import { useContext, useEffect, useState } from 'react';

import { EnvContext } from './env/EnvContext';
import Environment from './env/Environment';
import { IModel } from './models';

export interface UseModelFactory<ModelType> {
  (env: Environment): ModelType;
}

export default function useModel<ModelType extends IModel>(
  factory: UseModelFactory<ModelType>
) {
  const env = useContext(EnvContext);
  if (!env) {
    throw new Error('Environment must be supplied. Add EnvProvider to tree.');
  }

  const [model, setModel] = useState(() => factory(env));
  const setRandom = useState(0)[1];

  useEffect(() => {
    const unsubscribeToStore = env.store.subscribe(() => {
      setModel(() => model);

      // TODO: Refactor to remove this, which is only used to force re-render
      setRandom(Math.random());
    });

    const unsubscribeToModel = model.subscribe(() => {
      // TODO: Refactor to remove this, which is only used to force re-render
      setRandom(Math.random());
    });

    return () => {
      unsubscribeToStore();
      unsubscribeToModel();
    };
  }, []);

  return model;
}
