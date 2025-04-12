import oldTheme from 'theme';

export function getParticipantsStatusColor(
  reqParticipants: number,
  availParticipants: number
): string {
  const diff = reqParticipants - availParticipants;

  if (diff <= 0) {
    return oldTheme.palette.statusColors.green;
  } else if (diff === 1) {
    return oldTheme.palette.statusColors.orange;
  } else {
    return oldTheme.palette.statusColors.red;
  }
}
