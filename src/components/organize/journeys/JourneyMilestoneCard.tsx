import { KeyboardDatePicker } from '@material-ui/pickers';
import { useIntl } from 'react-intl';
import { Box, Checkbox, Typography } from '@material-ui/core';

import { ZetkinJourneyMilestoneStatus } from 'types/zetkin';

const JourneyMilestoneCard = ({
  milestone,
}: {
  milestone: ZetkinJourneyMilestoneStatus;
}): JSX.Element => {
  const intl = useIntl();
  return (
    <Box>
      <Checkbox
        checked={milestone.completed ? true : false}
        data-testid="JourneyMilestoneCard-completed"
      />
      <Typography>{milestone.title}</Typography>
      <KeyboardDatePicker
        data-testid="JourneyMilestoneCard-datePicker"
        disableToolbar
        InputAdornmentProps={{ position: 'start' }}
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
        onChange={() => null}
        value={milestone.deadline}
        variant="inline"
      />
      {milestone.description && (
        <Typography>{milestone.description}</Typography>
      )}
    </Box>
  );
};

export default JourneyMilestoneCard;
