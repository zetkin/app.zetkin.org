import { DatePicker } from '@material-ui/pickers';
import dayjs from 'dayjs';
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
  const [checked, setChecked] = useState<boolean>(
    milestone.completed ? true : false
  );

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

  const saveCompleted = (completed: string | null) => {
    patchJourneyMilestoneStatusMutation.mutateAsync(
      { completed },
      {
        onError: () => showSnackbar('error'),
      }
    );
  };

  return (
    <Box
      alignItems="center"
      data-testid={`JourneyMilestoneCard`}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
      pt={3}
    >
      <Box alignItems="center" display="flex" flexDirection="row">
        <Checkbox
          checked={checked}
          data-testid="JourneyMilestoneCard-completed"
          onChange={(e) => {
            setChecked(e.target.checked);
            const completed = e.target.checked ? dayjs().toJSON() : null;
            saveCompleted(completed);
          }}
        />
        <Typography variant="h6">{milestone.title}</Typography>
      </Box>
      <DatePicker
        clearable
        data-testid="JourneyMilestoneCard-datePicker"
        disableToolbar
        format={intl.formatDate(deadline as string)}
        inputVariant="outlined"
        label={
          !deadline &&
          intl.formatMessage({
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
