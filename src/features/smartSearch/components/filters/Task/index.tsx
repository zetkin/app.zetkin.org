import { FormEvent } from 'react';
import { Box, MenuItem } from '@mui/material';

import FilterForm from '../../FilterForm';
import Matching from '../Matching';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import { useNumericRouteParams } from 'core/hooks';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import useTasks from 'features/tasks/hooks/useTasks';
import { getTaskStatus, getTaskTimeFrameWithConfig } from '../../utils';

import {
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  TASK_STATUS,
  TaskFilterConfig,
  TaskTimeFrame,
  TIME_FRAME,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';

import messageIds from 'features/smartSearch/l10n/messageIds';
const localMessageIds = messageIds.filters.task;

const ANY_CAMPAIGN = 'any';
const ANY_TASK = 'any';

interface TaskProps {
  filter: SmartSearchFilterWithId<TaskFilterConfig> | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<TaskFilterConfig>
      | ZetkinSmartSearchFilter<TaskFilterConfig>
  ) => void;
  onCancel: () => void;
}

const Task = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: TaskProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();

  const tasksQuery = useTasks(orgId);
  const tasks = tasksQuery.data || [];

  const { data: campaigns } = useCampaigns(orgId);

  const { filter, setConfig, setOp } = useSmartSearchFilter<TaskFilterConfig>(
    initialFilter,
    { completed: true }
  );

  // only submit if tasks exist
  const submittable = !!tasks.length;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    // The TimeFrame component produces an empty object for "ever", but the API expects true
    let newValue;
    if (!range.after && !range.before) {
      newValue = true;
    } else {
      newValue = range;
    }
    setConfig({
      ...filter.config,
      [getTaskStatus(filter.config)]: newValue,
    });
  };

  const handleMatchingChange = (matching: { max?: number; min?: number }) => {
    setConfig({
      ...filter.config,
      matching: matching,
    });
  };

  const handleTaskSelectChange = (taskValue: string) => {
    if (taskValue === ANY_TASK) {
      setConfig({ ...filter.config, task: undefined });
    } else {
      // When specifying a task we don't want to specify a campaign
      setConfig({
        ...filter.config,
        campaign: undefined,
        task: +taskValue,
      });
    }
  };

  const handleCampaignSelectChange = (campaignValue: string) => {
    if (campaignValue === ANY_CAMPAIGN) {
      setConfig({ ...filter.config, campaign: undefined });
    } else {
      setConfig({
        ...filter.config,
        campaign: +campaignValue,
        task: undefined,
      });
    }
  };

  const getTimeFrame = (config: TaskFilterConfig): TaskTimeFrame => {
    if (config.assigned) {
      return config.assigned;
    } else if (config.completed) {
      return config.completed;
    } else if (config.ignored) {
      return config.ignored;
    } else {
      throw 'Unkown time frame';
    }
  };

  return (
    <FilterForm
      disableSubmit={!submittable}
      enableOrgSelect
      onCancel={onCancel}
      onOrgsChange={(orgs) => {
        setConfig({ ...filter.config, organizations: orgs });
      }}
      onSubmit={(e) => handleSubmit(e)}
      renderExamples={() => (
        <>
          <Msg id={localMessageIds.examples.one} />
          <br />
          <Msg id={localMessageIds.examples.two} />
        </>
      )}
      renderSentence={() => (
        <Msg
          id={localMessageIds.inputString}
          values={{
            addRemoveSelect: (
              <StyledSelect
                onChange={(e) => setOp(e.target.value as OPERATION)}
                value={filter.op}
              >
                {Object.values(OPERATION).map((o) => (
                  <MenuItem key={o} value={o}>
                    <Msg id={messageIds.operators[o]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            campaignSelect: !filter.config.task ? (
              <>
                <Box component="span" paddingX={1}>
                  <Msg id={localMessageIds.campaignSelect.in} />
                </Box>
                <StyledSelect
                  onChange={(e) => handleCampaignSelectChange(e.target.value)}
                  value={filter.config.campaign || ANY_CAMPAIGN}
                >
                  <MenuItem key={ANY_CAMPAIGN} value={ANY_CAMPAIGN}>
                    <Msg id={localMessageIds.campaignSelect.any} />
                  </MenuItem>
                  {campaigns?.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <Msg
                        id={localMessageIds.campaignSelect.campaign}
                        values={{ campaign: c.title }}
                      />
                    </MenuItem>
                  ))}
                </StyledSelect>
              </>
            ) : null,
            matchingSelect: (
              <Matching
                filterConfig={filter.config.matching || {}}
                onChange={handleMatchingChange}
              />
            ),
            taskSelect: (
              <StyledSelect
                onChange={(e) => handleTaskSelectChange(e.target.value)}
                value={filter.config.task || ANY_TASK}
              >
                <MenuItem key={ANY_TASK} value={ANY_TASK}>
                  <Msg id={localMessageIds.taskSelect.any} />
                </MenuItem>
                {tasks.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    <Msg
                      id={localMessageIds.taskSelect.task}
                      values={{ task: t.title }}
                    />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            taskStatusSelect: (
              <StyledSelect
                onChange={(e) =>
                  setConfig({
                    ...filter.config,
                    assigned: undefined,
                    completed: undefined,
                    ignored: undefined,
                    [e.target.value]: getTimeFrame(filter.config),
                  })
                }
                value={getTaskStatus(filter.config)}
              >
                {Object.values(TASK_STATUS).map((s) => (
                  <MenuItem key={s} value={s}>
                    <Msg id={localMessageIds.taskStatusSelect[s]} />
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            timeFrame: (
              <TimeFrame
                filterConfig={getTaskTimeFrameWithConfig(filter.config)}
                onChange={handleTimeFrameChange}
                options={[
                  TIME_FRAME.EVER,
                  TIME_FRAME.AFTER_DATE,
                  TIME_FRAME.BEFORE_DATE,
                  TIME_FRAME.BETWEEN,
                  TIME_FRAME.LAST_FEW_DAYS,
                  TIME_FRAME.BEFORE_TODAY,
                ]}
              />
            ),
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default Task;
