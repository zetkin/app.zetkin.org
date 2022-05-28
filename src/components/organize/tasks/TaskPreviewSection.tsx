import { AccessTime } from '@material-ui/icons';
import Image from 'next/image';
import { marked } from 'marked';
import { Box, Card, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import ZetkinSection from 'components/ZetkinSection';
import { ZetkinTask } from 'types/tasks';

interface TaskPreviewSectionProps {
  task: ZetkinTask;
}

const TaskPreviewSection: React.FC<TaskPreviewSectionProps> = ({ task }) => {
  const intl = useIntl();

  return (
    <ZetkinSection
      title={intl.formatMessage({ id: 'misc.tasks.taskPreview.sectionTitle' })}
    >
      <Card>
        {task.cover_file && (
          <Image
            alt={task.title}
            height={1}
            layout="responsive"
            objectFit="cover"
            src={task.cover_file.url}
            width={2}
          />
        )}
        <Box p={2}>
          <Typography variant="h4">{task.title}</Typography>
          {task.time_estimate !== null && (
            <Typography
              color="textSecondary"
              style={{ display: 'flex', gap: 4, marginTop: 4 }}
              variant="body2"
            >
              <AccessTime fontSize="small" />
              <FormattedMessage
                id="misc.tasks.taskPreview.timeEstimate"
                values={{ minutes: task.time_estimate }}
              />
            </Typography>
          )}
          <Typography
            component="div"
            dangerouslySetInnerHTML={{ __html: marked(task.instructions) }}
          />
        </Box>
      </Card>
    </ZetkinSection>
  );
};

export default TaskPreviewSection;
