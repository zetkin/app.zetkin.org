import { createContext, FC, PropsWithChildren, useState } from 'react';

type AreaFilterState = {
  activeGroupIds: number[];
  activeTagIdsByGroup: Record<string, number[]>;
  setActiveGroupIds: (value: number[]) => void;
  setActiveTagIdsByGroup: (value: Record<string, number[]>) => void;
};

export const areaFilterContext = createContext<AreaFilterState>({
  activeGroupIds: [],
  activeTagIdsByGroup: {},
  setActiveGroupIds: () => undefined,
  setActiveTagIdsByGroup: () => undefined,
});

const AreaFilterProvider: FC<PropsWithChildren> = ({ children }) => {
  const [activeGroupIds, setActiveGroupIds] = useState<number[]>([]);
  const [activeTagIdsByGroup, setActiveTagIdsByGroup] = useState<
    Record<string, number[]>
  >({});

  return (
    <areaFilterContext.Provider
      value={{
        activeGroupIds,
        activeTagIdsByGroup,
        setActiveGroupIds,
        setActiveTagIdsByGroup,
      }}
    >
      {children}
    </areaFilterContext.Provider>
  );
};

export default AreaFilterProvider;
