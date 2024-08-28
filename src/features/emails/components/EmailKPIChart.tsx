import { Box, Paper, Typography, useTheme } from '@mui/material';
import { ResponsiveRadialBar } from '@nivo/radial-bar';
import { FC } from 'react';

import { truncateOnMiddle } from 'utils/stringUtils';
import { ZetkinEmail } from 'utils/types/zetkin';

type Props = {
  mainEmail: ZetkinEmail;
  mainTotal: number;
  mainValue: number;
  secondaryEmail?: ZetkinEmail | null;
  secondaryTotal?: number | null;
  secondaryValue?: number | null;
  title: string;
};

const EmailKPIChart: FC<Props> = ({
  mainEmail,
  mainTotal,
  mainValue,
  secondaryEmail,
  secondaryTotal,
  secondaryValue,
  title,
}) => {
  const theme = useTheme();

  const data = [
    {
      data: [
        {
          x: 'main',
          y: mainValue / mainTotal,
        },
        {
          x: 'secondary',
          y: 0,
        },
        {
          x: 'void',
          y: 1 - mainValue / mainTotal,
        },
      ],
      id: mainEmail.title || '',
    },
  ];

  if (secondaryEmail && secondaryTotal && secondaryValue) {
    data.push({
      data: [
        {
          x: 'main',
          y: 0,
        },
        {
          x: 'secondary',
          y: secondaryValue / secondaryTotal,
        },
        {
          x: 'void',
          y: 1 - secondaryValue / secondaryTotal,
        },
      ],
      id: secondaryEmail.title || '',
    });
  }

  const percentage = Math.round((mainValue / mainTotal) * 100);
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
        <Typography color="primary" variant="h4">
          {percentage + '%'}
        </Typography>
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
            theme.palette.grey[400],
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
          tooltip={(props) => {
            if (props.bar.category == 'void') {
              return null;
            }

            const percentage = Math.round(props.bar.value * 100);

            return (
              <Paper>
                <Box p={1} textAlign="center">
                  <Typography variant="body2">
                    {truncateOnMiddle(props.bar.groupId, 40)}
                  </Typography>
                  <Typography
                    color={
                      props.bar.category == 'main'
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main
                    }
                    variant="h5"
                  >
                    {percentage}%
                  </Typography>
                </Box>
              </Paper>
            );
          }}
          valueFormat=">-.2f"
        />
      </Box>
    </Box>
  );
};

export default EmailKPIChart;
