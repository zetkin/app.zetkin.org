import { CellData } from 'features/import/utils/types';
import messageIds from 'features/import/l10n/messageIds';
import PreviewGrid from './PreviewGrid';
import { useMessages } from 'core/i18n';

interface EmptyPreviewProps {
  rowValue: CellData;
}

const EmptyPreview = ({ rowValue }: EmptyPreviewProps) => {
  const messages = useMessages(messageIds);
  return (
    <PreviewGrid
      emptyLabel={!rowValue ? messages.configuration.preview.noValue() : ''}
      rowValue={rowValue}
    />
  );
};

export default EmptyPreview;
