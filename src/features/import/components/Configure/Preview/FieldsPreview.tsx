import { Typography, useTheme } from '@mui/material';

import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import useColumnOptions from 'features/import/hooks/useColumnOptions';
import { useNumericRouteParams } from 'core/hooks';
import { CellData, ColumnKind } from 'features/import/utils/types';
import { Msg, useMessages } from 'core/i18n';

interface FieldsPreviewProps {
  fieldKey: string | null;
  fields: Record<string, CellData> | undefined;
  kind: ColumnKind;
}
const FieldsPreview = ({ fieldKey, fields, kind }: FieldsPreviewProps) => {
  const { orgId } = useNumericRouteParams();
  const columnOptions = useColumnOptions(orgId);
  const messages = useMessages(messageIds);
  const theme = useTheme();
  let idColumnHeader = '';

  if (kind === ColumnKind.ID_FIELD) {
    idColumnHeader =
      fieldKey === 'id'
        ? messages.configuration.preview.columnHeader.int()
        : fieldKey === 'ext_id'
        ? messages.configuration.preview.columnHeader.ext()
        : '';
  }

  let fieldColumnHeader = '';
  columnOptions.forEach((columnOp) => {
    if (columnOp.value === `field:${fieldKey}`) {
      fieldColumnHeader = columnOp.label;
    }
  });

  return (
    <PreviewGrid
      columnHeader={idColumnHeader || fieldColumnHeader}
      rowValue={
        (fieldKey === null && fields?.['null']) ||
        fields?.[fieldKey!] || (
          <Typography
            sx={{ color: theme.palette.grey[400], fontStyle: 'italic' }}
          >
            ({<Msg id={messageIds.configuration.preview.noValue} />})
          </Typography>
        )
      }
    />
  );
};

export default FieldsPreview;
