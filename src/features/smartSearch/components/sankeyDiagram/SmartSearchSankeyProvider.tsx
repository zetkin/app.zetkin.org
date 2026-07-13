import { createContext, FC, ReactNode, useContext } from 'react';

import makeSankeySegments from './makeSankeySegments';
import oldTheme from 'theme';
import useSmartSearchStats from 'features/smartSearch/hooks/useSmartSearchStats';
import { ZetkinSmartSearchFilter } from '../types';
import { SankeyConfig, SankeySegment } from './types';
import { useNumericRouteParams } from 'core/hooks';

type SmartSearchSankeyProviderProps = {
  arrowDepth?: number;
  arrowWidth?: number;
  children: ReactNode;
  color?: string;
  diagWidth?: number;
  filters: ZetkinSmartSearchFilter[];
  hoverColor?: string;
  margin?: number;
};

type SankeyContextValue = {
  config: SankeyConfig;
  segments: SankeySegment[];
};

const SankeyContext = createContext<SankeyContextValue | null>(null);

const SmartSearchSankeyProvider: FC<SmartSearchSankeyProviderProps> = ({
  arrowDepth = 10,
  arrowWidth = 20,
  children,
  color = oldTheme.palette.grey[300],
  diagWidth = 200,
  hoverColor = oldTheme.palette.grey[400],
  margin = 30,
  filters,
}) => {
  const { orgId } = useNumericRouteParams();
  const stats = useSmartSearchStats(filters);
  const segments = stats ? makeSankeySegments(stats, orgId) : [];
  const config: SankeyConfig = {
    arrowDepth,
    arrowWidth,
    color,
    diagWidth,
    highlightColor: hoverColor,
    lineWidth: 2,
    margin,
  };

  return (
    <SankeyContext.Provider
      value={{
        config,
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
    config: context.config,
    entrySegment,
    exitSegment,
    filterSegments,
  };
}

export default SmartSearchSankeyProvider;
