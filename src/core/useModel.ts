import { useStore } from 'react-redux';
import { useEffect, useState } from 'react';

import { RootState, Store } from './store';

export interface UseModelFactory<ModelType> {
  (store: Store): ModelType;
}

export default function useModel<ModelType>(
  factory: UseModelFactory<ModelType>
) {
  const store = useStore<RootState>();
  const [model, setModel] = useState(() => factory(store));
  const setRandom = useState(0)[1];

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
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
