import { TextField } from 'mui-rff';
import { useIntl } from 'react-intl';

import { VISIT_LINK_FIELDS } from '../constants';

const VisitLinkFields = (): JSX.Element => {
    const intl = useIntl();
    return (
        <TextField
            fullWidth
            id="url"
            label={ intl.formatMessage({ id: 'misc.tasks.forms.visitLinkConfig.fields.url' }) }
            margin="normal"
            name={ VISIT_LINK_FIELDS.URL }
        />
    );
};

export default VisitLinkFields;
