import { useIntl } from 'react-intl';
import { Box, Typography } from '@mui/material';
import { Schedule, VisibilityOutlined } from '@mui/icons-material';

import { EyeClosed } from 'zui/icons/EyeClosed';
import { isToday } from 'date-fns';
import messageIds from 'zui/l10n/messageIds';
import { useMessages } from 'core/i18n';
import { isInFuture, isInPast } from 'utils/dateUtils';

function getIcon(end?: string, start?: string) {
  if (!start) {
    return <EyeClosed />;
  } else {
    if (isInFuture(start)) {
      return <Schedule color="secondary" />;
    }
    if (end && isInPast(end)) {
      return <EyeClosed />;
    }
    return <VisibilityOutlined color="secondary" />;
  }
}

interface ZUIPublishDateProps {
  end?: string;
  start?: string;
}

const ZUIPublishDate = ({ end, start }: ZUIPublishDateProps) => {
  const intl = useIntl();
  const messages = useMessages(messageIds);

  const icon = getIcon(end, start);
  let message: string;
  let startDate: string;
  let endDate: string;

  if (
    end &&
    isInFuture(end) &&
    start &&
    (isInPast(start) || isToday(new Date(start)))
  ) {
    //Visible with end date
    startDate = intl.formatDate(start, {
      day: 'numeric',
      month: 'long',
    });
    endDate = intl.formatDate(end, {
      day: 'numeric',
      month: 'long',
    });

    message = messages.publishDate.visibleWithEndDate({ endDate, startDate });
  } else if (!end && start && isInPast(start)) {
    //Visible onwards
    startDate = intl.formatDate(start, {
      day: 'numeric',
      month: 'long',
    });

    message = messages.publishDate.visibleOnwards({
      startDate,
    });
  } else if (end && isInFuture(end) && start && isInFuture(start)) {
    //Scheduled with end date
    startDate = intl.formatDate(start, {
      day: 'numeric',
      month: 'long',
    });
    endDate = intl.formatDate(end, {
      day: 'numeric',
      month: 'long',
    });
    message = messages.publishDate.scheduledWithEndDate({
      endDate,
      startDate,
    });
  } else if (!end && start && isInFuture(start)) {
    //Scheduled onwards
    startDate = intl.formatDate(start, {
      day: 'numeric',
      month: 'long',
    });

    message = messages.publishDate.scheduledOnwards({
      startDate,
    });
  } else {
    //Invisible
    message = messages.publishDate.invisible();
  }

  return (
    <Box alignItems="center" display="flex">
      {icon}
      <Typography color="secondary" sx={{ paddingLeft: 0.5 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default ZUIPublishDate;
