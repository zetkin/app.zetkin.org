import { FormattedMessage } from 'react-intl';
import { ListItem, ListItemText } from '@material-ui/core';

import theme from 'theme';

interface TaskPropertyProps {
  title: string;
  value?: string | React.ReactNode;
}

const TaskProperty: React.FunctionComponent<TaskPropertyProps> = ({
  title,
  value,
}) => {
  return (
    <ListItem divider>
      <ListItemText
        primary={
          value || (
            <span style={{ color: theme.palette.error.main }}>
              <FormattedMessage id="misc.tasks.forms.common.notSet" />
            </span>
          )
        }
        secondary={title}
      />
    </ListItem>
  );
};

export default TaskProperty;
