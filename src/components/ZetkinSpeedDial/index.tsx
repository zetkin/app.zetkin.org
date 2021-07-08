import { DialogContentBaseProps } from './actions/types';
import { makeStyles } from '@material-ui/core';
// import { FormattedMessage as Msg, useIntl } from 'react-intl';
import React, { useEffect, useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';

import ZetkinDialog from '../ZetkinDialog';

import { ACTIONS } from './constants';
import { SpeedDialActionConfig } from './actions/types';

const useStyles = makeStyles((theme) => ({
    expandButton: {
        textDecoration: 'underline',
        textTransform: 'none',
    },
    speedDial: {
        bottom: theme.spacing(4),
        position: 'fixed',
        right: theme.spacing(4),
    },
}));


// Set the dialogs display state to false
const allDialogsClosed = (actions: Array<ACTIONS>) => (
    actions.reduce((acc,action) => {
        return {
            [action]: false,
            ...acc,
        };
    }, {})
);

interface ZetkinSpeedDialProps {
    actions: Array<ACTIONS>;
}

const ZetkinSpeedDial: React.FunctionComponent<ZetkinSpeedDialProps> = ({ actions }) => {
    const classes = useStyles();

    const [speedDialOpen, setSpeedDialOpen ] = useState<boolean>(false);
    const [actionConfigs, setActionConfigs] = useState<{
        [key in ACTIONS]?: {
            DialogContent: React.FunctionComponent<DialogContentBaseProps>;
            config: SpeedDialActionConfig;
        }
    }>({});
    const [dialogsOpenState, setDialogsOpenState] = useState<{[key: string]: boolean}>({});

    useEffect(() => {
        // Import the specified actions
        if (actions) {
            const importActions = async () => {
                const importedActions = await  actions.reduce(async (acc, action) => {
                    const { actionConfig, DialogContent } = await import(`./actions/${action}.tsx`);
                    return {
                        ...acc,
                        [actionConfig.key]: {
                            DialogContent,
                            config: actionConfig,
                        },
                    };
                }, {});
                setActionConfigs(importedActions);
            };
            importActions();
            setDialogsOpenState(allDialogsClosed(actions));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (Object.keys(actionConfigs).length === 0) return null;

    return (
        <>
            <SpeedDial
                ariaLabel="SpeedDial example"
                className={ classes.speedDial }
                icon={ <SpeedDialIcon /> }
                onClose={ () => {
                    setSpeedDialOpen(false);
                } }
                onOpen={ () => {
                    setSpeedDialOpen(true);
                } }
                open={ speedDialOpen }>
                { Object.values(actionConfigs).map(({ config: action }) => {
                    return (
                        <SpeedDialAction
                            key={ action.key }
                            icon={ action.icon }
                            // Open actions dialog
                            onClick={ () => {
                            // Close open dialogs
                                setDialogsOpenState(allDialogsClosed(actions));
                                // Open the selected dialog
                                setDialogsOpenState({
                                    ...dialogsOpenState,
                                    [action.key]: true,
                                });
                            } }
                            tooltipTitle={ action.name }
                        />
                    );
                }) }
            </SpeedDial>
            { Object.values(actionConfigs).map(({ config: action, DialogContent }) => {
                return (
                    <ZetkinDialog
                        key={ action.key }
                        onClose={ () => {
                            setDialogsOpenState(allDialogsClosed(actions));
                        } }
                        open={ dialogsOpenState[action.key] === true }>
                        <DialogContent closeDialog={ () => {
                            setDialogsOpenState(allDialogsClosed(actions));
                        } }
                        />
                    </ZetkinDialog>
                );

            }) }

        </>
    );
};

export default ZetkinSpeedDial;

