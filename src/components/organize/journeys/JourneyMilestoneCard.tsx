import { DatePicker } from '@material-ui/pickers';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Box, Checkbox, Typography } from '@material-ui/core';
import { useContext, useState } from 'react';

import { journeyMilestoneStatusResource } from 'api/journeys';
import SnackbarContext from 'hooks/SnackbarContext';
import { ZetkinJourneyMilestoneStatus } from 'types/zetkin';

const JourneyMilestoneCard = ({
  milestone,
}: {
  milestone: ZetkinJourneyMilestoneStatus;
}): JSX.Element => {
  const intl = useIntl();
  const { orgId, instanceId } = useRouter().query;
  const { showSnackbar } = useContext(SnackbarContext);

  const [deadline, setDeadline] = useState<string | null>(milestone.deadline);

  const journeyMilestoneStatusHooks = journeyMilestoneStatusResource(
    orgId as string,
    instanceId as string,
    milestone.id.toString()
  );
  const patchJourneyMilestoneStatusMutation =
    journeyMilestoneStatusHooks.useUpdate();

  const saveDeadline = (deadline: string | null) => {
    patchJourneyMilestoneStatusMutation.mutateAsync(
      { deadline },
      {
        onError: () => showSnackbar('error'),
      }
    );
  };

  return (
    <Box data-testid={`JourneyMilestoneCard`}>
      <Checkbox
        checked={milestone.completed ? true : false}
        data-testid="JourneyMilestoneCard-completed"
      />
      <Typography>{milestone.title}</Typography>
      <DatePicker
        clearable
        data-testid="JourneyMilestoneCard-datePicker"
        disableToolbar
        format={intl.formatDate(deadline as string)}
        inputVariant="outlined"
        label={
          milestone.deadline
            ? intl.formatMessage({
                id: 'pages.organizeJourneyInstance.deadlineLabel',
              })
            : intl.formatMessage({
                id: 'pages.organizeJourneyInstance.addDateLabel',
              })
        }
        onChange={(newDeadline) => {
          if (newDeadline && newDeadline.isValid()) {
            setDeadline(newDeadline.toJSON());
            saveDeadline(newDeadline.toJSON());
          } else if (!newDeadline) {
            setDeadline(null);
            saveDeadline(null);
          }
        }}
        value={deadline}
      />
      {milestone.description && (
        <Typography>{milestone.description}</Typography>
      )}
    </Box>
  );
};

export default JourneyMilestoneCard;
