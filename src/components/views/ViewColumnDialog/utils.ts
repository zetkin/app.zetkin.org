import { COLUMN_TYPE, ViewColumnConfig } from 'types/views';


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
