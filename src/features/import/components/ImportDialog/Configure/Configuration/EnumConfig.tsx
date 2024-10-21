import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { EnumColumn } from 'features/import/utils/types';
import { UIDataColumn } from 'features/import/hooks/useUIDataColumn';
import { useNumericRouteParams } from 'core/hooks';
import { Msg, useMessages } from 'core/i18n';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useEnumMapping from 'features/import/hooks/useEnumMapping';
import EnumConfigRow from './EnumConfigRow';

interface EnumConfigProps {
  uiDataColumn: UIDataColumn<EnumColumn>;
}

const EnumConfig: FC<EnumConfigProps> = ({ uiDataColumn }) => {
  const { orgId } = useNumericRouteParams();
  const messages = useMessages(messageIds);
  const { data: fields } = useCustomFields(orgId);
  const { deselectOption, getSelectedOption, selectOption } = useEnumMapping(
    uiDataColumn.originalColumn,
    uiDataColumn.columnIndex
  );

  if (!fields || !fields.length) {
    return null;
  }
  const field = fields.find(
    (field) => field.slug === uiDataColumn.originalColumn.field
  );
  const options = field?.enum_choices;
  if (!options || !options.length) {
    return null;
  }

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
          <Msg id={messageIds.configuration.configure.enum.header} />
        </Typography>
      </Box>

      <Box alignItems="center" display="flex" paddingY={2}>
        <Box width="50%">
          <Typography variant="body2">
            {uiDataColumn.title.toLocaleUpperCase()}
          </Typography>
        </Box>
        <Box width="50%">
          <Typography variant="body2">{field.title}</Typography>
        </Box>
      </Box>
      {uiDataColumn.uniqueValues.map((uniqueValue, index) => (
        <Box key={index}>
          {index != 0 && <Divider sx={{ marginY: 1 }} />}
          <EnumConfigRow
            numRows={uiDataColumn.numRowsByUniqueValue[uniqueValue]}
            onDeselectOption={() => deselectOption(uniqueValue)}
            onSelectOption={(key) => selectOption(key, uniqueValue)}
            options={options}
            selectedOption={getSelectedOption(uniqueValue)}
            title={field.title}
            value={uniqueValue.toString()}
          />
        </Box>
      ))}
      {uiDataColumn.numberOfEmptyRows > 0 && (
        <>
          <Divider sx={{ marginY: 1 }} />
          <EnumConfigRow
            italic
            numRows={uiDataColumn.numberOfEmptyRows}
            onDeselectOption={() => deselectOption(null)}
            onSelectOption={(key) => selectOption(key, null)}
            options={options}
            selectedOption={getSelectedOption(null)}
            title={field.title}
            value={messages.configuration.configure.tags.empty()}
          />
        </>
      )}
    </Box>
  );
};

export default EnumConfig;
