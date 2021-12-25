import { Box } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';

import { MUIOnlyPersonSelect as PersonSelect } from 'components/forms/common/PersonSelect';
import { useIntl } from 'react-intl';
import { ZetkinPerson } from 'types/zetkin';


export interface ViewDataTableFooterProps {
    onRowAdd: (person: ZetkinPerson) => void;
}

const ViewDataTableFooter: FunctionComponent<ViewDataTableFooterProps> = ({ onRowAdd }) => {
    const intl = useIntl();
    const [key, setKey] = useState(1);

    return (
        <Box p={ 1 }>
            <PersonSelect
                key={ key }
                name="person"
                onChange={ person => {
                    onRowAdd(person);

                    // Change the key to force the PersonSelect to reset
                    setKey(key + 1);
                } }
                placeholder={ intl.formatMessage({ id: 'misc.views.footer.addPlaceholder' }) }
                selectedPerson={ null }
            />
        </Box>
    );
};

export default ViewDataTableFooter;
