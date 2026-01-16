import { FC } from 'react';
import { ChevronLeft, ChevronRight, Close, Search } from '@mui/icons-material';
import { Box, Divider, IconButton, TextField, Typography } from '@mui/material';

import { Zetkin2Area } from 'features/areas/types';
import { Msg, useMessages } from 'core/i18n';
import messageIdsAss from 'features/areaAssignments/l10n/messageIds';
import messageIdsAreas from 'features/areas/l10n/messageIds';
import { ZUIExpandableText } from 'zui/ZUIExpandableText';

type Props = {
  matchingAreas: Zetkin2Area[];
  onBackToList: () => void;
  onClose: () => void;
  onSearchQueryChange: (newValue: string) => void;
  onSelectAreaId: (selectedId: number) => void;
  searchQuery: string;
  selectedArea: Zetkin2Area | null;
};

const AreaSelectPanel: FC<Props> = ({
  matchingAreas,
  searchQuery,
  onBackToList,
  onClose,
  onSearchQueryChange,
  onSelectAreaId,
  selectedArea,
}) => {
  const messagesAss = useMessages(messageIdsAss);
  const messagesAreas = useMessages(messageIdsAreas);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
    >
      <Box>
        <Box alignItems="center" display="flex" justifyContent="space-between">
          <Box alignItems="center" display="flex">
            {selectedArea && (
              <IconButton onClick={onBackToList} sx={{ mr: 1, padding: 0 }}>
                <ChevronLeft />
              </IconButton>
            )}
            <Typography variant="h5">
              {selectedArea ? (
                selectedArea.title || messagesAreas.areas.default.title()
              ) : (
                <Msg id={messageIdsAss.map.findArea.title} />
              )}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        {selectedArea && (
          <Typography
            color="secondary"
            mb={1}
            sx={{ overflowWrap: 'anywhere' }}
          >
            <ZUIExpandableText
              content={
                selectedArea.description?.trim() ||
                messagesAreas.areas.default.description()
              }
              maxVisibleChars={110}
            />
          </Typography>
        )}
      </Box>
      <Divider />
      {!selectedArea && (
        <Box
          display="flex"
          flexDirection="column"
          gap={1}
          overflow="hidden"
          paddingTop={2}
        >
          <TextField
            InputProps={{
              endAdornment: <Search color="secondary" />,
            }}
            onChange={(evt) => onSearchQueryChange(evt.target.value)}
            placeholder={messagesAss.map.findArea.filterPlaceHolder()}
            size="small"
            value={searchQuery}
            variant="outlined"
          />
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            sx={{ overflowY: 'auto' }}
          >
            {matchingAreas.map((area, index) => (
              <Box key={area.id}>
                {index != 0 && <Divider sx={{ my: 1 }} />}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  onClick={() => onSelectAreaId(area.id)}
                  role="button"
                  sx={{
                    '&:hover': {
                      color: 'primary.main',
                    },
                    cursor: 'pointer',
                    pt: index == 0 ? 1 : 0,
                  }}
                >
                  <Typography>
                    {area.title || messagesAreas.areas.default.title()}
                  </Typography>
                  <Box alignItems="center" display="flex">
                    <ChevronRight />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AreaSelectPanel;
