import { createContext, FC, PropsWithChildren, useState } from 'react';

type AssigneesFilter = 'all' | 'assigned' | 'unassigned';

type AssigneesFilterState = {
  assigneesFilter: AssigneesFilter;
  onAssigneesFilterChange: (newValue: AssigneesFilter) => void;
};

export const assigneesFilterContext = createContext<AssigneesFilterState>({
  assigneesFilter: 'all',
  onAssigneesFilterChange: () => undefined,
});

const AssigneeFilterProvider: FC<PropsWithChildren> = ({ children }) => {
  const [assigneesFilter, setAssigneesFilter] =
    useState<AssigneesFilter>('all');

  const onAssigneesFilterChange = (newValue: AssigneesFilter) => {
    setAssigneesFilter(newValue);
  };

  return (
    <assigneesFilterContext.Provider
      value={{
        assigneesFilter,
        onAssigneesFilterChange,
      }}
    >
      {children}
    </assigneesFilterContext.Provider>
  );
};

export default AssigneeFilterProvider;
