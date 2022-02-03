import { useIntl } from 'react-intl';
import { Box, Typography } from '@material-ui/core';

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
    <Box mt={2}>
      <Typography variant="subtitle2">{title}</Typography>
      <Typography color={value ? 'inherit' : 'error'} variant="body1">
        {value ||
          intl.formatMessage({
            id: 'misc.tasks.forms.common.notSet',
          })}
      </Typography>
    </Box>
  );
};

export default TaskProperty;
