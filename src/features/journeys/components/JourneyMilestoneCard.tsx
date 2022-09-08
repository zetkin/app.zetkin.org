import { DatePicker } from '@material-ui/pickers';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { Box, Checkbox, Container, Typography } from '@material-ui/core';
import { FormattedMessage, useIntl } from 'react-intl';

import { journeyMilestoneStatusResource } from 'features/journeys/api/journeys';
import SnackbarContext from 'zui/utils/SnackbarContext';
import ZetkinDate from 'components/ZetkinDate';
import { ZetkinJourneyMilestoneStatus } from 'utils/types/zetkin';
import ZetkinRelativeTime from 'components/ZetkinRelativeTime';

const JourneyMilestoneCard = ({
  milestone,
}: {
  milestone: ZetkinJourneyMilestoneStatus;
}): JSX.Element => {
  const intl = useIntl();
  const { orgId, instanceId } = useRouter().query;
  const { showSnackbar } = useContext(SnackbarContext);
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
              <FormattedMessage
                id="pages.organizeJourneyInstance.markedCompleteLabel"
                values={{
                  relativeTime: (
                    <ZetkinRelativeTime
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
                <FormattedMessage
                  id="pages.organizeJourneyInstance.deadlineLabel"
                  values={{
                    date: <ZetkinDate datetime={milestone.deadline} />,
                  }}
                />
              </Typography>
            )}
          </Box>
        ) : (
          <DatePicker
            clearable
            data-testid="JourneyMilestoneCard-datePicker"
            disableToolbar
            format={intl.formatDate(milestone.deadline as string)}
            inputVariant="outlined"
            label={intl.formatMessage({
              id: 'pages.organizeJourneyInstance.dueDateInputLabel',
            })}
            onChange={(newDeadline) => {
              if (newDeadline && newDeadline.isValid()) {
                patchMilestoneStatus({ deadline: newDeadline.toJSON() });
              } else if (!newDeadline) {
                // Deadline is cleared
                patchMilestoneStatus({ deadline: null });
              }
            }}
            value={milestone.deadline}
          />
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
