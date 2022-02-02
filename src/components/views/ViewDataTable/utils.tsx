import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid-pro';

import { COLUMN_TYPE, ZetkinViewColumn } from 'types/views';
import LocalPersonViewCell, {
  LocalPersonParams,
} from './cells/LocalPersonViewCell';
import PersonNotesViewCell, {
  PersonNotesParams,
} from './cells/PersonNotesViewCell';
import SurveyResponseViewCell, {
  SurveyResponseParams,
} from './cells/SurveyResponseViewCell';
import SurveySubmittedViewCell, {
  getNewestSubmission,
  SurveySubmittedParams,
} from './cells/SurveySubmittedViewCell';

export function colIdFromFieldName(colFieldName: string): number {
  // colFieldName is a string like col_10, where 10 is the
  // ID of the view column that this refers to.
  const nameFields = colFieldName.split('_');
  return parseInt(nameFields[1]);
}

/**
 * Maps a ZetkinViewColumn from the view definition in the Zetkin Platform to
 * a GridColDef for rendering the column in the MUI DataGrid.
 */
export function makeGridColDef(
  viewCol: ZetkinViewColumn,
  orgId: number | string
): GridColDef {
  const colDef: GridColDef = {
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
  } else if (viewCol.type == COLUMN_TYPE.PERSON_NOTES) {
    colDef.width = 300;
    colDef.renderCell = (params) => (
      <PersonNotesViewCell params={params as GridRenderCellParams} />
    );
    colDef.valueGetter = (params) => {
      const notes = (params as PersonNotesParams).value;
      return notes?.length ? notes.map((note) => note.text).join(',') : null;
    };
  } else if (viewCol.type == COLUMN_TYPE.LOCAL_PERSON) {
    colDef.minWidth = 50;
    colDef.renderCell = (params) => (
      <LocalPersonViewCell
        orgId={orgId}
        params={params as GridRenderCellParams}
      />
    );
    colDef.valueGetter = (params) => {
      const person = (params as LocalPersonParams).value;
      return person ? `${person.first_name} ${person.last_name}` : null;
    };
  } else if (viewCol.type == COLUMN_TYPE.SURVEY_RESPONSE) {
    colDef.width = 300;
    colDef.type = 'string';
    colDef.renderCell = (params) => (
      <SurveyResponseViewCell params={params as GridRenderCellParams} />
    );
    colDef.valueGetter = (params) => {
      const responses = (params as SurveyResponseParams).value;
      return responses?.length
        ? responses.map((response) => response.text).join(',')
        : null;
    };
  } else if (viewCol.type == COLUMN_TYPE.SURVEY_SUBMITTED) {
    colDef.type = 'date';
    colDef.renderCell = (params) => (
      <SurveySubmittedViewCell params={params as GridRenderCellParams} />
    );
    colDef.valueGetter = (params) => {
      const submissions = (params as SurveySubmittedParams).value;
      return submissions?.length ? getNewestSubmission(submissions) : null;
    };
  }

  return colDef;
}
