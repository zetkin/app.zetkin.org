import { createContext, FC, ReactNode, useContext } from 'react';

import makeSankeySegments from './makeSankeySegments';
import { SankeySegment } from './types';
import useSmartSearchStats from 'features/smartSearch/hooks/useSmartSearchStats';
import { ZetkinSmartSearchFilter } from '../types';

type SmartSearchSankeyProviderProps = {
  children: ReactNode;
  filters: ZetkinSmartSearchFilter[];
};

type SankeyContextValue = {
  segments: SankeySegment[];
};

const SankeyContext = createContext<SankeyContextValue | null>(null);

const SmartSearchSankeyProvider: FC<SmartSearchSankeyProviderProps> = ({
  children,
  filters,
}) => {
  const stats = useSmartSearchStats(filters);
  const segments = stats ? makeSankeySegments(stats) : [];

  return (
    <SankeyContext.Provider
      value={{
        segments,
      }}
    >
      {children}
    </SankeyContext.Provider>
  );
};

export function useSankey() {
  const context = useContext(SankeyContext);

  if (!context) {
    throw new Error(
      'Sankey segments must be wrapped in a SmartSearchSankeyProvider'
    );
  }

  const segmentsCopy = context.segments.concat();
  const entrySegment = segmentsCopy.shift();
  const exitSegment = segmentsCopy.pop();
  const filterSegments = segmentsCopy;

  return {
    entrySegment,
    exitSegment,
    filterSegments,
  };
}

export default SmartSearchSankeyProvider;
