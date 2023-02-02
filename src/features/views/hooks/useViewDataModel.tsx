import { createContext, FC, useContext } from 'react';

import ViewDataModel from '../models/ViewDataModel';

const DataModelContext = createContext<ViewDataModel | null>(null);

type ViewDataModelProviderProps = {
  children: JSX.Element;
  model: ViewDataModel;
};

const ViewDataModelProvider: FC<ViewDataModelProviderProps> = ({
  children,
  model,
}) => {
  return (
    <DataModelContext.Provider value={model}>
      {children}
    </DataModelContext.Provider>
  );
};

export { ViewDataModelProvider };

export default function useViewDataModel(): ViewDataModel {
  const model = useContext(DataModelContext);

  if (!model) {
    throw new Error(
      'useViewDataModel() must be used within ViewDataModelProvider'
    );
  }

  return model;
}
