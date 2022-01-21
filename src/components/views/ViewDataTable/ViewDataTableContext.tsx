import { createContext } from 'react';
import { GridColDef, GridSortModel } from '@mui/x-data-grid-pro';

interface ViewDataTableContextProps {
    gridColumns: GridColDef[];
    setSortModel: (model: GridSortModel | []) => void;
    sortModel: GridSortModel | [];
}

export const ViewDataTableContext = createContext<ViewDataTableContextProps>({ gridColumns: [], setSortModel: () => null, sortModel: [] });
