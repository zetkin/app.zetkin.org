import { FormEvent } from 'react';
import { MenuItem } from '@mui/material';

import FilterForm from '../../FilterForm';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import useProjects from 'features/projects/hooks/useProjects';
import useEventLocations from 'features/events/hooks/useEventLocations';
import useEventTypes from 'features/events/hooks/useEventTypes';
import { useNumericRouteParams } from 'core/hooks';
import useOrgIdsFromOrgScope from 'features/smartSearch/hooks/useOrgIdsFromOrgScope';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  ProjectParticipationConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import StyledAutocomplete from 'features/smartSearch/components/inputs/StyledAutocomplete';

const localMessageIds = messageIds.filters.projectParticipation;

const DEFAULT_VALUE = 'any';

const removeKey = (
  config: ProjectParticipationConfig,
  deleteKey: string
): ProjectParticipationConfig => {
  return deleteKey in config
    ? Object.entries(config).reduce(
        (result: ProjectParticipationConfig, [key, value]) => {
          if (key !== deleteKey) {
            return {
              ...result,
              [key]: value,
            };
          }
          return result;
        },
        {
          operator: config.operator,
          state: config.state,
        }
      )
    : config;
};

interface ProjectParticipationProps {
  filter:
    | SmartSearchFilterWithId<ProjectParticipationConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<ProjectParticipationConfig>
      | ZetkinSmartSearchFilter<ProjectParticipationConfig>
  ) => void;
  onCancel: () => void;
}

const ProjectParticipation = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: ProjectParticipationProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(localMessageIds);

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<ProjectParticipationConfig>(initialFilter, {
      operator: 'in',
      organizations: [orgId],
      state: 'booked',
      status: undefined,
    });

  const orgIds = useOrgIdsFromOrgScope(
    orgId,
    filter.config.organizations || [orgId]
  );

  // TODO: Show loading indicator instead of empty arrays?
  const activities = useEventTypes(orgId).data || [];
  const projects = useProjects(orgId, orgIds).data || [];
  const locations = useEventLocations(orgId) || [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    const {
      state,
      status,
      operator,
      project,
      activity,
      location,
      organizations,
    } = filter.config;
    setConfig({
      activity,
      location,
      operator,
      organizations,
      project,
      state,
      status,
      ...range,
    });
  };

  const handleProjectSelectChange = (campValue: string) => {
    if (campValue === DEFAULT_VALUE) {
      setConfig(removeKey(filter.config, 'project'));
    } else {
      setConfig({ ...filter.config, project: +campValue });
    }
  };

  const handleActivitySelectChange = (activityValue: string) => {
    if (activityValue === DEFAULT_VALUE) {
      setConfig(removeKey(filter.config, 'activity'));
    } else {
      setConfig({ ...filter.config, activity: +activityValue });
    }
  };

  const handleLocationSelectChange = (locationValue: string) => {
    if (locationValue === DEFAULT_VALUE) {
      setConfig(removeKey(filter.config, 'location'));
    } else {
      setConfig({ ...filter.config, location: +locationValue });
    }
  };

  const handleStatusSelectChange = (statusValue: string) => {
    if (statusValue === DEFAULT_VALUE) {
      setConfig(removeKey(filter.config, 'status'));
    } else {
      setConfig({
        ...filter.config,
        status: statusValue as 'attended' | 'cancelled' | 'noshow',
      });
    }
  };

  return (
    <FilterForm
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
            activitySelect: (
              <StyledAutocomplete
                items={[
                  {
                    group: 'pinned',
                    id: DEFAULT_VALUE,
                    label: messages.activitySelect.any(),
                  },
                  ...activities.map((activity) => ({
                    id: activity.id,
                    label: activity.title,
                  })),
                ]}
                onChange={(e) => {
                  handleActivitySelectChange(e.target.value);
                }}
                value={filter.config.activity || DEFAULT_VALUE}
              />
            ),
            addRemoveSelect: (
              <StyledSelect
                onChange={(e) => setOp(e.target.value as OPERATION)}
                value={filter.op}
              >
                <MenuItem key={OPERATION.ADD} value={OPERATION.ADD}>
                  <Msg id={messageIds.operators.add} />
                </MenuItem>
                <MenuItem key={OPERATION.SUB} value={OPERATION.SUB}>
                  <Msg id={messageIds.operators.sub} />
                </MenuItem>
                <MenuItem key={OPERATION.LIMIT} value={OPERATION.LIMIT}>
                  <Msg id={messageIds.operators.limit} />
                </MenuItem>
              </StyledSelect>
            ),
            bookedSelect: (
              <StyledSelect
                onChange={(e) =>
                  setConfig({
                    ...filter.config,
                    state: e.target.value as 'booked' | 'signed_up',
                  })
                }
                value={filter.config.state}
              >
                <MenuItem key="booked" value="booked">
                  <Msg id={localMessageIds.bookedSelect.booked} />
                </MenuItem>
                <MenuItem key="signed_up" value="signed_up">
                  <Msg id={localMessageIds.bookedSelect.signed_up} />
                </MenuItem>
              </StyledSelect>
            ),
            haveSelect: (
              <StyledSelect
                onChange={(e) =>
                  setConfig({
                    ...filter.config,
                    operator: e.target.value as 'in' | 'notin',
                  })
                }
                value={filter.config.operator}
              >
                <MenuItem key="in" value="in">
                  <Msg id={localMessageIds.haveSelect.in} />
                </MenuItem>
                <MenuItem key="notin" value="notin">
                  <Msg id={localMessageIds.haveSelect.notin} />
                </MenuItem>
              </StyledSelect>
            ),
            locationSelect: (
              <StyledAutocomplete
                items={[
                  {
                    group: 'pinned',
                    id: DEFAULT_VALUE,
                    label: messages.locationSelect.any(),
                  },
                  ...locations.map((loc) => ({
                    id: loc.id,
                    label: loc.title,
                  })),
                ]}
                onChange={(e) => handleLocationSelectChange(e.target.value)}
                value={filter.config.location || DEFAULT_VALUE}
              />
            ),
            projectSelect: (
              <StyledAutocomplete
                items={[
                  {
                    group: 'pinned',
                    id: DEFAULT_VALUE,
                    label: messages.projectSelect.any(),
                  },
                  ...projects.map((project) => ({
                    group: project.organization.title,
                    id: project.id,
                    label: project.title,
                  })),
                ]}
                onChange={(e) => {
                  handleProjectSelectChange(e.target.value);
                }}
                value={filter.config.project || DEFAULT_VALUE}
              />
            ),
            statusSelect: (
              <StyledSelect
                onChange={(e) => handleStatusSelectChange(e.target.value)}
                value={filter.config.status || DEFAULT_VALUE}
              >
                <MenuItem key="any" value={DEFAULT_VALUE}>
                  <Msg id={localMessageIds.statusSelect.any} />
                </MenuItem>
                <MenuItem key="attended" value="attended">
                  <Msg id={localMessageIds.statusSelect.attended} />
                </MenuItem>
                <MenuItem key="cancelled" value="cancelled">
                  <Msg id={localMessageIds.statusSelect.cancelled} />
                </MenuItem>
                <MenuItem key="noshow" value="noshow">
                  <Msg id={localMessageIds.statusSelect.noshow} />
                </MenuItem>
              </StyledSelect>
            ),
            timeFrame: (
              <TimeFrame
                filterConfig={{
                  after: filter.config.after,
                  before: filter.config.before,
                }}
                onChange={handleTimeFrameChange}
              />
            ),
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default ProjectParticipation;
