import { useState } from 'react';
import { AccessTime, Image as ImageIcon } from '@mui/icons-material';
import { Box, Button, Card, Typography } from '@mui/material';

import useTaskMutations from '../hooks/useTaskMutations';
import { ZetkinTask } from 'features/tasks/components/types';
import ZUIEditableImage from 'zui/ZUIEditableImage';
import ZUIImageSelectDialog from 'zui/ZUIImageSelectDialog';
import ZUIMarkdown from 'zui/ZUIMarkdown';
import ZUISection from 'zui/ZUISection';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

interface TaskPreviewSectionProps {
  task: ZetkinTask;
}

const TaskPreviewSection: React.FC<TaskPreviewSectionProps> = ({ task }) => {
  const messages = useMessages(messageIds);
  const [selecting, setSelecting] = useState(false);

  const { updateTask } = useTaskMutations(task.organization.id, task.id);
  return (
    <ZUISection
      action={
        task.cover_file ? null : (
          <Button
            data-testid="TaskPreviewSection-addImage"
            onClick={() => setSelecting(true)}
            startIcon={<ImageIcon />}
          >
            <Msg id={messageIds.taskPreview.addImage} />
          </Button>
        )
      }
      data-testid="TaskPreviewSection-section"
      title={messages.taskPreview.sectionTitle()}
    >
      <Card>
        {task.cover_file && (
          <ZUIEditableImage
            alt={task.title}
            height={1}
            layout="responsive"
            objectFit="cover"
            onEdit={() => setSelecting(true)}
            onReset={() => {
              updateTask({
                cover_file_id: null,
              });
            }}
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
      <ZUIImageSelectDialog
        onClose={() => setSelecting(false)}
        onSelectFile={(file) => {
          setSelecting(false);
          updateTask({
            cover_file_id: file.id,
          });
        }}
        open={selecting}
      />
    </ZUISection>
  );
};

export default TaskPreviewSection;
