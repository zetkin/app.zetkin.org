import { FormEvent, useEffect } from 'react';
import { Box, MenuItem, Skeleton, Tooltip, Typography } from '@mui/material';

import FilterForm from '../../FilterForm';
import StyledSelect from '../../inputs/StyledSelect';
import { useNumericRouteParams } from 'core/hooks';
import useOrgIdsFromOrgScope from 'features/smartSearch/hooks/useOrgIdsFromOrgScope';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  EventParticipationConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from 'features/smartSearch/components/types';
import { Msg } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import useEventsByOrgs from 'features/smartSearch/hooks/useEventsByOrgs';

const localMessageIds = messageIds.filters.eventParticipation;

const DEFAULT_VALUE = 'any';

interface EventParticipationProps {
  filter:
    | SmartSearchFilterWithId<EventParticipationConfig>
    | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<EventParticipationConfig>
      | ZetkinSmartSearchFilter<EventParticipationConfig>
  ) => void;
  onCancel: () => void;
}

const EventParticipation = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: EventParticipationProps): JSX.Element => {
  const { orgId } = useNumericRouteParams();

  const { filter, setConfig, setOp } =
    useSmartSearchFilter<Partial<EventParticipationConfig>>(initialFilter);

  const orgIds = useOrgIdsFromOrgScope(
    orgId,
    filter.config.organizations || [orgId]
  );

  const events = useEventsByOrgs(orgIds);

  useEffect(() => {
    if (
      events.isLoading ||
      events.error ||
      !events.data ||
      !filter.config.action
    ) {
      return;
    }

    if (!events.data.some((event) => event.id === filter.config.action)) {
      setConfig({
        ...filter.config,
        action: undefined,
      });
    }
  }, [events.data, filter]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (typeof filter.config.action !== 'undefined') {
      onSubmit(
        filter as
          | SmartSearchFilterWithId<EventParticipationConfig>
          | ZetkinSmartSearchFilter<EventParticipationConfig>
      );
    }
  };

  const handleEventSelectChange = (eventValue: string) => {
    setConfig({ ...filter.config, action: +eventValue });
  };

  const handleStatusSelectChange = (statusValue: string) => {
    if (statusValue === DEFAULT_VALUE) {
      const newConf = { ...filter.config };
      delete newConf.status;
      setConfig(newConf);
    } else {
      setConfig({
        ...filter.config,
        status: statusValue as 'attended' | 'cancelled' | 'noshow',
      });
    }
  };

  const submittable = typeof filter.config.action !== 'undefined';

  if (events.isLoading) {
    return <Skeleton typeof={'rounded'} />;
  }

  if (events.error || !events.data) {
    return (
      <Box>
        <Typography>
          <Msg id={localMessageIds.error} />
        </Typography>
      </Box>
    );
  }

  return (
    <FilterForm
      disableSubmit={!submittable}
      enableOrgSelect
      onCancel={onCancel}
      onOrgsChange={(orgs) => {
        setConfig({ ...filter.config, organizations: orgs });
      }}
      onSubmit={(e) => handleSubmit(e)}
      renderExamples={() => <Msg id={localMessageIds.example} />}
      renderSentence={() => (
        <Msg
          id={localMessageIds.inputString}
          values={{
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
            eventSelect: (
              <StyledSelect
                onChange={(e) => handleEventSelectChange(e.target.value)}
                value={filter.config.action}
              >
                {(events.data || []).map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    <Tooltip
                      placement="right-start"
                      title={a.title && a.title.length >= 40 ? a.title : ''}
                    >
                      <Box>{a.title ?? `Untitled Event #${a.id}`}</Box>
                    </Tooltip>
                  </MenuItem>
                ))}
              </StyledSelect>
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
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default EventParticipation;
