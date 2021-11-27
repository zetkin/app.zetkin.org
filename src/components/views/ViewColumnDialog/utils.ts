import {
    COLUMN_TYPE,
    PersonQueryViewColumnConfig,
    PersonTagViewColumnConfig,
    SurveyResponseViewColumnConfig,
    ViewColumnConfig,
} from 'types/views';


export function getDefaultViewColumnConfig(type : COLUMN_TYPE) : ViewColumnConfig {
    if (type === COLUMN_TYPE.PERSON_FIELD) {
        return {
            field: 'email',
        };
    }
    else {
        return {};
    }
}

export function isColumnConfigValid(type : COLUMN_TYPE, config : ViewColumnConfig) : boolean {
    if (type === COLUMN_TYPE.PERSON_QUERY) {
        const typedConfig = config as PersonQueryViewColumnConfig;
        return !!typedConfig.query_id;
    }
    else if (type === COLUMN_TYPE.PERSON_TAG) {
        const typedConfig = config as PersonTagViewColumnConfig;
        return !!typedConfig.tag_id;
    }
    else if (type === COLUMN_TYPE.SURVEY_RESPONSE) {
        const typedConfig = config as SurveyResponseViewColumnConfig;
        return !!typedConfig.question_id;
    }
    else {
        return true;
    }
}
