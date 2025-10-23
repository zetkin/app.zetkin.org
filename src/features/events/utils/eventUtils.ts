import { Theme } from '@mui/material';

export function getParticipantsStatusColor(
  reqParticipants: number,
  availParticipants: number,
  theme: Theme
): string {
  const diff = reqParticipants - availParticipants;

  if (diff <= 0) {
    return theme.palette.statusColors.green;
  } else if (diff === 1) {
    return theme.palette.statusColors.orange;
  } else {
    return theme.palette.statusColors.red;
  }
}
