import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { GenderColumn } from 'features/import/utils/types';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import { Msg, useMessages } from 'core/i18n';
import GenderConfigRow from './GenderConfigRow';
import useGenderMapping from 'features/import/hooks/useGenderMapping';

interface GenderConfigProps {
  uiDataColumn: UIDataColumn<GenderColumn>;
}

const GenderConfig: FC<GenderConfigProps> = ({ uiDataColumn }) => {
  const messages = useMessages(messageIds);
  const { selectGender, getSelectedGender, deselectGender } = useGenderMapping(
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      overflow="hidden"
      padding={2}
      sx={{ overflowY: 'auto' }}
    >
      <Box alignItems="baseline" display="flex" justifyContent="space-between">
        <Typography sx={{ paddingBottom: 2 }} variant="h5">
          <Msg id={messageIds.configuration.configure.tags.header} />
        </Typography>
      </Box>
      <Box alignItems="center" display="flex" paddingY={2}>
        <Box width="50%">
          <Typography variant="body2">
            {uiDataColumn.title.toLocaleUpperCase()}
          </Typography>
        </Box>
        <Box width="50%">
          <Typography variant="body2">
            {messages.configuration.configure.genders
              .label()
              .toLocaleUpperCase()}
          </Typography>
        </Box>
      </Box>
      {uiDataColumn.uniqueValues.map((uniqueValue, index) => (
        <>
          {index != 0 && <Divider sx={{ marginY: 1 }} />}
          <GenderConfigRow
            numRows={uiDataColumn.numRowsByUniqueValue[uniqueValue]}
            onDeselectGender={() => deselectGender(uniqueValue)}
            onSelectGender={(gender) => selectGender(gender, uniqueValue)}
            selectedGender={getSelectedGender(uniqueValue)}
            title={uniqueValue.toString()}
          />
        </>
      ))}
    </Box>
  );
};

export default GenderConfig;
