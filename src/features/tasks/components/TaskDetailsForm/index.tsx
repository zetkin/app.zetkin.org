import dayjs from 'dayjs';
import { Form } from 'react-final-form';
import { MenuItem } from '@mui/material';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import utc from 'dayjs/plugin/utc';
import validator from 'validator';
import { DateTimePicker, TextField } from 'mui-rff';

import getCampaigns from 'features/campaigns/fetching/getCampaigns';
import { ZetkinTask } from 'utils/types/zetkin';
import {
  AnyTaskTypeConfig,
  NewTaskValues,
  TASK_TYPE,
  VisitLinkConfig,
  ZetkinTaskRequestBody,
} from 'features/tasks/components/types';
import getTaskStatus, { TASK_STATUS } from 'features/tasks/utils/getTaskStatus';
import { Msg, useMessages } from 'core/i18n';

import CollectDemographicsFields from './fields/CollectDemographicsFields';
import ReassignFields from './fields/ReassignFields';
import ShareLinkFields from './fields/ShareLinkFields';
import TimeEstimateField from './fields/TimeEstimateField';
import VisitLinkFields from './fields/VisitLinkFields';

import ZUISubmitCancelButtons from '../../../../zui/ZUISubmitCancelButtons';
import {
  configForTaskType,
  isDeadlineSecond,
  isExpiresThird,
  isPublishedFirst,
} from './utils';
import {
  DEFAULT_REASSIGN_INTERVAL,
  DEFAULT_TIME_ESTIMATE,
  TASK_DETAILS_FIELDS,
} from './constants';

import messageIds from 'features/tasks/l10n/messageIds';

dayjs.extend(utc);

interface TaskDetailsFormProps {
  onSubmit: (task: ZetkinTaskRequestBody) => void;
  onCancel: () => void;
  task?: ZetkinTask;
}

const TaskDetailsForm = ({
  onSubmit,
  onCancel,
  task,
}: TaskDetailsFormProps): JSX.Element => {
  const messages = useMessages(messageIds);
  const router = useRouter();
  const { campId, orgId } = router.query as { campId: string; orgId: string };
  const { data: campaigns } = useQuery(
    ['campaigns', orgId],
    getCampaigns(orgId)
  );
  const taskStatus = task ? getTaskStatus(task) : null;

  const validate = (values: NewTaskValues) => {
    const errors: Record<string, string | Record<string, string>> = {};
    if (!values.title) {
      errors.title = messages.form.required();
    }
    if (!values.type) {
      errors.type = messages.form.required();
    }
    if (!values.instructions) {
      errors.intructions = messages.form.required();
    }
    if (!values.campaign_id) {
      errors.campaign_id = messages.form.required();
    }
    if (
      values.type === TASK_TYPE.VISIT_LINK ||
      values.type === TASK_TYPE.SHARE_LINK
    ) {
      const config = values.config as VisitLinkConfig;
      errors.config = {};
      if (!config?.url) {
        errors.config.url = messages.form.required();
      } else if (!validator.isURL(config.url, { require_protocol: true })) {
        errors.config.url = messages.form.invalidUrl();
      }
    }

    // Validate dates are in correct order
    if (!isPublishedFirst(values)) {
      errors.published =
        messages.form.fields.timeValidationErrors.publishedNotFirst();
    }
    if (!isDeadlineSecond(values)) {
      errors.deadline =
        messages.form.fields.timeValidationErrors.deadlineNotSecond();
    }
    if (!isExpiresThird(values)) {
      errors.expires =
        messages.form.fields.timeValidationErrors.expiresNotThird();
    }

    return errors;
  };

  const submit = (newTaskValues: NewTaskValues) => {
    // Change shape of fields to array
    const configWithFieldsArray = {
      ...newTaskValues.config,
      ...(newTaskValues?.config &&
        'fields' in newTaskValues?.config &&
        newTaskValues?.config.fields && {
          fields: [newTaskValues?.config?.fields],
        }),
    };
    const config = configForTaskType(
      newTaskValues.type,
      configWithFieldsArray as AnyTaskTypeConfig
    );

    // If time estimate is 'No estimate', set to null
    const time_estimate =
      (newTaskValues.time_estimate as number | string) === DEFAULT_TIME_ESTIMATE
        ? null
        : newTaskValues.time_estimate;

    const reassign_interval =
      (newTaskValues.reassign_interval as number | string) ===
      DEFAULT_REASSIGN_INTERVAL
        ? null
        : newTaskValues.reassign_interval;

    // Value from widget is string, but typed as number. So convert to int
    // or null, depending on whether interval was set or not.
    const reassign_limit =
      reassign_interval && newTaskValues.reassign_limit
        ? parseInt(newTaskValues.reassign_limit.toString())
        : null;

    //Turn dayjs into date strings
    const deadline = newTaskValues.deadline
      ? newTaskValues.deadline.toISOString()
      : undefined;
    const expires = newTaskValues.expires
      ? newTaskValues.expires.toISOString()
      : undefined;
    const published = newTaskValues.published
      ? newTaskValues.published.toISOString()
      : undefined;

    onSubmit({
      ...newTaskValues,
      config,
      deadline,
      expires,
      published,
      reassign_interval,
      reassign_limit,
      time_estimate,
    });
  };

  return (
    <Form
      initialValues={{
        campaign_id: parseInt(campId),
        config: {
          ...task?.config,
          // Set first value from fields array
          ...(task?.config &&
            'fields' in task?.config &&
            task?.config.fields && {
              fields: task?.config?.fields[0],
            }),
        },
        deadline: task?.deadline ? dayjs(task.deadline + '.000Z') : undefined,
        expires: task?.expires ? dayjs(task.expires + '.000Z') : undefined,
        instructions: task?.instructions,
        published: task?.published
          ? dayjs(task.published + '.000Z')
          : undefined,
        reassign_interval: task?.reassign_interval,
        reassign_limit: task?.reassign_limit,
        time_estimate: task?.time_estimate || DEFAULT_TIME_ESTIMATE,
        title: task?.title,
        type: task?.type,
      }}
      keepDirtyOnReinitialize
      onSubmit={submit}
      render={({ handleSubmit, submitting, valid, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          {/* Required fields */}
          <TextField
            disabled={!!campId}
            fullWidth
            id={TASK_DETAILS_FIELDS.CAMPAIGN_ID}
            label={messages.form.fields.campaign()}
            margin="normal"
            name={TASK_DETAILS_FIELDS.CAMPAIGN_ID}
            required
            select
          >
            {campaigns &&
              campaigns.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.title}
                </MenuItem>
              ))}
          </TextField>

          <TextField
            fullWidth
            id="title"
            label={messages.form.fields.title()}
            margin="normal"
            name={TASK_DETAILS_FIELDS.TITLE}
            required
          />

          <TextField
            fullWidth
            id={TASK_DETAILS_FIELDS.INSTRUCTIONS}
            label={messages.form.fields.instructions()}
            margin="normal"
            multiline
            name={TASK_DETAILS_FIELDS.INSTRUCTIONS}
            required
            rows={2}
            variant="filled"
          />

          <TimeEstimateField />

          <TextField
            fullWidth
            id={TASK_DETAILS_FIELDS.TYPE}
            label={messages.form.fields.type()}
            margin="normal"
            name={TASK_DETAILS_FIELDS.TYPE}
            required
            select
          >
            <MenuItem value={TASK_TYPE.OFFLINE}>
              <Msg id={messageIds.form.fields.types.offline} />
            </MenuItem>
            <MenuItem value={TASK_TYPE.SHARE_LINK}>
              <Msg id={messageIds.form.fields.types.share_link} />
            </MenuItem>
            <MenuItem value={TASK_TYPE.VISIT_LINK}>
              <Msg id={messageIds.form.fields.types.visit_link} />
            </MenuItem>
            <MenuItem value={TASK_TYPE.COLLECT_DEMOGRAPHICS}>
              <Msg id={messageIds.form.fields.types.demographic} />
            </MenuItem>
          </TextField>

          {/* Custom fields for task type config */}
          {values.type === TASK_TYPE.COLLECT_DEMOGRAPHICS && (
            <CollectDemographicsFields />
          )}
          {values.type === TASK_TYPE.SHARE_LINK && <ShareLinkFields />}
          {values.type === TASK_TYPE.VISIT_LINK && <VisitLinkFields />}

          {/* Date Selectors */}
          <DateTimePicker
            ampm={false}
            disabled={
              taskStatus === TASK_STATUS.ACTIVE ||
              taskStatus === TASK_STATUS.CLOSED
            }
            disablePast
            fieldProps={{
              id: TASK_DETAILS_FIELDS.PUBLISHED,
              margin: 'normal',
            }}
            label={messages.form.fields.published()}
            name={TASK_DETAILS_FIELDS.PUBLISHED}
          />

          <DateTimePicker
            ampm={false}
            disablePast
            fieldProps={{
              id: TASK_DETAILS_FIELDS.DEADLINE,
              margin: 'normal',
            }}
            label={messages.form.fields.deadline()}
            name={TASK_DETAILS_FIELDS.DEADLINE}
          />

          <DateTimePicker
            ampm={false}
            disablePast
            fieldProps={{
              id: TASK_DETAILS_FIELDS.EXPIRES,
              margin: 'normal',
            }}
            label={messages.form.fields.expires()}
            name={TASK_DETAILS_FIELDS.EXPIRES}
          />

          <ReassignFields />

          <ZUISubmitCancelButtons
            onCancel={onCancel}
            submitDisabled={submitting || !valid}
          />
        </form>
      )}
      validate={validate}
    />
  );
};

export default TaskDetailsForm;
