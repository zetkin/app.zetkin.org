import {
  EmojiPeople,
  FaceRetouchingOff,
  Group,
  MailOutline,
  PlaceOutlined,
  ScheduleOutlined,
} from '@mui/icons-material';

import { Field } from './Event';

export const FieldIcon = ({ field }: { field: Field }) => {
  if (field.kind === 'Participants') {
    return <Group color="inherit" fontSize="inherit" />;
  } else if (field.kind === 'Location') {
    return <PlaceOutlined color="inherit" fontSize="inherit" />;
  } else if (field.kind === 'ScheduledTime') {
    return <ScheduleOutlined color="inherit" fontSize="inherit" />;
  } else if (field.kind === 'RemindersNotSent') {
    return <MailOutline color="inherit" fontSize="inherit" />;
  } else if (field.kind === 'UnbookedSignups') {
    return <EmojiPeople color="inherit" fontSize="inherit" />;
  } else {
    return <FaceRetouchingOff color="inherit" fontSize="inherit" />;
  }
};
