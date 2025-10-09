import { Add, MoreHoriz, Remove } from '@mui/icons-material';
import { Box, Divider, IconButton } from '@mui/material';
import { FC, useState } from 'react';

import range from 'utils/range';
import { EditedFloor } from './types';
import useResizeObserver from 'zui/hooks/useResizeObserver';
import HouseholdSquare from './HouseholdSquare';

type Props = {
  draft: EditedFloor;
  onChange: (draft: EditedFloor) => void;
};

const FloorEditor: FC<Props> = ({ draft, onChange }) => {
  const [gridWidth, setGridWidth] = useState(3);
  const { level, draftHouseholdCount, existingHouseholds } = draft;

  const ref = useResizeObserver((elem) => {
    const gridUnit = 54;
    setGridWidth(Math.floor(elem.clientWidth / gridUnit));
  });

  const totalHouseholdCount = existingHouseholds.length + draftHouseholdCount;
  const mustUseEllipsis = totalHouseholdCount > gridWidth;
  const discreetHouseholds = mustUseEllipsis
    ? gridWidth - 2
    : totalHouseholdCount;

  return (
    <Box>
      <Divider />
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 0.5,
          justifyContent: 'stretch',
          ml: '54px',
          my: '2px',
        }}
      >
        <input
          style={{ fontSize: 20, height: 50, textAlign: 'center', width: 50 }}
          value={level}
        />
        <Box
          ref={ref}
          sx={{
            display: 'flex',
            flexGrow: 1,
            gap: 0.5,
            overflowX: 'hidden',
          }}
        >
          {!!gridWidth &&
            range(discreetHouseholds).map((index) => {
              const existingHousehold = existingHouseholds[index];
              const isDraft = !existingHousehold;

              return (
                <HouseholdSquare
                  key={index}
                  active={isDraft}
                  color={existingHousehold?.color}
                  content={index + 1}
                />
              );
            })}
          {mustUseEllipsis && (
            <>
              <Box
                sx={{
                  alignItems: 'center',
                  borderRadius: 1,
                  display: 'flex',
                  flexShrink: 0,
                  height: 50,
                  justifyContent: 'center',
                  width: 50,
                }}
              >
                <MoreHoriz />
              </Box>
              <HouseholdSquare
                active={draftHouseholdCount > 0}
                content={totalHouseholdCount}
              />
            </>
          )}
        </Box>
        <Box sx={{ flexGrow: 0, flexShrink: 0 }}>
          <IconButton
            disabled={draft.draftHouseholdCount == 0}
            onClick={() =>
              onChange({
                ...draft,
                draftHouseholdCount: draft.draftHouseholdCount - 1,
              })
            }
          >
            <Remove />
          </IconButton>
          <IconButton
            onClick={() =>
              onChange({
                ...draft,
                draftHouseholdCount: draft.draftHouseholdCount + 1,
              })
            }
          >
            <Add />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default FloorEditor;
