import { Alert } from '@mui/material';
import { CheckBox } from '@mui/icons-material';
import { useRouter } from 'next/router';

import TaskDetailsForm from 'features/tasks/components/TaskDetailsForm';
import { ZetkinTaskRequestBody } from 'features/tasks/components/types';

import { ACTIONS } from '../constants';
import { Msg } from 'core/i18n';
import { tasksResource } from 'features/tasks/api/tasks';
import { ActionConfig, DialogContentBaseProps } from './types';

import messageIds from 'zui/l10n/messageIds';

const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({
  closeDialog,
}) => {
  const router = useRouter();
  const { campId, orgId } = router.query as { campId: string; orgId: string };

  const { useCreate: useCreateTask } = tasksResource(orgId);
  const { mutateAsync: sendTaskRequest, isError } = useCreateTask();

  const handleFormSubmit = async (task: ZetkinTaskRequestBody) => {
    // Set defaults for config and target_filters
    const body: ZetkinTaskRequestBody = {
      ...task,
      target_filters: [],
    };
    await sendTaskRequest(body, {
      onSuccess: async (newTask) => {
        closeDialog();
        // Redirect to task page
        router.push(
          `/organize/${orgId}/campaigns/${campId}/calendar/tasks/${newTask.id}`
        );
      },
    });
  };

  return (
    <>
      {isError && (
        <Alert color="error" data-testid="error-alert">
          <Msg id={messageIds.speedDial.requestError} />
        </Alert>
      )}
      <TaskDetailsForm onCancel={closeDialog} onSubmit={handleFormSubmit} />
    </>
  );
};

const config = {
  icon: <CheckBox />,
  key: ACTIONS.CREATE_TASK,
  name: 'misc.tasks.forms.createTask.title',
  urlKey: 'create-task',
} as ActionConfig;

export { config, DialogContent };
