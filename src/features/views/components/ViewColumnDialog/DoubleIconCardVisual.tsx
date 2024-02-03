import { Add } from '@mui/icons-material';
import { Box } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

interface DoubleIconCardVisualProps {
  color: string;
  icons: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>[];
}

const DoubleIconCardVisual = ({ color, icons }: DoubleIconCardVisualProps) => {
  const [FirstIcon, SecondIcon] = icons;
  return (
    <>
      <Box
        alignItems="center"
        bgcolor="white"
        borderRadius="50%"
        display="flex"
        justifyContent="center"
      >
        <FirstIcon sx={{ color: color, fontSize: '60px', margin: 2 }} />
      </Box>
      <Add sx={{ color: 'white', fontSize: '60px' }} />
      <Box
        alignItems="center"
        bgcolor="white"
        borderRadius="50%"
        display="flex"
        justifyContent="center"
      >
        <SecondIcon sx={{ color: color, fontSize: '60px', margin: 2 }} />
      </Box>
    </>
  );
};

export default DoubleIconCardVisual;
