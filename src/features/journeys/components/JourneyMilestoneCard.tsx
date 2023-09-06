import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Checkbox, Container, Typography } from '@mui/material';

import { journeyMilestoneStatusResource } from 'features/journeys/api/journeys';
import { ZetkinJourneyMilestoneStatus } from 'utils/types/zetkin';
import ZUIDate from 'zui/ZUIDate';
import ZUIRelativeTime from 'zui/ZUIRelativeTime';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';
import { Msg, useMessages } from 'core/i18n';

import messageIds from '../l10n/messageIds';

const JourneyMilestoneCard = ({
  milestone,
}: {
  milestone: ZetkinJourneyMilestoneStatus;
}): JSX.Element => {
  const messages = useMessages(messageIds);
  const { orgId, instanceId } = useRouter().query;
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const queryClient = useQueryClient();

  const journeyMilestoneStatusHooks = journeyMilestoneStatusResource(
    orgId as string,
    instanceId as string,
    milestone.id.toString()
  );
  const patchJourneyMilestoneStatusMutation =
    journeyMilestoneStatusHooks.useUpdate();

  const patchMilestoneStatus = (
    data:
      | Pick<ZetkinJourneyMilestoneStatus, 'completed'>
      | Pick<ZetkinJourneyMilestoneStatus, 'deadline'>
  ) => {
    patchJourneyMilestoneStatusMutation.mutateAsync(data, {
      onError: () => showSnackbar('error'),
      onSuccess: () => {
        queryClient.invalidateQueries(['journeyInstance', orgId, instanceId]);
      },
    });
  };

  const toggleCompleted = (
    milestone: ZetkinJourneyMilestoneStatus
  ): string | null => {
    if (milestone.completed) {
      return null;
    }
    return dayjs().toJSON();
  };

  return (
    <Box mt={4}>
      <Box
        alignItems="center"
        data-testid={`JourneyMilestoneCard`}
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Box alignItems="center" display="flex" flexDirection="row">
          <Checkbox
            checked={milestone.completed ? true : false}
            data-testid="JourneyMilestoneCard-completed"
            onChange={() => {
              patchMilestoneStatus({
                completed: toggleCompleted(milestone),
              });
            }}
          />
          <Typography
            onClick={() => {
              patchMilestoneStatus({
                completed: toggleCompleted(milestone),
              });
            }}
            style={{
              cursor: 'pointer',
            }}
            variant="h6"
          >
            {milestone.title}
          </Typography>
        </Box>
        {milestone.completed ? (
          <Box textAlign="right">
            <Typography>
              <Msg
                id={messageIds.instance.markedCompleteLabel}
                values={{
                  relativeTime: (
                    <ZUIRelativeTime
                      convertToLocal
                      datetime={milestone.completed}
                      forcePast
                    />
                  ),
                }}
              />
            </Typography>
            {milestone.deadline && (
              <Typography variant="body2">
                <Msg
                  id={messageIds.instance.deadlineLabel}
                  values={{
                    date: <ZUIDate datetime={milestone.deadline} />,
                  }}
                />
              </Typography>
            )}
          </Box>
        ) : (
          // TODO: Move this to new ZUIDatePicker
          <Box data-testid="JourneyMilestoneCard-datePicker">
            <DatePicker
              label={messages.instance.dueDateInputLabel()}
              localeText={{
                clearButtonLabel: messages.instance.dueDateInputClear(),
              }}
              onChange={(newDeadline) => {
                if (newDeadline && newDeadline.isValid()) {
                  const dateStr = newDeadline.format('YYYY-MM-DD');
                  patchMilestoneStatus({ deadline: dateStr });
                } else if (!newDeadline) {
                  // Deadline is cleared
                  patchMilestoneStatus({ deadline: null });
                }
              }}
              slotProps={{
                actionBar: {
                  actions: ['clear'],
                  'data-testid': 'JourneyMilestoneCard-datePickerActionBar',
                },
              }}
              value={milestone.deadline ? dayjs(milestone.deadline) : null}
            />
          </Box>
        )}
      </Box>
      {milestone.description && (
        <Box mb={4} mt={2}>
          <Container>
            <Typography>{milestone.description}</Typography>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default JourneyMilestoneCard;
