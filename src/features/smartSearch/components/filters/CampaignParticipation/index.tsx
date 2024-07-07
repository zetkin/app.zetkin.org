import { FormEvent } from 'react';
import { Box, MenuItem, Tooltip } from '@mui/material';

import FilterForm from '../../FilterForm';
import StyledGroupedSelect from '../../inputs/StyledGroupedSelect';
import StyledSelect from '../../inputs/StyledSelect';
import TimeFrame from '../TimeFrame';
import { truncateOnMiddle } from 'utils/stringUtils';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import useEventLocations from 'features/events/hooks/useEventLocations';
import useEventTypes from 'features/events/hooks/useEventTypes';
import { useNumericRouteParams } from 'core/hooks';
import useOrgIdsFromOrgScope from 'features/smartSearch/hooks/useOrgIdsFromOrgScope';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  CampaignParticipationConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';

const localMessageIds = messageIds.filters.campaignParticipation;

const DEFAULT_VALUE = 'any';

const removeKey = (
  config: CampaignParticipationConfig,
  deleteKey: string
): CampaignParticipationConfig => {
  return deleteKey in config
    ? Object.entries(config).reduce(
        (result: CampaignParticipationConfig, [key, value]) => {
          if (key !== deleteKey) {
            return {
              ...result,
              [key]: value,
            };
          }
          return result;
        },
        { operator: config.operator, state: config.state }
      )
    : config;
};

interface CampaignParticipationProps {
  filter:
    | SmartSearchFilterWithId<CampaignParticipationConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<CampaignParticipationConfig>
      | ZetkinSmartSearchFilter<CampaignParticipationConfig>
  ) => void;
  onCancel: () => void;
}

const CampaignParticipation = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: CampaignParticipationProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(localMessageIds);

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<CampaignParticipationConfig>(initialFilter, {
      operator: 'in',
      organizations: [orgId],
      state: 'booked',
    });

  const orgIds = useOrgIdsFromOrgScope(
    orgId,
    filter.config.organizations || [orgId]
  );

  // TODO: Show loading indicator instead of empty arrays?
  const activities = useEventTypes(orgId).data || [];
  const campaigns = useCampaigns(orgId, orgIds).data || [];
  const locations = useEventLocations(orgId) || [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(filter);
  };

  const handleTimeFrameChange = (range: {
    after?: string;
    before?: string;
  }) => {
    const { state, operator, campaign, activity, location, organizations } =
      filter.config;
    setConfig({
      activity,
      campaign,
      location,
      operator,
      organizations,
      state,
      ...range,
    });
  };

  const handleCampaignSelectChange = (campValue: string) => {
    if (campValue === DEFAULT_VALUE) {
      setConfig(removeKey(filter.config, 'campaign'));
    } else {
      setConfig({ ...filter.config, campaign: +campValue });
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
              <StyledSelect
                onChange={(e) => handleActivitySelectChange(e.target.value)}
                SelectProps={{
                  renderValue: function getLabel(value) {
                    return value === DEFAULT_VALUE ? (
                      <Msg id={localMessageIds.activitySelect.any} />
                    ) : (
                      <Msg
                        id={localMessageIds.activitySelect.activity}
                        values={{
                          activity: truncateOnMiddle(
                            activities.find((l) => l.id === value)?.title ?? '',
                            40
                          ),
                        }}
                      />
                    );
                  },
                }}
                value={filter.config.activity || DEFAULT_VALUE}
              >
                <MenuItem key={DEFAULT_VALUE} value={DEFAULT_VALUE}>
                  <Msg id={localMessageIds.activitySelect.any} />
                </MenuItem>
                {activities.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    <Tooltip
                      placement="right-start"
                      title={a.title.length >= 40 ? a.title : ''}
                    >
                      <Box>{a.title}</Box>
                    </Tooltip>
                  </MenuItem>
                ))}
              </StyledSelect>
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
            campaignSelect: (
              <StyledGroupedSelect
                items={[
                  {
                    group: null,
                    id: DEFAULT_VALUE,
                    label: messages.campaignSelect.any(),
                  },
                  ...campaigns.map((campaign) => ({
                    group: campaign.organization.title,
                    id: campaign.id,
                    label: campaign.title,
                  })),
                ]}
                onChange={(e) => {
                  handleCampaignSelectChange(e.target.value);
                }}
                value={filter.config.campaign || DEFAULT_VALUE}
              />
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
              <StyledSelect
                onChange={(e) => handleLocationSelectChange(e.target.value)}
                SelectProps={{
                  renderValue: function getLabel(value) {
                    return value === DEFAULT_VALUE ? (
                      <Msg id={localMessageIds.locationSelect.any} />
                    ) : (
                      <Msg
                        id={localMessageIds.locationSelect.location}
                        values={{
                          location: truncateOnMiddle(
                            locations.find((l) => l.id === value)?.title ?? '',
                            40
                          ),
                        }}
                      />
                    );
                  },
                }}
                value={filter.config.location || DEFAULT_VALUE}
              >
                <MenuItem key={DEFAULT_VALUE} value={DEFAULT_VALUE}>
                  <Msg id={localMessageIds.locationSelect.any} />
                </MenuItem>
                {locations.map((l) => (
                  <MenuItem key={l.id} value={l.id}>
                    {l.title}
                  </MenuItem>
                ))}
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

export default CampaignParticipation;
