import { FC } from 'react';

import { CellData } from 'features/import/utils/types';
import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import useColumn from 'features/import/hooks/useColumn';
import { useMessages } from 'core/i18n';

interface DatePreviewProps {
  fields: Record<string, CellData> | undefined;
  fieldKey: string;
  orgId: number;
}

const DatePreview: FC<DatePreviewProps> = ({ fieldKey, fields, orgId }) => {
  const messages = useMessages(messageIds);
  const { fieldOptions } = useColumn(orgId);

  let columnHeader = '';
  fieldOptions.flat().forEach((columnOp) => {
    if (columnOp.value === `date:${fieldKey}`) {
      columnHeader = columnOp.label;
    }
  });

  const value = fields?.[fieldKey];

  return (
    <PreviewGrid
      columnHeader={columnHeader}
      emptyLabel={
        !value ? messages.configuration.configure.dates.emptyPreview() : ''
      }
      rowValue={value || ''}
      unmappedRow={!value}
    />
  );
};

export default DatePreview;
