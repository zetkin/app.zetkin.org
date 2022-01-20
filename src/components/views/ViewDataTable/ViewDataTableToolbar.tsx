import { useContext } from 'react';
import { Add, Launch, RemoveCircleOutline } from '@material-ui/icons';
import { Box, Button, Slide, Tooltip } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import { ConfirmDialogContext } from 'hooks/ConfirmDialogProvider';

export interface ViewDataTableToolbarProps {
    disabled: boolean;
    isSmartSearch: boolean;
    onColumnCreate: () => void;
    onRowsRemove: () => void;
    onViewCreate: () => void;
    selection: number[];
}

const ViewDataTableToolbar: React.FunctionComponent<ViewDataTableToolbarProps> = ({
    disabled,
    isSmartSearch,
    onColumnCreate,
    onRowsRemove,
    onViewCreate,
    selection,
}) => {
    const intl = useIntl();
    const { showConfirmDialog } = useContext(ConfirmDialogContext);

    const onClickRemoveRows = () =>{
        showConfirmDialog({
            onSubmit: onRowsRemove,
            title: intl.formatMessage({ id: 'misc.views.removeDialog.title' }),
            warningText: intl.formatMessage({ id: 'misc.views.removeDialog.action' }),
        });
    };

    return (
        <Box display="flex" justifyContent="flex-end">
            <Slide direction="left" in={ !!selection.length } timeout={ 150 }>
                <Button
                    data-testid="ViewDataTableToolbar-createFromSelection"
                    disabled={ disabled }
                    onClick={ onViewCreate }
                    startIcon={ <Launch/> }>
                    <FormattedMessage id="misc.views.createFromSelection" />
                </Button>
            </Slide>
            <Slide direction="left" in={ !!selection.length } timeout={ 100 }>
                <Tooltip title={ isSmartSearch ? intl.formatMessage({ id: 'misc.views.removeTooltip' }) : '' }>
                    <span>
                        <Button
                            data-testid="ViewDataTableToolbar-removeFromSelection"
                            disabled={ isSmartSearch || disabled }
                            onClick={ onClickRemoveRows }
                            startIcon={ <RemoveCircleOutline /> }>
                            <FormattedMessage id="misc.views.removeFromSelection" values={{ numSelected: selection.length }} />
                        </Button>
                    </span>
                </Tooltip>
            </Slide>
            <Button
                data-testid="ViewDataTableToolbar-createColumn"
                disabled={ disabled }
                onClick={ onColumnCreate }
                startIcon={ <Add /> }>
                <FormattedMessage id="misc.views.createColumn" />
            </Button>
        </Box>
    );
};

export default ViewDataTableToolbar;
