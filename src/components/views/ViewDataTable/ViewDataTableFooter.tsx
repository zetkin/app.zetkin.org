import { Box } from '@material-ui/core';
import { FunctionComponent, useRef } from 'react';

import { MUIOnlyPersonSelect as PersonSelect } from 'components/forms/common/PersonSelect';
import { useIntl } from 'react-intl';
import { ZetkinPerson } from 'types/zetkin';


export interface ViewDataTableFooterProps {
    onRowAdd: (person: ZetkinPerson) => void;
}

const ViewDataTableFooter: FunctionComponent<ViewDataTableFooterProps> = ({ onRowAdd }) => {
    const intl = useIntl();
    const selectInputRef = useRef<HTMLInputElement>();

    return (
        <Box p={ 1 }>
            <PersonSelect
                inputRef={ selectInputRef }
                name="person"
                onChange={ person => {
                    onRowAdd(person);

                    // Blur and re-focus input to reset, so that user can type again to
                    // add another person, without taking their hands off the keyboard.
                    selectInputRef?.current?.blur();
                    selectInputRef?.current?.focus();
                } }
                placeholder={ intl.formatMessage({ id: 'misc.views.footer.addPlaceholder' }) }
                selectedPerson={ null }
            />
        </Box>
    );
};

export default ViewDataTableFooter;
