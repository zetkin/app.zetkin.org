import { Box } from '@mui/material';
import { FC } from 'react';
import { GroupWork } from '@mui/icons-material';
import randomSeed from 'random-seed';

interface ProceduralColorIconProps {
  id: number;
}

const ProceduralColorIcon: FC<ProceduralColorIconProps> = ({ id }) => {
  const rand = randomSeed.create(id.toString());

  const r = rand(256);
  const g = rand(256);
  const b = rand(256);
  const rgbAverage = (r + g + b) / 3;

  return (
    <Box
      sx={{
        backgroundColor: `rgb(${r},${g},${b})`,
        borderRadius: 2,
        display: 'flex',
        padding: 0.5,
      }}
    >
      <GroupWork
        fontSize="large"
        sx={{ color: rgbAverage < 180 ? 'white' : 'black' }}
      />
    </Box>
  );
};

export default ProceduralColorIcon;
