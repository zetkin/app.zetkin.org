import { FunctionComponent } from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { Box, Typography } from '@material-ui/core';

import { ViewGridCellParams } from '.';
import { ZetkinPerson } from 'types/zetkin';

export type LocalPersonParams = ViewGridCellParams<ZetkinPerson | null>;

interface LocalPersonViewCellProps {
  orgId: number | string;
  params: GridRenderCellParams;
}

const LocalPersonViewCell: FunctionComponent<LocalPersonViewCellProps> = ({
  orgId,
  params,
}) => {
  const person = params?.row && params.row[params.field];
  if (person) {
    const name = `${person.first_name} ${person.last_name}`;

    return (
      <Box
        alignItems="center"
        display="flex"
        height="100%"
        justifyContent="center"
        width="100%"
      >
        <Box
          p={0}
          style={{
            height: '2em',
            width: '2em',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={name}
            src={`/api/orgs/${orgId}/people/${person.id}/avatar`}
            style={{
              height: '100%',
              width: '100%',
            }}
          />
        </Box>
        {params.colDef.width && params.colDef.width >= 100 && (
          <Typography
            style={{
              marginLeft: '5px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: 'calc(100% - 2em)',
            }}
          >
            {name}
          </Typography>
        )}
      </Box>
    );
  }
  return null;
};

export default LocalPersonViewCell;
