import { Box, Typography, useTheme } from '@mui/material';
import { ResponsiveRadialBar } from '@nivo/radial-bar';
import { FC } from 'react';

import { ZetkinEmail } from 'utils/types/zetkin';

type Props = {
  email: ZetkinEmail;
  secondaryEmail?: ZetkinEmail | null;
  secondaryTotal?: number | null;
  secondaryValue?: number | null;
  title: string;
  total: number;
  value: number;
};

const EmailKPIChart: FC<Props> = ({
  email,
  secondaryEmail,
  secondaryTotal,
  secondaryValue,
  title,
  total,
  value,
}) => {
  const theme = useTheme();

  const data = [
    {
      data: [
        {
          x: 'Opened',
          y: value / total,
        },
        {
          x: 'Opened 2',
          y: 0,
        },
        {
          x: 'Other',
          y: 1 - value / total,
        },
      ],
      id: email.title || '',
    },
  ];

  if (secondaryEmail && secondaryTotal && secondaryValue) {
    data.push({
      data: [
        {
          x: 'Opened',
          y: 0,
        },
        {
          x: 'Opened 2',
          y: secondaryValue / secondaryTotal,
        },
        {
          x: 'Other',
          y: 1 - secondaryValue / secondaryTotal,
        },
      ],
      id: secondaryEmail.title || '',
    });
  }

  const percentage = Math.round((value / total) * 100);
  const secondaryPercentage =
    secondaryValue && secondaryTotal
      ? Math.round((secondaryValue / secondaryTotal) * 100)
      : -1;

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
        <Typography color={theme.palette.grey[700]} variant="body2">
          {secondaryPercentage >= 0 &&
            secondaryPercentage.toString().concat('%')}
        </Typography>
      </Box>
      <Box sx={{ height: '100%', width: '100%' }}>
        <ResponsiveRadialBar
          circularAxisOuter={null}
          colors={[
            theme.palette.primary.main,
            theme.palette.grey[500],
            theme.palette.grey[100],
          ]}
          cornerRadius={2}
          data={data}
          enableCircularGrid={false}
          enableRadialGrid={false}
          endAngle={360}
          innerRadius={0.6}
          padding={0.4}
          radialAxisStart={null}
          valueFormat=">-.2f"
        />
      </Box>
    </Box>
  );
};

export default EmailKPIChart;
