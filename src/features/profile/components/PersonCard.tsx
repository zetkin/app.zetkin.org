import makeStyles from '@mui/styles/makeStyles';
import {
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { Close, Edit } from '@mui/icons-material';
import { ReactEventHandler, SyntheticEvent, useState } from 'react';

import { useMessages } from 'core/i18n';
import ZUISection from 'zui/ZUISection';
import messageIds from '../l10n/messageIds';

const useStyles = makeStyles((theme) => ({
  divider: {
    marginLeft: 72,
  },
  editButton: {
    '& span': {
      fontWeight: 'bold',
    },
    color: theme.palette.primary.main,
    textTransform: 'uppercase',
  },
  title: {
    marginBottom: theme.spacing(1),
  },
}));

const PersonCard: React.FunctionComponent<{
  children: React.ReactNode;
  onClickEdit?: ReactEventHandler;
  title: string;
}> = ({ onClickEdit, title, children }) => {
  const [editable, setEditable] = useState<boolean>();
  const classes = useStyles();
  const messages = useMessages(messageIds);

  const onToggleEdit = (evt: SyntheticEvent) => {
    setEditable(!editable);
    if (onClickEdit) {
      onClickEdit(evt);
    }
  };

  return (
    <ZUISection title={title}>
      <Card>
        {children}
        {onClickEdit && (
          <List disablePadding>
            <ListItem button disabled={!onClickEdit} onClick={onToggleEdit}>
              <ListItemIcon>
                {editable ? (
                  <Close color="primary" />
                ) : (
                  <Edit color="primary" />
                )}
              </ListItemIcon>
              <ListItemText
                className={classes.editButton}
                primary={
                  editable
                    ? messages.editButtonClose({ title })
                    : messages.editButton({ title })
                }
              />
            </ListItem>
          </List>
        )}
      </Card>
    </ZUISection>
  );
};

export default PersonCard;
