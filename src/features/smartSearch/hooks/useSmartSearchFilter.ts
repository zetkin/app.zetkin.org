import { Dispatch } from 'react';
import {
  DefaultFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import { SetStateAction, useState } from 'react';

interface UseSmartSearchFilter<T> {
  filter: ZetkinSmartSearchFilter<T> | SmartSearchFilterWithId<T>;
  setConfig: Dispatch<SetStateAction<T>>;
  setOp: Dispatch<SetStateAction<OPERATION>>;
}

type InitialFilter<T> =
  | ZetkinSmartSearchFilter<T>
  | SmartSearchFilterWithId<T>
  | NewSmartSearchFilter;

export const useSmartSearchFilter = <C>(
  initialFilter: InitialFilter<C>,
  defaultConfig?: C
): UseSmartSearchFilter<C> => {
  // Set config to initial value, or empty
  const [config, setConfig] = useState<C | DefaultFilterConfig>(
    ('config' in initialFilter && initialFilter.config) || defaultConfig || {}
  );
  // Set operation to initial value or ADD
  const [op, setOp] = useState(
    ('op' in initialFilter && initialFilter.op) || OPERATION.ADD
  );

  // Build filter object
  const filter: ZetkinSmartSearchFilter<C> = {
    config: config as C,
    op,
    type: initialFilter.type,
    // Keep id if already in filter
    ...('id' in initialFilter && { id: initialFilter.id }),
  };

  return {
    filter,
    setConfig: setConfig as Dispatch<SetStateAction<C>>, // Only allow setting config to typed config
    setOp,
  };
};

export default useSmartSearchFilter;
