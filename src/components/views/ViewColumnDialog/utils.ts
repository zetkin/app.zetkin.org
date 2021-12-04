import {
    COLUMN_TYPE,
    PendingZetkinViewColumn,
    PersonQueryViewColumn,
    PersonTagViewColumn,
    SurveyResponseViewColumn,
    ZetkinViewColumn,
} from 'types/views';


export function getDefaultViewColumnConfig(type : COLUMN_TYPE) : ZetkinViewColumn['config'] {
    if (type === COLUMN_TYPE.PERSON_FIELD) {
        return {
            field: 'email',
        };
    }
    else {
        return {};
    }
}

export function isColumnConfigValid(column: PendingZetkinViewColumn | ZetkinViewColumn) : boolean {
    if (column.type === COLUMN_TYPE.PERSON_QUERY) {
        const typedConfig = column.config as PersonQueryViewColumn['config'];
        return !!typedConfig.query_id;
    }
    else if (column.type === COLUMN_TYPE.PERSON_TAG) {
        const typedConfig = column.config as PersonTagViewColumn['config'];
        return !!typedConfig.tag_id;
    }
    else if (column.type === COLUMN_TYPE.SURVEY_RESPONSE) {
        const typedConfig = column.config as SurveyResponseViewColumn['config'];
        return !!typedConfig.question_id;
    }
    else {
        return true;
    }
}
