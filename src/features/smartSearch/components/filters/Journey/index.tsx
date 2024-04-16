import { FC } from 'react';
import FilterForm from '../../FilterForm';
import { MenuItem } from '@mui/material';
import messageIds from 'features/smartSearch/l10n/messageIds';
import { Msg } from 'core/i18n';
import StyledSelect from '../../inputs/StyledSelect';
import useJourneys from 'features/journeys/hooks/useJourneys';
import { useNumericRouteParams } from 'core/hooks';
import useSmartSearchFilter from 'features/smartSearch/hooks/useSmartSearchFilter';
import {
  JourneyFilterConfig,
  NewSmartSearchFilter,
  OPERATION,
  SmartSearchFilterWithId,
  ZetkinSmartSearchFilter,
} from '../../types';

const localMessageIds = messageIds.filters.journey;

enum JOURNEY_OP {
  OPEN = 'open',
  CLOSE = 'closed',
}
interface JourneyProps {
  filter: SmartSearchFilterWithId<JourneyFilterConfig> | NewSmartSearchFilter;
  onSubmit: (
    filter:
      | SmartSearchFilterWithId<JourneyFilterConfig>
      | ZetkinSmartSearchFilter<JourneyFilterConfig>
  ) => void;
  onCancel: () => void;
}

const Journey: FC<JourneyProps> = ({
  filter: initialFilter,
  onSubmit,
  onCancel,
}) => {
  const { orgId } = useNumericRouteParams();
  const { filter, setConfig, setOp } =
    useSmartSearchFilter<JourneyFilterConfig>(initialFilter, {
      operator: 'open',
    });

  const journeys = useJourneys(orgId)?.data || [];

  return (
    <FilterForm
      //   disableSubmit={!submittable}
      onCancel={onCancel}
      onSubmit={(e) => console.log(e)}
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
            journeySelect: (
              <StyledSelect
                minWidth="10rem"
                onChange={(e) => console.log('hey')}
                value={filter.config.journey || ''}
              >
                {journeys.map((journey) => (
                  <MenuItem key={`journey-${journey.id}`} value={journey.id}>
                    {`"${journey.title}"`}
                  </MenuItem>
                ))}
              </StyledSelect>
            ),
            operator: (
              <StyledSelect
                onChange={(e) =>
                  setConfig({
                    ...filter.config,
                    operator: e.target.value as JOURNEY_OP,
                  })
                }
                value={filter.config.operator}
              >
                <MenuItem value={JOURNEY_OP.OPEN}>
                  <Msg id={localMessageIds.open} />
                </MenuItem>
                <MenuItem value={JOURNEY_OP.CLOSE}>
                  <Msg id={localMessageIds.closed} />
                </MenuItem>
              </StyledSelect>
            ),
          }}
        />
      )}
    />
  );
};

export default Journey;
