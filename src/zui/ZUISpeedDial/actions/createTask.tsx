import { CheckBox } from '@mui/icons-material';
import { useRouter } from 'next/router';

import TaskDetailsForm from 'features/tasks/components/TaskDetailsForm';
import { ZetkinTaskRequestBody } from 'features/tasks/components/types';

import { ACTIONS } from '../constants';
import { ActionConfig, DialogContentBaseProps } from './types';

import useCreateTask from 'features/tasks/hooks/useCreateTask';

const DialogContent: React.FunctionComponent<DialogContentBaseProps> = ({
  closeDialog,
}) => {
  const router = useRouter();
  const { campId, orgId } = router.query as { campId: string; orgId: string };

  const createTask = useCreateTask(parseInt(orgId as string));
  //createTask function in hook async,
  const handleFormSubmit = async (task: ZetkinTaskRequestBody) => {
    // Set defaults for config and target_filters
    const body: ZetkinTaskRequestBody = {
      ...task,
      target_filters: [],
    };
    const newTask = await createTask(body);
    closeDialog();
    // Redirect to task page
    router.push(
      `/organize/${orgId}/projects/${campId}/calendar/tasks/${newTask.id}`
    );
  };

  return <TaskDetailsForm onCancel={closeDialog} onSubmit={handleFormSubmit} />;
};

const config = {
  icon: <CheckBox />,
  key: ACTIONS.CREATE_TASK,
  name: 'misc.tasks.forms.createTask.title',
  urlKey: 'create-task',
} as ActionConfig;

export { config, DialogContent };
