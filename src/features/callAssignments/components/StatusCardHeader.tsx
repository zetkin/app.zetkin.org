import { Box, Divider, Theme, Typography, useTheme } from '@mui/material';

import ZUIAnimatedNumber from 'zui/ZUIAnimatedNumber';
import ZUINumberChip from 'zui/ZUINumberChip';

interface StatusCardHeaderProps {
  chipColor: keyof Theme['palette']['statusColors'];
  subtitle: string;
  title: string;
  value: number | undefined;
}

const StatusCardHeader = ({
  chipColor,
  subtitle,
  title,
  value,
}: StatusCardHeaderProps) => {
  const theme = useTheme();
  const color = theme.palette.statusColors[chipColor];
  return (
    <Box>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        p={2}
      >
        <Box>
          <Typography variant="h4">{title}</Typography>
          <Typography color="secondary">{subtitle}</Typography>
        </Box>
        {value != undefined && (
          <ZUIAnimatedNumber value={value || 0}>
            {(animatedValue) => (
              <ZUINumberChip color={color} size="lg" value={animatedValue} />
            )}
          </ZUIAnimatedNumber>
        )}
      </Box>
      <Divider />
    </Box>
  );
};

export default StatusCardHeader;
