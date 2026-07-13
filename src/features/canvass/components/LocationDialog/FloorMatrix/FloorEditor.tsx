import { Add, MoreHoriz, Remove } from '@mui/icons-material';
import { Box, IconButton } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import range from 'utils/range';
import { EditedFloor } from './types';
import useResizeObserver from 'zui/hooks/useResizeObserver';
import HouseholdSquare from './HouseholdSquare';
import { GRID_GAP, GRID_SQUARE, GRID_SQUARE_WITH_GAP } from './constants';

type Props = {
  draft: EditedFloor;
  levelEnabled: boolean;
  onChange: (draft: EditedFloor) => void;
  onDelete: () => void;
  onLevelChange: (newLevel: number) => void;
};

const FloorEditor: FC<Props> = ({
  draft,
  levelEnabled,
  onChange,
  onDelete,
  onLevelChange,
}) => {
  const [gridWidth, setGridWidth] = useState(3);
  const [level, setLevel] = useState(draft.level);
  const { draftHouseholdCount, existingHouseholds } = draft;

  useEffect(() => {
    setLevel(draft.level);
  }, [draft.level]);

  const ref = useResizeObserver((elem) => {
    setGridWidth(Math.floor(elem.clientWidth / GRID_SQUARE_WITH_GAP));
  });

  const totalHouseholdCount = existingHouseholds.length + draftHouseholdCount;
  const mustUseEllipsis = totalHouseholdCount > gridWidth;
  const discreetHouseholds = mustUseEllipsis
    ? gridWidth - 2
    : totalHouseholdCount;

  return (
    <Box>
      <Box
        sx={{
          alignItems: 'center',
          borderTop: '1px solid #eee',
          display: 'flex',
          gap: 0.5,
          justifyContent: 'stretch',
          mb: GRID_GAP + 'px',
          ml: GRID_SQUARE + 'px',
          paddingTop: GRID_GAP + 'px',
        }}
      >
        <form
          onSubmit={(ev) => {
            ev.preventDefault();
            if (level != draft.level) {
              onLevelChange(level);
            }
          }}
        >
          <input
            defaultValue={level}
            disabled={!levelEnabled}
            onBlur={() => {
              if (level != draft.level) {
                onLevelChange(level);
              }
            }}
            onChange={(ev) => {
              const newLevel = parseInt(ev.currentTarget.value);
              if (!isNaN(newLevel)) {
                setLevel(newLevel);
              }
            }}
            style={{
              fontSize: 20,
              height: GRID_SQUARE,
              textAlign: 'center',
              width: GRID_SQUARE,
            }}
            type="number"
          />
        </form>
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
                  height: GRID_SQUARE,
                  justifyContent: 'center',
                  width: GRID_SQUARE,
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
            disabled={
              draft.existingHouseholds.length > 0 &&
              draft.draftHouseholdCount == 0
            }
            onClick={() => {
              if (totalHouseholdCount == 0) {
                onDelete();
              } else {
                onChange({
                  ...draft,
                  draftHouseholdCount: draft.draftHouseholdCount - 1,
                });
              }
            }}
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
