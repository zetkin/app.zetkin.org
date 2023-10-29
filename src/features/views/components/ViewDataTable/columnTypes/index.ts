import { KeyboardEvent } from 'react';
import { GridColDef, MuiEvent } from '@mui/x-data-grid-pro';

import LocalBoolColumnType from './LocalBoolColumnType';
import LocalPersonColumnType from './LocalPersonColumnType';
import LocalQueryColumnType from './LocalQueryColumnType';
import LocalTextColumnType from './LocalTextColumnType';
import OrganizerActionColumnType from './OrganizerActionColumnType';
import PersonTagColumnType from './PersonTagColumnType';
import SimpleColumnType from './SimpleColumnType';
import SurveyOptionColumnType from './SurveyOptionColumnType';
import SurveyOptionsColumnType from './SurveyOptionsColumnType';
import SurveyResponseColumnType from './SurveyResponseColumnType';
import SurveySubmittedColumnType from './SurveySubmittedColumnType';
import { UseViewGridReturn } from 'features/views/hooks/useViewGrid';
import { ZetkinObjectAccess } from 'core/api/types';
import { COLUMN_TYPE, ZetkinViewColumn } from 'features/views/components/types';

export interface IColumnType<
  ColumnType = ZetkinViewColumn,
  CellType = unknown
> {
  cellToString(cell: CellType, column: ColumnType): string;
  getColDef(
    column: ColumnType,
    accessLevel: ZetkinObjectAccess['level'] | null
  ): Omit<GridColDef, 'field'>;
  getSearchableStrings(cell: CellType): string[];
  handleKeyDown?(
    viewGrid: UseViewGridReturn,
    column: ColumnType,
    personId: number,
    data: CellType,
    ev: MuiEvent<KeyboardEvent<HTMLElement>>,
    accessLevel: ZetkinObjectAccess['level'] | null
  ): void;
  processRowUpdate?(
    useViewGrid: UseViewGridReturn,
    colId: number,
    personId: number,
    data: CellType
  ): void;
  renderConfigDialog?(
    column: ColumnType,
    onConfigureColumnCancel: () => void,
    onConfigureColumnSave: (
      id: number,
      config: ZetkinViewColumn['config']
    ) => void
  ): JSX.Element;
}

/**
 * This column type is used for any column that is using a type that this
 * frontend does not yet support, and will just render empty cells.
 */
class UnsupportedColumnType implements IColumnType {
  cellToString(): string {
    return '';
  }

  getColDef(): Omit<GridColDef, 'field'> {
    return { valueGetter: () => '' };
  }

  getSearchableStrings(): string[] {
    return [];
  }
}

/* ============================================================================
 * Getting an error here? READ THIS!
 * ----------------------------------------------------------------------------
 * The columnTypes object contains a mapping between view column type and
 * an object which configures the various aspects of a view column.
 *
 * If you're getting a typescript error here after creating a new view column
 * type, it's probably because you have not yet implemented an object for it.
 *
 * This is intentional! It's easy to forget adding an object here, so we have
 * have implemented this logic in a way that causes typescript to report an
 * error if any of the COLUMN_TYPE values does not have a corresponding class.
 *
 * Copy one of the existing ones, and change it's implementation to handle
 * the value correctly.
 */
const columnTypes: Record<COLUMN_TYPE, IColumnType> = {
  [COLUMN_TYPE.LOCAL_BOOL]: new LocalBoolColumnType(),
  [COLUMN_TYPE.LOCAL_PERSON]: new LocalPersonColumnType(),
  [COLUMN_TYPE.LOCAL_QUERY]: new LocalQueryColumnType(),
  [COLUMN_TYPE.ORGANIZER_ACTION]: new OrganizerActionColumnType(),
  [COLUMN_TYPE.PERSON_FIELD]: new SimpleColumnType(),
  [COLUMN_TYPE.PERSON_QUERY]: new LocalQueryColumnType(),
  [COLUMN_TYPE.PERSON_TAG]: new PersonTagColumnType(),
  [COLUMN_TYPE.SURVEY_OPTION]: new SurveyOptionColumnType(),
  [COLUMN_TYPE.SURVEY_OPTIONS]: new SurveyOptionsColumnType(),
  [COLUMN_TYPE.SURVEY_RESPONSE]: new SurveyResponseColumnType(),
  [COLUMN_TYPE.SURVEY_SUBMITTED]: new SurveySubmittedColumnType(),
  [COLUMN_TYPE.LOCAL_TEXT]: new LocalTextColumnType(),
  [COLUMN_TYPE.UNSUPPORTED]: new UnsupportedColumnType(),
};

export default columnTypes;
