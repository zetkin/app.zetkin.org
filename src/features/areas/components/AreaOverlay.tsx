import { FC } from 'react';
import { Link, Paper, Typography } from '@mui/material';

import { ZetkinArea } from '../types';

type Props = {
  area: ZetkinArea;
};

const AreaOverlay: FC<Props> = ({ area }) => {
  const hostAndPath = `${window?.location.host}/o/${area.organization.id}/areas/${area.id}`;
  const href = `${window?.location.protocol}//${hostAndPath}`;

  return (
    <Paper
      sx={{
        bottom: '1rem',
        minWidth: 400,
        padding: 2,
        position: 'absolute',
        right: '1rem',
        top: '1rem',
        zIndex: 9999,
      }}
    >
      <Typography variant="h5">{area.id}</Typography>
      <Typography>
        <Link href={href} target="_blank">
          {hostAndPath}
        </Link>
      </Typography>
    </Paper>
  );
};

export default AreaOverlay;
