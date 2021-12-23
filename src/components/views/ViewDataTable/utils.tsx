import { GridColDef } from '@mui/x-data-grid-pro';

import { COLUMN_TYPE, ZetkinViewColumn } from 'types/views';
import LocalPersonViewCell, { LocalPersonViewCellParams } from './cells/LocalPersonViewCell';
import PersonNotesViewCell, { PersonNotesViewCellParams } from './cells/PersonNotesViewCell';
import SurveyResponseViewCell, { SurveyResponseViewCellParams } from './cells/SurveyResponseViewCell';
import SurveySubmittedViewCell, { SurveySubmittedViewCellParams } from './cells/SurveySubmittedViewCell';


export function colIdFromFieldName(colFieldName : string) : number {
    // colFieldName is a string like col_10, where 10 is the
    // ID of the view column that this refers to.
    const nameFields = colFieldName.split('_');
    return parseInt(nameFields[1]);
}

export function makeGridColDef(viewCol: ZetkinViewColumn, orgId: number | string) : GridColDef {
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
    else if (viewCol.type == COLUMN_TYPE.LOCAL_PERSON) {
        colDef.minWidth = 50;
        colDef.renderCell = (params) => (
            <LocalPersonViewCell orgId={ orgId } params={ params as LocalPersonViewCellParams }/>
        );
    }
    else if (viewCol.type == COLUMN_TYPE.SURVEY_RESPONSE) {
        colDef.width = 300;
        colDef.renderCell = (params) => (
            <SurveyResponseViewCell params={ params as SurveyResponseViewCellParams }/>
        );
    }
    else if (viewCol.type == COLUMN_TYPE.SURVEY_SUBMITTED) {
        colDef.renderCell = (params) => (
            <SurveySubmittedViewCell params={ params as SurveySubmittedViewCellParams }/>
        );
    }

    return colDef;
}
