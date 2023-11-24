import { Box } from '@mui/system';
import { FC } from 'react';
import { Typography, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import useFieldTitle from 'features/import/hooks/useFieldTitle';
import {
  ZetkinCustomField,
  ZetkinPersonNativeFields,
} from 'utils/types/zetkin';

interface ChangedFieldsProps {
  changedFields: {
    [key in
      | keyof Partial<ZetkinPersonNativeFields>
      | keyof Partial<ZetkinCustomField>]?: number;
  };
  orgId: number;
}

const ChangedFields: FC<ChangedFieldsProps> = ({ changedFields, orgId }) => {
  const theme = useTheme();
  const getFieldTitle = useFieldTitle(orgId);
  return (
    <>
      {Object.entries(changedFields).map((field) => {
        const [fieldSlug, numChanges] = field;
        return (
          <Box
            key={fieldSlug}
            border={1}
            borderColor={theme.palette.grey[300]}
            borderRadius={1}
            display="flex"
            padding={2}
          >
            <Typography
              component="span"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}
            >
              <Msg
                id={messageIds.validation.updateOverview.defaultDesc}
                values={{
                  field: (
                    <Typography fontWeight="bold" marginX={0.5}>
                      {getFieldTitle(fieldSlug)}
                    </Typography>
                  ),
                  numPeople: (
                    <Typography
                      component="span"
                      marginRight={0.5}
                      sx={{ display: 'flex' }}
                    >
                      <Msg
                        id={messageIds.validation.updateOverview.people}
                        values={{
                          numPeople: numChanges,
                          number: (
                            <Typography fontWeight="bold" sx={{ mr: 0.5 }}>
                              {numChanges}
                            </Typography>
                          ),
                        }}
                      />
                    </Typography>
                  ),
                }}
              />
            </Typography>
          </Box>
        );
      })}
    </>
  );
};

export default ChangedFields;
