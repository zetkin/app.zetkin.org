import { FormattedMessage } from 'react-intl';
import NextLink from 'next/link';
import { Link, ListItem, ListItemText } from '@material-ui/core';

interface TaskPropertyProps {
  title: string;
  value?: string | React.ReactNode;
  url?: boolean;
}

const TaskProperty: React.FunctionComponent<TaskPropertyProps> = ({
  title,
  value,
  url,
}) => {
  const displayValue = !value ? (
    <FormattedMessage id="misc.tasks.forms.common.notSet" />
  ) : url ? (
    <NextLink href={value as string} passHref>
      <Link>{value}</Link>
    </NextLink>
  ) : (
    value
  );
  return (
    <ListItem divider>
      <ListItemText primary={displayValue} secondary={title} />
    </ListItem>
  );
};

export default TaskProperty;
