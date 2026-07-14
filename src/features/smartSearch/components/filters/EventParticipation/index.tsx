import { FormEvent, useCallback, useEffect, useMemo } from 'react';
import { Box, MenuItem, Skeleton, Typography } from '@mui/material';

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
import { Msg, useMessages } from 'core/i18n';
import messageIds from 'features/smartSearch/l10n/messageIds';
import useOrgEvents from 'features/smartSearch/hooks/useOrgEvents';
import eventsMessageIds from 'features/events/l10n/messageIds';
import StyledAutocomplete, {
  AutocompleteItem,
} from 'features/smartSearch/components/inputs/StyledAutocomplete';

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

type EventItem = AutocompleteItem & {
  time: number;
};

const EventParticipation = ({
  onSubmit,
  onCancel,
  filter: initialFilter,
}: EventParticipationProps): JSX.Element => {
  const eventsMessages = useMessages(eventsMessageIds);
  const { orgId } = useNumericRouteParams();

  const { filter, setConfig, setOp } = useSmartSearchFilter<
    Partial<EventParticipationConfig>
  >(initialFilter, {
    state: 'booked',
  });

  const orgIds = useOrgIdsFromOrgScope(
    orgId,
    filter.config.organizations || [orgId]
  );
  const multiFilterActive = orgIds.length > 1;
  const searchOrgId = orgIds.length === 1 ? orgIds[0] : orgId;

  const events = useOrgEvents(searchOrgId, multiFilterActive);
  const orgIdSet = useMemo(() => new Set(orgIds), [orgIds]);
  const scopedEvents = useMemo(
    () => events?.data?.filter((ev) => orgIdSet.has(ev.organization.id)),
    [events, orgIdSet]
  );

  const eventsSorting = useCallback((item0: EventItem, item1: EventItem) => {
    return item1.time - item0.time;
  }, []);

  useEffect(() => {
    if (
      events.isLoading ||
      events.error ||
      !scopedEvents ||
      !filter.config.action
    ) {
      return;
    }

    if (!scopedEvents.some((event) => event.id === filter.config.action)) {
      setConfig({
        ...filter.config,
        action: undefined,
      });
    }
  }, [scopedEvents, events.error, events.isLoading, filter, setConfig]);

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
    if (!eventValue) {
      return;
    }
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
              <StyledAutocomplete
                clearable={true}
                items={
                  scopedEvents?.map((event) => {
                    const title =
                      event.title ||
                      event.activity?.title ||
                      eventsMessages.common.noTitle();
                    const unix = Date.parse(event.start_time);
                    const date = new Date(unix).toLocaleDateString();

                    return {
                      id: event.id,
                      label: `${title} (${date})`,
                      time: unix,
                    };
                  }) || []
                }
                onChange={(e) => handleEventSelectChange(e.target.value)}
                sorting={eventsSorting}
                value={filter.config.action}
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
          }}
        />
      )}
      selectedOrgs={filter.config.organizations}
    />
  );
};

export default EventParticipation;
