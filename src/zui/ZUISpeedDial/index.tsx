import { Action } from './actions/types';
import makeStyles from '@mui/styles/makeStyles';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';

import ZUIDialog from '../ZUIDialog';

import { ACTIONS } from './constants';
import { useMessages } from 'core/i18n';

import messageIds from 'zui/l10n/messageIds';

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

type DialogsOpenState = { [key in ACTIONS]?: boolean };

interface ZUISpeedDialProps {
  actions: Array<ACTIONS>;
}

const ZUISpeedDial: React.FunctionComponent<ZUISpeedDialProps> = ({
  actions: actionKeys,
}) => {
  const messages = useMessages(messageIds);
  const classes = useStyles();
  const router = useRouter();

  const [speedDialOpen, setSpeedDialOpen] = useState<boolean>(false);
  const [actions, setActions] = useState<Action[]>([]);
  const [dialogsOpenState, setDialogsOpenState] = useState<DialogsOpenState>(
    {}
  );

  const closeAllDialogs = () => {
    const closedDialogsState = actionKeys.reduce(
      (acc: DialogsOpenState, actionKey) => {
        return {
          [actionKey]: false,
          ...acc,
        };
      },
      {}
    );
    setDialogsOpenState(closedDialogsState);
  };

  const cleanUrl = () => {
    // Set URL to dialog closed
    const current = router.asPath.split('/').pop();
    if (current?.includes('#')) {
      // Assumes there is only one # in route
      const [baseRoute] = router.asPath.split('#');
      router.push(baseRoute, undefined, { shallow: true });
    }
  };

  useEffect(() => {
    // Import the actions specified in props
    if (actionKeys) {
      const importActions = async () => {
        const importedActions = await Promise.all(
          actionKeys.map(async (action) => {
            const { config, DialogContent }: Action = await import(
              `./actions/${action}.tsx`
            );
            return {
              DialogContent,
              config,
            };
          })
        );
        setActions(importedActions);
      };
      importActions();
      closeAllDialogs();
    }
  }, []);

  useEffect(() => {
    // Set dialog open if #<action> in path
    if (actions) {
      const current = router.asPath.split('/').pop();
      if (current?.includes('#')) {
        const [, dialogUrlKey] = current.split('#');
        // Get action for key
        const action = actions.find(
          (action) => action.config.urlKey === dialogUrlKey
        );
        // If action in url not open, set open
        if (action && dialogsOpenState[action?.config.key] === false) {
          setDialogsOpenState({
            ...dialogsOpenState,
            [action.config.key]: true,
          });
        }
      }
    }
  }, [actions, router.asPath]);

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={() => {
          setSpeedDialOpen(false);
        }}
        onOpen={() => {
          setSpeedDialOpen(true);
        }}
        open={speedDialOpen}
      >
        {actions.map(({ config: action }) => {
          return (
            <SpeedDialAction
              key={action.key}
              icon={action.icon}
              // Open actions dialog
              onClick={() => {
                // Close open dialogs
                closeAllDialogs();
                // Open the selected dialog
                setDialogsOpenState({
                  ...dialogsOpenState,
                  [action.key]: true,
                });
                // Set URL to dialog open
                router.push(`${router.asPath}#${action.urlKey}`, undefined, {
                  shallow: true,
                });
              }}
              tooltipTitle={messages.speedDial[action.key]()}
            />
          );
        })}
      </SpeedDial>
      {actions.map(({ config: action, DialogContent }) => {
        return (
          <ZUIDialog
            key={action.key}
            onClose={() => {
              cleanUrl();
              closeAllDialogs();
            }}
            open={dialogsOpenState[action.key] === true}
            title={messages.speedDial[action.key]()}
          >
            <DialogContent
              closeDialog={() => {
                cleanUrl();
                closeAllDialogs();
              }}
            />
          </ZUIDialog>
        );
      })}
    </>
  );
};

export default ZUISpeedDial;

export { ACTIONS };
