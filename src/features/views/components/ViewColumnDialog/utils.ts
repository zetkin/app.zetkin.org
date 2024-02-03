import {
  COLUMN_TYPE,
  PendingZetkinViewColumn,
  PersonFieldViewColumn,
  PersonQueryViewColumn,
  PersonTagViewColumn,
  SurveyResponseViewColumn,
  ZetkinViewColumn,
} from 'features/views/components/types';

export function isColumnConfigValid(
  column: PendingZetkinViewColumn | ZetkinViewColumn
): boolean {
  if (column.type === COLUMN_TYPE.PERSON_FIELD) {
    const typedConfig = column.config as PersonFieldViewColumn['config'];
    return !!typedConfig.field;
  }
  if (column.type === COLUMN_TYPE.PERSON_QUERY) {
    const typedConfig = column.config as PersonQueryViewColumn['config'];
    return !!typedConfig.query_id;
  } else if (column.type === COLUMN_TYPE.PERSON_TAG) {
    const typedConfig = column.config as PersonTagViewColumn['config'];
    return !!typedConfig.tag_id;
  } else if (column.type === COLUMN_TYPE.SURVEY_RESPONSE) {
    const typedConfig = column.config as SurveyResponseViewColumn['config'];
    return !!typedConfig.question_id;
  } else {
    return true;
  }
}
