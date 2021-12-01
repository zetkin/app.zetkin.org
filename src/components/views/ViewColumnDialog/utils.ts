import {
    COLUMN_TYPE,
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

export function isColumnConfigValid(type : COLUMN_TYPE, config : ZetkinViewColumn['config']) : boolean {
    if (type === COLUMN_TYPE.PERSON_QUERY) {
        const typedConfig = config as PersonQueryViewColumn['config'];
        return !!typedConfig.query_id;
    }
    else if (type === COLUMN_TYPE.PERSON_TAG) {
        const typedConfig = config as PersonTagViewColumn['config'];
        return !!typedConfig.tag_id;
    }
    else if (type === COLUMN_TYPE.SURVEY_RESPONSE) {
        const typedConfig = config as SurveyResponseViewColumn['config'];
        return !!typedConfig.question_id;
    }
    else {
        return true;
    }
}
