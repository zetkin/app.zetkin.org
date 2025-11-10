import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import validator from 'validator';
import { FormEvent, useMemo, useState } from 'react';
import { MenuItem, TextField } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { ZetkinTask } from 'utils/types/zetkin';
import {
  AnyTaskTypeConfig,
  DEMOGRAPHICS_FIELD,
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
import messageIds from 'features/tasks/l10n/messageIds';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import { useNumericRouteParams } from 'core/hooks';

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
  const { campId, orgId } = useNumericRouteParams();
  const { data: campaigns } = useCampaigns(orgId);
  const taskStatus = task ? getTaskStatus(task) : null;

  const [campaignId, setCampaignId] = useState<number | undefined>(
    campId ?? task?.campaign?.id
  );
  const [title, setTitle] = useState<string>(task?.title ?? '');
  const [instructions, setInstructions] = useState<string>(
    task?.instructions ?? ''
  );
  const [type, setType] = useState<TASK_TYPE | undefined>(task?.type);

  const [shareUrl, setShareUrl] = useState<string | undefined>(
    task?.type === TASK_TYPE.SHARE_LINK && 'url' in task.config
      ? task.config.url
      : undefined
  );
  const [shareDefaultMessage, setShareDefaultMessage] = useState<
    string | undefined
  >(
    task?.type === TASK_TYPE.SHARE_LINK && 'default_message' in task.config
      ? task.config.default_message
      : undefined
  );
  const [visitUrl, setVisitUrl] = useState<string | undefined>(
    task?.type === TASK_TYPE.VISIT_LINK && 'url' in task.config
      ? task.config.url
      : undefined
  );
  const [demographicsField, setDemographicsField] = useState<
    DEMOGRAPHICS_FIELD | undefined
  >(
    task?.type === TASK_TYPE.COLLECT_DEMOGRAPHICS && 'fields' in task.config
      ? task.config.fields?.[0]
      : undefined
  );

  const [published, setPublished] = useState<Dayjs | null>(
    task?.published ? dayjs(task.published + '.000Z') : null
  );
  const [deadline, setDeadline] = useState<Dayjs | null>(
    task?.deadline ? dayjs(task.deadline + '.000Z') : null
  );
  const [expires, setExpires] = useState<Dayjs | null>(
    task?.expires ? dayjs(task.expires + '.000Z') : null
  );

  const [timeEstimate, setTimeEstimate] = useState<number | null>(
    task?.time_estimate ?? null
  );
  const [reassignInterval, setReassignInterval] = useState<number | null>(
    task?.reassign_interval ?? null
  );
  const [reassignLimit, setReassignLimit] = useState<number | null>(
    task?.reassign_limit ?? null
  );

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

  const composedValues: NewTaskValues = useMemo(() => {
    return {
      campaign_id: campaignId,
      config: (() => {
        if (type === TASK_TYPE.SHARE_LINK) {
          return {
            default_message: shareDefaultMessage,
            url: shareUrl,
          };
        } else if (type === TASK_TYPE.VISIT_LINK) {
          return { url: visitUrl };
        } else if (type === TASK_TYPE.COLLECT_DEMOGRAPHICS) {
          return { fields: [demographicsField] };
        }
      })(),
      deadline: deadline ?? undefined,
      expires: expires ?? undefined,
      instructions,
      published: published ?? undefined,
      reassign_interval: reassignInterval,
      reassign_limit: reassignLimit,
      time_estimate: timeEstimate,
      title,
      type: type as TASK_TYPE,
    } as NewTaskValues;
  }, [
    campaignId,
    deadline,
    demographicsField,
    expires,
    instructions,
    published,
    reassignInterval,
    reassignLimit,
    shareDefaultMessage,
    shareUrl,
    timeEstimate,
    title,
    type,
    visitUrl,
  ]);

  const errors = useMemo(() => validate(composedValues), [composedValues]);
  const hasErrors = (
    obj: Record<string, string | Record<string, string>>
  ): boolean =>
    Object.values(obj).some((v) =>
      typeof v === 'string'
        ? Boolean(v)
        : v && typeof v === 'object' && Object.keys(v).length > 0
    );
  const isValid = !hasErrors(errors);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      return;
    }

    // Change shape of fields to array if needed
    const configWithFieldsArray = {
      ...composedValues.config,
      ...(composedValues?.config &&
        'fields' in composedValues.config &&
        composedValues.config.fields && {
          fields: [composedValues.config.fields],
        }),
    };

    const config = configForTaskType(
      composedValues.type,
      configWithFieldsArray as AnyTaskTypeConfig
    );

    onSubmit({
      ...composedValues,
      config,
      deadline: composedValues.deadline?.toISOString(),
      expires: composedValues.expires?.toISOString(),
      published: composedValues.published?.toISOString(),
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      {/* Required fields */}
      <TextField
        disabled={!!campId}
        fullWidth
        label={messages.form.fields.campaign()}
        margin="normal"
        onChange={(e) => setCampaignId(Number(e.target.value))}
        required
        select
        value={campaignId ?? ''}
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
        onChange={(e) => setTitle(e.target.value)}
        required
        value={title}
      />

      <TextField
        fullWidth
        label={messages.form.fields.instructions()}
        margin="normal"
        multiline
        onChange={(e) => setInstructions(e.target.value)}
        required
        rows={2}
        value={instructions}
        variant="filled"
      />

      <TimeEstimateField onChange={setTimeEstimate} value={timeEstimate} />

      <TextField
        fullWidth
        label={messages.form.fields.type()}
        margin="normal"
        onChange={(e) => setType(e.target.value as TASK_TYPE)}
        required
        select
        value={type ?? ''}
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
      {type === TASK_TYPE.COLLECT_DEMOGRAPHICS && (
        <CollectDemographicsFields
          onChange={setDemographicsField}
          value={demographicsField}
        />
      )}
      {type === TASK_TYPE.SHARE_LINK && (
        <ShareLinkFields
          defaultMessage={shareDefaultMessage}
          onDefaultMessageChange={setShareDefaultMessage}
          onUrlChange={setShareUrl}
          url={shareUrl}
        />
      )}
      {type === TASK_TYPE.VISIT_LINK && (
        <VisitLinkFields onUrlChange={setVisitUrl} url={visitUrl} />
      )}

      {/* Date Selectors */}
      <DateTimePicker
        ampm={false}
        disabled={
          taskStatus === TASK_STATUS.ACTIVE || taskStatus === TASK_STATUS.CLOSED
        }
        disablePast
        label={messages.form.fields.published()}
        onChange={setPublished}
        value={published}
      />

      <DateTimePicker
        ampm={false}
        disablePast
        label={messages.form.fields.deadline()}
        onChange={setDeadline}
        value={deadline}
      />

      <DateTimePicker
        ampm={false}
        disablePast
        label={messages.form.fields.expires()}
        onChange={setExpires}
        value={expires}
      />

      <ReassignFields onChange={setReassignInterval} value={reassignInterval} />

      <TextField
        fullWidth
        id="reassign-limit"
        label={messages.form.fields.reassignLimit()}
        margin="normal"
        onChange={(e) => {
          const val = e.target.value;
          if (val === '') {
            setReassignLimit(null);
          } else {
            setReassignLimit(Number(val));
          }
        }}
        type="number"
        value={reassignLimit === null ? '' : reassignLimit}
      />

      <ZUISubmitCancelButtons onCancel={onCancel} submitDisabled={!isValid} />
    </form>
  );
};

export default TaskDetailsForm;
