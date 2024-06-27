import { AccessTime } from '@mui/icons-material';
import { Box, Card, Typography } from '@mui/material';

import useTaskMutations from '../hooks/useTaskMutations';
import { ZetkinTask } from 'features/tasks/components/types';
import ZUIEditableImage from 'zui/ZUIEditableImage';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import ZUISection from 'zui/ZUISection';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

interface TaskPreviewSectionProps {
  task: ZetkinTask;
}

const TaskPreviewSection: React.FC<TaskPreviewSectionProps> = ({ task }) => {
  const messages = useMessages(messageIds);

  const { updateTask } = useTaskMutations(task.organization.id, task.id);
  return (
    <ZUISection
      data-testid="TaskPreviewSection-section"
      title={messages.taskPreview.sectionTitle()}
    >
      <Card>
        <ZUIEditableImage
          alt={task.title}
          file={task.cover_file}
          height={1}
          layout="responsive"
          objectFit="cover"
          onFileSelect={(file) => {
            updateTask({
              cover_file_id: file?.id ?? null,
            });
          }}
          width={2}
        />
        <Box p={2}>
          <Typography variant="h4">{task.title}</Typography>
          {task.time_estimate !== null && (
            <Typography
              color="textSecondary"
              style={{ display: 'flex', gap: 4, marginTop: 4 }}
              variant="body2"
            >
              <AccessTime fontSize="small" />
              <Msg
                id={messageIds.taskPreview.timeEstimate}
                values={{ minutes: task.time_estimate || 0 }}
              />
            </Typography>
          )}
          <ZUIMarkdown
            BoxProps={{ component: 'div' }}
            markdown={task.instructions}
          />
        </Box>
      </Card>
    </ZUISection>
  );
};

export default TaskPreviewSection;
