import { FC } from 'react';

import { CellData } from 'features/import/types';
import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import useColumn from 'features/import/hooks/useColumn';
import { useMessages } from 'core/i18n';

interface LnglatPreviewProps {
  fields: Record<string, CellData> | undefined;
  fieldKey: string;
  orgId: number;
}

const formatCoordinate = (value: CellData) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const coordinate = Number(value);
  return isNaN(coordinate)
    ? value.toString()
    : (Math.round(coordinate * 100) / 100).toString();
};

const LnglatPreview: FC<LnglatPreviewProps> = ({ fieldKey, fields, orgId }) => {
  const messages = useMessages(messageIds);
  const { fieldOptions } = useColumn(orgId);

  let columnHeader = '';
  fieldOptions.flat().forEach((columnOp) => {
    if (columnOp.value === `lnglat:${fieldKey}`) {
      columnHeader = columnOp.label;
    }
  });

  const lat = fields?.[`${fieldKey}.lat`];
  const lng = fields?.[`${fieldKey}.lng`];

  return (
    <PreviewGrid
      columnHeader={columnHeader}
      emptyLabel={
        lat === undefined && lng === undefined
          ? messages.configuration.preview.noValue()
          : ''
      }
      rowValue={`${formatCoordinate(lat)}, ${formatCoordinate(lng)}`}
    />
  );
};

export default LnglatPreview;
