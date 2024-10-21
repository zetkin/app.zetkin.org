import { Box, Paper, Typography, useTheme } from '@mui/material';
import { ResponsiveRadialBar } from '@nivo/radial-bar';
import { FC } from 'react';

type Props = {
  mainTotal: number;
  mainValue: number;
  rawYes: number;
  title: string;
};

const MetricRadialBar: FC<Props> = ({
  mainTotal,
  mainValue,
  rawYes,
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
          x: 'void',
          y: 1 - mainValue / mainTotal,
        },
      ],
      id: title || '',
    },
  ];

  const percentage = Math.round((mainValue / mainTotal) * 100);

  return (
    <Box
      sx={{
        aspectRatio: '1/1',
        height: 'auto',
        position: 'relative',
        width: '100%',
      }}
    >
      <Typography>{title}</Typography>
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
        <Typography color="primary" variant="h4">
          {percentage + '%'}
        </Typography>
        <Typography color="secondary">
          {rawYes}/{mainTotal}
        </Typography>
      </Box>
      <Box sx={{ height: '100%', width: '100%' }}>
        <ResponsiveRadialBar
          circularAxisOuter={null}
          colors={[theme.palette.primary.main, theme.palette.grey[100]]}
          cornerRadius={2}
          data={data}
          enableCircularGrid={false}
          enableRadialGrid={false}
          endAngle={360}
          innerRadius={0.6}
          padding={0.4}
          radialAxisStart={null}
          tooltip={(props) => {
            const percentage = Math.round(props.bar.value * 100);
            return (
              <Paper>
                <Box p={1} textAlign="center">
                  <Typography variant="body2">{props.bar.groupId}</Typography>
                  <Typography color={theme.palette.primary.main} variant="h5">
                    {props.bar.category === 'main'
                      ? `Yes: ${percentage}%`
                      : `No: ${percentage}%`}
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

export default MetricRadialBar;
