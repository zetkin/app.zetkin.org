import { createContext, FC, PropsWithChildren, useState } from 'react';

type AssigneesFilter = 'assigned' | 'unassigned';

type AssigneesFilterState = {
  assigneesFilter: AssigneesFilter | null;
  onAssigneesFilterChange: (newValue: AssigneesFilter | null) => void;
};

export const assigneesFilterContext = createContext<AssigneesFilterState>({
  assigneesFilter: null,
  onAssigneesFilterChange: () => undefined,
});

const AssigneeFilterProvider: FC<PropsWithChildren> = ({ children }) => {
  const [assigneesFilter, setAssigneesFilter] =
    useState<AssigneesFilter | null>(null);

  const onAssigneesFilterChange = (newValue: AssigneesFilter | null) => {
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
