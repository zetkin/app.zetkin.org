import { COLUMN_TYPE, PersonQueryViewColumnConfig, ViewColumnConfig } from 'types/views';


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
    else {
        return true;
    }
}
