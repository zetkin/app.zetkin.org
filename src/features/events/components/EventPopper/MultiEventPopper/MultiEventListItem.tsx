import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Box, Typography } from '@mui/material';
import { ChevronRightOutlined, People } from '@mui/icons-material';

import { CLUSTER_TYPE } from 'features/campaigns/hooks/useClusteredActivities';
import EventSelectionCheckBox from '../../EventSelectionCheckBox';
import EventWarningIcons from '../../EventWarningIcons';
import LocationLabel from '../../LocationLabel';
import messageIds from 'features/events/l10n/messageIds';
import { removeOffset } from 'utils/dateUtils';
import StatusDot from '../StatusDot';
import useEventState from 'features/events/hooks/useEventState';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinEvent } from 'utils/types/zetkin';
import ZUIIconLabel from 'zui/ZUIIconLabel';

interface MultiEventListItemProps {
  clusterType: CLUSTER_TYPE;
  event: ZetkinEvent;
  onEventClick: (id: number) => void;
}

const MultiEventListItem: FC<MultiEventListItemProps> = ({
  clusterType,
  event,
  onEventClick,
}) => {
  const { orgId } = useNumericRouteParams();
  const intl = useIntl();
  const messages = useMessages(messageIds);
  const state = useEventState(orgId, event.id);
  const timeSpan = `${intl.formatTime(
    removeOffset(event.start_time)
  )}-${intl.formatTime(removeOffset(event.end_time))}`;

  return (
    <Box display="flex" flexDirection="column" paddingBottom={1} width="100%">
      <Box display="flex">
        <EventSelectionCheckBox events={[event]} />
        <Box
          display="flex"
          flexGrow={1}
          justifyContent="space-between"
          onClick={() => onEventClick(event.id)}
          sx={{ cursor: 'pointer' }}
        >
          <Box maxWidth="220px">
            <Typography
              paddingLeft={1}
              sx={{
                margin: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {clusterType == CLUSTER_TYPE.MULTI_LOCATION && (
                <LocationLabel location={event.location} />
              )}
              {clusterType == CLUSTER_TYPE.MULTI_SHIFT && timeSpan}
              {clusterType == CLUSTER_TYPE.ARBITRARY &&
                (event.title ||
                  event.activity?.title ||
                  messages.common.noTitle())}
            </Typography>
          </Box>
          <Box alignItems="center" display="flex">
            <EventWarningIcons eventId={event.id} orgId={orgId} />
            <Box paddingRight={2}>
              <ZUIIconLabel
                color={
                  event.num_participants_available <
                  event.num_participants_required
                    ? 'error'
                    : 'secondary'
                }
                icon={
                  <People
                    color={
                      event.num_participants_available <
                      event.num_participants_required
                        ? 'error'
                        : 'secondary'
                    }
                    fontSize="small"
                  />
                }
                label={`${event.num_participants_available}/${event.num_participants_required}`}
                size="sm"
              />
            </Box>
            <ChevronRightOutlined />
          </Box>
        </Box>
      </Box>
      {clusterType === CLUSTER_TYPE.ARBITRARY && (
        <Box display="flex" paddingLeft={3}>
          <Box paddingTop={0.6}>
            <StatusDot state={state} />
          </Box>
          <Typography color="secondary" variant="body2">
            {`${timeSpan}, `}
            <LocationLabel location={event.location} />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MultiEventListItem;
