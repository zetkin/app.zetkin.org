import { FC } from 'react';
import { GroupWork } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import randomSeed from 'random-seed';
import { Box, Theme } from '@mui/material';

interface StyleProps {
  rgbAverage: number;
}

const useStyles = makeStyles<Theme, StyleProps>((theme) => ({
  icon: {
    color: ({ rgbAverage }) =>
      rgbAverage < 180 ? 'white' : theme.palette.grey[800],
    fontSize: '20px',
  },
}));

interface ProceduralColorIconProps {
  id: number;
}

const ProceduralColorIcon: FC<ProceduralColorIconProps> = ({ id }) => {
  const rand = randomSeed.create(id.toString());
  const r = rand(256);
  const g = rand(256);
  const b = rand(256);
  const rgbAverage = (r + g + b) / 3;

  const classes = useStyles({ rgbAverage });

  return (
    <Box
      sx={{
        backgroundColor: `rgb(${r},${g},${b})`,
        borderRadius: 2,
        display: 'flex',
        padding: 0.5,
      }}
    >
      <GroupWork className={classes.icon} />
    </Box>
  );
};

export default ProceduralColorIcon;
