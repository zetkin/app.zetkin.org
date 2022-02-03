import { Alert } from '@material-ui/lab';
import { CheckBox } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';

import TaskDetailsForm from 'components/forms/TaskDetailsForm';
import { ZetkinTaskRequestBody } from 'types/tasks';

import { ACTIONS } from '../constants';
import { tasksResource } from 'api/tasks';
import { ActionConfig, DialogContentBaseProps } from './types';

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
          <FormattedMessage id="misc.formDialog.requestError" />
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
