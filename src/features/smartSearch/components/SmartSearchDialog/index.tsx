import { Dialog, DialogContent } from '@mui/material';

import SmartSearch from './SmartSearch';
import { ZetkinQuery } from 'utils/types/zetkin';

export interface SmartSearchDialogProps {
  query?: ZetkinQuery | null;
  onDialogClose: () => void;
  onSave: (query: Partial<ZetkinQuery>) => void;
  readOnly?: boolean;
}

const SmartSearchDialog = ({
  onDialogClose,
  onSave,
  query,
  readOnly,
}: SmartSearchDialogProps): JSX.Element => {
  return (
    <Dialog fullWidth maxWidth="xl" onClose={onDialogClose} open>
      <DialogContent style={{ height: '85vh' }}>
        <SmartSearch
          onDialogClose={onDialogClose}
          onSave={onSave}
          query={query}
          readOnly={readOnly}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SmartSearchDialog;
