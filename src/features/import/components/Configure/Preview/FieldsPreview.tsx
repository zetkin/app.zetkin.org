import { Box, Typography, useTheme } from '@mui/material';

import { CellData } from 'features/import/utils/types';
import messageIds from 'features/import/l10n/messageIds';
import useColumnOptions from 'features/import/hooks/useColumnOptions';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';

interface FieldsPreviewProps {
  fields: [string, CellData];
}
const FieldsPreview = ({ fields }: FieldsPreviewProps) => {
  const { orgId } = useNumericRouteParams();
  const theme = useTheme();
  const columnOptions = useColumnOptions(orgId);
  const messages = useMessages(messageIds);
  const fieldKey = fields[0];
  const value = fields[1];

  const idColumnHeader =
    fieldKey === 'id'
      ? messages.configuration.preview.columnHeader.int()
      : fieldKey === 'ext_id'
      ? messages.configuration.preview.columnHeader.ext()
      : '';

  let fieldColumnHeader = '';
  columnOptions.forEach((columnOp) => {
    if (columnOp.value === `field:${fieldKey}`) {
      fieldColumnHeader = columnOp.label;
    }
  });
  return (
    <>
      <Box
        key={`field-preview-${fieldKey}`}
        flexGrow={1}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 'fit-content',
          overflowX: 'auto',
          padding: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor:
              idColumnHeader !== '' || fieldColumnHeader !== ''
                ? 'transparent'
                : theme.palette.transparentGrey.light,
            height: '14px',
            mb: 0.5,
            minWidth: '150px',
          }}
        >
          <Typography
            fontSize="12px"
            sx={{
              color: theme.palette.grey['600'],
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
            variant="body1"
          >
            {idColumnHeader || fieldColumnHeader}
          </Typography>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
          }}
        >
          <Typography variant="body1">{value}</Typography>
        </Box>
      </Box>
      {/* {Object.entries(fields).map((field) => {
        const [fieldKey, value] = field;
        const idColumnHeader =
          fieldKey === 'id'
            ? messages.configuration.preview.columnHeader.int()
            : fieldKey === 'ext_id'
            ? messages.configuration.preview.columnHeader.ext()
            : '';

        let fieldColumnHeader = '';
        columnOptions.forEach((columnOp) => {
          if (columnOp.value === `field:${fieldKey}`) {
            fieldColumnHeader = columnOp.label;
          }
        });
        return (
          <Box
            key={`field-preview-${fieldKey}`}
            flexGrow={1}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              minWidth: 'fit-content',
              overflowX: 'auto',
              padding: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor:
                  idColumnHeader !== '' || fieldColumnHeader !== ''
                    ? 'transparent'
                    : theme.palette.transparentGrey.light,
                height: '14px',
                mb: 0.5,
                minWidth: '150px',
              }}
            >
              <Typography
                fontSize="12px"
                sx={{
                  color: theme.palette.grey['600'],
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
                variant="body1"
              >
                {idColumnHeader || fieldColumnHeader}
              </Typography>
            </Box>
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
              }}
            >
              <Typography variant="body1">{value}</Typography>
            </Box>
          </Box>
        );
      })} */}
    </>
  );
};

export default FieldsPreview;
