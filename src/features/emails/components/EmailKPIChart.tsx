import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveRadialBar } from '@nivo/radial-bar';
import { FC } from 'react';

import { ZetkinEmail } from 'utils/types/zetkin';

type Props = {
  email: ZetkinEmail;
  title: string;
  total: number;
  value: number;
};

const EmailKPIChart: FC<Props> = ({ email, title, total, value }) => {
  const theme = useTheme();

  const data = [
    {
      data: [
        {
          x: 'Opened',
          y: value,
        },
        {
          x: 'Opened 2',
          y: 0,
        },
      ],
      id: email.title || '',
    },
  ];

  const percentage = Math.round((value / total) * 100);

  return (
    <Box
      sx={{
        aspectRatio: '1/1',
        height: 'auto',
        position: 'relative',
        width: '100%',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          height: '40%',
          justifyContent: 'center',
          left: '30%',
          position: 'absolute',
          top: '30%',
          width: '40%',
        }}
      >
        <Typography variant="body2">{title}</Typography>
        <Typography variant="h4">{percentage + '%'}</Typography>
        <Typography color={theme.palette.grey[700]} variant="body2" />
      </Box>
      <Box sx={{ height: '100%', width: '100%' }}>
        <ResponsiveRadialBar
          circularAxisOuter={null}
          colors={[theme.palette.primary.main, theme.palette.grey[500]]}
          cornerRadius={2}
          data={data}
          enableCircularGrid={false}
          enableRadialGrid={false}
          endAngle={360}
          innerRadius={0.6}
          maxValue={total}
          padding={0.4}
          radialAxisStart={null}
          tracksColor={theme.palette.grey[100]}
          valueFormat=">-.2f"
        />
      </Box>
    </Box>
  );
};

export default EmailKPIChart;
