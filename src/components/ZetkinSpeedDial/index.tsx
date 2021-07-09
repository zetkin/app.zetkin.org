/* eslint-disable react-hooks/exhaustive-deps */
import { Action } from './actions/types';
import { makeStyles } from '@material-ui/core';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
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

type DialogsOpenState = {[key in ACTIONS]?: boolean};

interface ZetkinSpeedDialProps {
    actions: Array<ACTIONS>;
}

const ZetkinSpeedDial: React.FunctionComponent<ZetkinSpeedDialProps> = ({ actions: actionKeys }) => {
    const classes = useStyles();
    const intl = useIntl();
    const router = useRouter();

    const [speedDialOpen, setSpeedDialOpen ] = useState<boolean>(false);
    const [actions, setActions] = useState<Action[]>([]);
    const [dialogsOpenState, setDialogsOpenState] = useState<DialogsOpenState>({});

    // Set the dialogs display state to false
    const closeAllDialogs = () => {
        const closedDialogsState = actionKeys.reduce((acc: DialogsOpenState, actionKey) => {
            return {
                [actionKey]: false,
                ...acc,
            };
        }, {});
        setDialogsOpenState(closedDialogsState);
        // Set dialog state closed
        const lastRouteItem = router.asPath.split('/').pop();
        if (lastRouteItem?.includes('#')) {
            const [baseRoute, dialogId] = router.asPath.split('#');
            if (dialogId) {
                router.push(baseRoute, undefined, { shallow: true });
            }
        }
    };

    useEffect(() => {
        // Import the actions specified in props
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
            closeAllDialogs();
        }
    }, []);

    // useEffect(() => {
    //     const current = router.asPath.split('/').pop();
    //     if (current?.includes('#new_campaign')) {
    //         setFormDialogOpen('campaign');
    //     }
    //     else if (current?.includes('#new_event')) {
    //         setFormDialogOpen('event');
    //     }
    // }, [router.asPath]);

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
                                closeAllDialogs();
                                // Open the selected dialog
                                setDialogsOpenState({
                                    ...dialogsOpenState,
                                    [action.key]: true,
                                });
                                // Set URL
                                router.push(`${router.asPath}#${action.urlKey}`, undefined, { shallow: true });
                            } }
                            tooltipTitle={ intl.formatMessage({ id: action.name }) }
                        />
                    );
                }) }
            </SpeedDial>
            { actions.map(({ config: action, DialogContent }) => {
                return (
                    <ZetkinDialog
                        key={ action.key }
                        onClose={ () => {
                            closeAllDialogs();
                        } }
                        open={ dialogsOpenState[action.key] === true }
                        title={ intl.formatMessage({ id: action.name }) }>
                        <DialogContent closeDialog={ () => {
                            closeAllDialogs();
                        } }
                        />
                    </ZetkinDialog>
                );

            }) }

        </>
    );
};

export default ZetkinSpeedDial;

export { ACTIONS };
