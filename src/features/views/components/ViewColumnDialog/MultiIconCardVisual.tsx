import { Box } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';

interface MultiIconCardVisualProps {
  color: string;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, 'svg'>>;
}

const MultiIconCardVisual = ({
  color,
  icon: Icon,
}: MultiIconCardVisualProps) => {
  return (
    <Box
      sx={{
        alignItems: 'center',
        color: color,
        display: 'flex',
        fontSize: '60px',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ backgroundColor: 'background.paper', borderRadius: '50%' }}>
        <Icon sx={{ display: 'block', fontSize: '1em', margin: 2 }} />
      </Box>
      <Box
        component="svg"
        height="82"
        sx={{
          color: 'background.paper',
          fill: 'currentColor',
          marginLeft: '-0.2667em',
          width: '1.0667em',
        }}
        viewBox="0 0 64 82"
        width="64"
      >
        <path d="m0,82c15.02139-7.55172,24-23.0756,24-41.00004S15.0214,7.55171,0,0c19.0336,3.98702,32,20.82876,32,40.99996S19.0336,78.01302,0,82Z" />
        <path d="m16,82c15.02139-7.55172,24-23.0756,24-41.00004S31.0214,7.55171,16,0c19.0336,3.98702,32,20.82876,32,40.99996s-12.9664,37.01306-32,41.00004Z" />
        <path d="m32,82c15.02139-7.55172,24-23.0756,24-41.00004S47.0214,7.55171,32,0c19.0336,3.98702,32,20.82876,32,40.99996s-12.9664,37.01306-32,41.00004Z" />
      </Box>
    </Box>
  );
};

export default MultiIconCardVisual;
