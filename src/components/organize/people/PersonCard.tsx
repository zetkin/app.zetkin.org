import { useIntl } from 'react-intl';
import ZetkinSection from 'components/ZetkinSection';
import {
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { Close, Edit } from '@material-ui/icons';
import { ReactEventHandler, SyntheticEvent, useState } from 'react';

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
  onClickEdit?: ReactEventHandler;
  titleId: string;
}> = ({ onClickEdit, titleId, children }) => {
  const [editable, setEditable] = useState<boolean>();
  const classes = useStyles();
  const intl = useIntl();
  const title = intl.formatMessage({ id: titleId });

  const onToggleEdit = (evt: SyntheticEvent) => {
    setEditable(!editable);
    if (onClickEdit) onClickEdit(evt);
  };

  return (
    <ZetkinSection title={title}>
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
                primary={intl.formatMessage(
                  {
                    id: `pages.people.person.${
                      editable ? 'editButtonClose' : 'editButton'
                    }`,
                  },
                  { title }
                )}
              />
            </ListItem>
          </List>
        )}
      </Card>
    </ZetkinSection>
  );
};

export default PersonCard;
