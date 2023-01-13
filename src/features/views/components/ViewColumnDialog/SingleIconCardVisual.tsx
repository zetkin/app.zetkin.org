import { Box } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

interface SingleIconCardVisualProps {
  color: string;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
}

const SingleIconCardVisual = ({
  color,
  icon: Icon,
}: SingleIconCardVisualProps) => {
  return (
    <Box
      alignItems="center"
      bgcolor="white"
      borderRadius="50%"
      display="flex"
      justifyContent="center"
    >
      <Icon sx={{ color: color, fontSize: '60px', margin: 2 }} />
    </Box>
  );
};

export default SingleIconCardVisual;
