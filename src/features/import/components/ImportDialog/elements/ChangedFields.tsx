import { Box } from '@mui/system';
import { FC } from 'react';
import { Typography, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import { Msg } from 'core/i18n';
import useFieldTitle from 'utils/hooks/useFieldTitle';
import { ZetkinPersonNativeFields } from 'utils/types/zetkin';

interface ChangedFieldsProps {
  changedFields: {
    [key in keyof Partial<ZetkinPersonNativeFields> | string]?: number;
  };
  initializedFields: {
    [key in keyof Partial<ZetkinPersonNativeFields> | string]?: number;
  };
  orgId: number;
}

const ChangedFields: FC<ChangedFieldsProps> = ({
  changedFields,
  initializedFields,
  orgId,
}) => {
  const theme = useTheme();
  const getFieldTitle = useFieldTitle(orgId);

  const updatedSlugs = new Set([
    ...Object.keys(changedFields),
    ...Object.keys(initializedFields),
  ]);

  return (
    <>
      {Array.from(updatedSlugs).map((fieldSlug) => {
        const numChanges =
          (changedFields[fieldSlug] || 0) + (initializedFields[fieldSlug] || 0);

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
