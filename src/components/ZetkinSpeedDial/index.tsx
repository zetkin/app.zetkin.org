import { makeStyles } from '@material-ui/core';
// import { FormattedMessage as Msg, useIntl } from 'react-intl';
import { Action } from './actions/types';
import React, { useEffect, useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@material-ui/lab';

import ZetkinDialog from '../ZetkinDialog';

import { ACTIONS } from './constants';

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
const allDialogsClosed = (actionKeys: Array<ACTIONS>) => (
    actionKeys.reduce((acc, actionKey) => {
        return {
            [actionKey]: false,
            ...acc,
        };
    }, {})
);

type DialogsOpenState = {[key in ACTIONS]?: boolean};

interface ZetkinSpeedDialProps {
    actions: Array<ACTIONS>;
}

const ZetkinSpeedDial: React.FunctionComponent<ZetkinSpeedDialProps> = ({ actions: actionKeys }) => {
    const classes = useStyles();

    const [speedDialOpen, setSpeedDialOpen ] = useState<boolean>(false);
    const [actions, setActions] = useState<Action[]>([]);
    const [dialogsOpenState, setDialogsOpenState] = useState<DialogsOpenState>({});

    useEffect(() => {
        // Import the specified actions
        if (actionKeys) {
            const importActions = async () => {
                const importedActions = await Promise.all(actionKeys.map(async (action) => {
                    const { config, DialogContent }: Action = await import(`./actions/${action}.tsx`);
                    return {
                        DialogContent, config,
                    };
                }));
                setActions(importedActions);
            };
            importActions();
            setDialogsOpenState(allDialogsClosed(actionKeys));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                { actions.map(({ config: action }) => {
                    return (
                        <SpeedDialAction
                            key={ action.key }
                            icon={ action.icon }
                            // Open actions dialog
                            onClick={ () => {
                            // Close open dialogs
                                setDialogsOpenState(allDialogsClosed(actionKeys));
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
            { actions.map(({ config: action, DialogContent }) => {
                return (
                    <ZetkinDialog
                        key={ action.key }
                        onClose={ () => {
                            setDialogsOpenState(allDialogsClosed(actionKeys));
                        } }
                        open={ dialogsOpenState[action.key] === true }>
                        <DialogContent closeDialog={ () => {
                            setDialogsOpenState(allDialogsClosed(actionKeys));
                        } }
                        />
                    </ZetkinDialog>
                );

            }) }

        </>
    );
};

export default ZetkinSpeedDial;

