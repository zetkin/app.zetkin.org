import { GridColDef } from '@mui/x-data-grid-pro';

import { ZetkinViewColumn } from 'types/views';


export function colIdFromFieldName(colFieldName : string) : number {
    // colFieldName is a string like col_10, where 10 is the
    // ID of the view column that this refers to.
    const nameFields = colFieldName.split('_');
    return parseInt(nameFields[1]);
}

export function makeGridColDef(viewCol: ZetkinViewColumn) : GridColDef {
    const colDef : GridColDef = {
        field: `col_${viewCol.id}`,
        headerName: viewCol.title,
        minWidth: 100,
        resizable: true,
        sortable: true,
        width: 150,
    };

    return colDef;
}
