import { useState } from 'react';
import { AccessTime, Image as ImageIcon } from '@material-ui/icons';
import { Box, Button, Card, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import ImageSelectDialog from 'components/ImageSelectDialog';
import Markdown from 'components/Markdown';
import { taskResource } from 'api/tasks';
import ZetkinEditableImage from 'components/ZetkinEditableImage';
import ZetkinSection from 'components/ZetkinSection';
import { ZetkinTask } from 'types/tasks';

interface TaskPreviewSectionProps {
  task: ZetkinTask;
}

const TaskPreviewSection: React.FC<TaskPreviewSectionProps> = ({ task }) => {
  const intl = useIntl();
  const [selecting, setSelecting] = useState(false);

  const taskMutation = taskResource(
    task.organization.id.toString(),
    task.id.toString()
  ).useUpdate();

  return (
    <ZetkinSection
      action={
        task.cover_file ? null : (
          <Button
            data-testid="TaskPreviewSection-addImage"
            onClick={() => setSelecting(true)}
            startIcon={<ImageIcon />}
          >
            <FormattedMessage id={'misc.tasks.taskPreview.addImage'} />
          </Button>
        )
      }
      data-testid="TaskPreviewSection-section"
      title={intl.formatMessage({ id: 'misc.tasks.taskPreview.sectionTitle' })}
    >
      <Card>
        {task.cover_file && (
          <ZetkinEditableImage
            alt={task.title}
            height={1}
            layout="responsive"
            objectFit="cover"
            onEdit={() => setSelecting(true)}
            onReset={() => {
              taskMutation.mutate({
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
              <FormattedMessage
                id="misc.tasks.taskPreview.timeEstimate"
                values={{ minutes: task.time_estimate }}
              />
            </Typography>
          )}
          <Markdown
            BoxProps={{ component: 'div' }}
            markdown={task.instructions}
          />
        </Box>
      </Card>
      <ImageSelectDialog
        onClose={() => setSelecting(false)}
        onSelectFile={(file) => {
          setSelecting(false);
          taskMutation.mutate({
            cover_file_id: file.id,
          });
        }}
        open={selecting}
      />
    </ZetkinSection>
  );
};

export default TaskPreviewSection;
