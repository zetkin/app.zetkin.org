import { GridColDef } from '@mui/x-data-grid-pro';

import { COLUMN_TYPE, ZetkinViewColumn } from 'types/views';
import PersonNotesViewCell, { PersonNotesViewCellParams } from './cells/PersonNotesViewCell';


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

    const boolTypes = [
        COLUMN_TYPE.LOCAL_BOOL,
        COLUMN_TYPE.PERSON_QUERY,
        COLUMN_TYPE.PERSON_TAG,
    ];

    if (boolTypes.includes(viewCol.type)) {
        colDef.type = 'boolean';
        colDef.minWidth = 50;
        colDef.width = 100;
    }
    else if (viewCol.type == COLUMN_TYPE.PERSON_NOTES) {
        colDef.width = 300;
        colDef.renderCell = (params) => (
            <PersonNotesViewCell params={ params as PersonNotesViewCellParams }/>
        );
    }

    return colDef;
}
