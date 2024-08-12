import NextLink from 'next/link';
import { Link, ListItem, ListItemText } from '@mui/material';

import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

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
    <Msg id={messageIds.common.notSet} />
  ) : url ? (
    <NextLink href={value as string} legacyBehavior passHref>
      <Link underline="hover">{value}</Link>
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
