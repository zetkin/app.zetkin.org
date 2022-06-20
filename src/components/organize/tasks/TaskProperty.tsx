import { useIntl } from 'react-intl';
import { ListItem, ListItemText } from '@material-ui/core';

interface TaskPropertyProps {
  title: string;
  value?: string | React.ReactNode;
}

const TaskProperty: React.FunctionComponent<TaskPropertyProps> = ({
  title,
  value,
}) => {
  const intl = useIntl();

  return (
    <ListItem divider>
      <ListItemText
        primary={
          value ||
          intl.formatMessage({
            id: 'misc.tasks.forms.common.notSet',
          })
        }
        secondary={title}
      />
    </ListItem>
  );
};

export default TaskProperty;
