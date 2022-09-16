import { ExpandMore } from '@material-ui/icons';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { Box, Button, Popover, Typography } from '@material-ui/core';
import { FunctionComponent, useState } from 'react';

import noPropagate from 'utils/noPropagate';
import { ViewGridCellParams } from '.';

interface SurveyResponse {
  submission_id: number;
  text: string;
}

export type SurveyResponseParams = ViewGridCellParams<SurveyResponse[] | null>;

interface SurveyResponseViewCellProps {
  params: GridRenderCellParams;
}

const SurveyResponseViewCell: FunctionComponent<
  SurveyResponseViewCellProps
> = ({ params }) => {
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const rawValue: SurveyResponse[] = params?.row && params.row[params?.field];

  if (rawValue?.length) {
    return (
      <>
        <Box
          alignItems="center"
          display="flex"
          onClick={noPropagate((ev) => setAnchorEl(ev?.target as Element))}
        >
          <Button>
            <ExpandMore />
          </Button>
          <Typography
            style={{
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {rawValue[0].text}
          </Typography>
        </Box>
        <Popover
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          open={Boolean(anchorEl)}
        >
          {rawValue.map((response) => (
            <Box key={response.submission_id} m={2}>
              <Typography>{response.text}</Typography>
            </Box>
          ))}
        </Popover>
      </>
    );
  }

  return null;
};

export default SurveyResponseViewCell;
