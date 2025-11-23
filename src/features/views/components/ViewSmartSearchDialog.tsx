import { FunctionComponent } from 'react';

import useViewDataTableMutations from '../hooks/useViewDataTableMutations';
import { ZetkinView } from 'features/views/components/types';
import SmartSearchDialog, {
  SmartSearchDialogProps,
} from 'features/smartSearch/components/SmartSearchDialog';
import { ZetkinSmartSearchFilter } from 'utils/types/zetkin';

interface ViewSmartSearchDialogProps {
  initialSmartSearchFilter?: ZetkinSmartSearchFilter[];
  onDialogClose: SmartSearchDialogProps['onDialogClose'];
  orgId: number;
  view: ZetkinView;
}

const ViewSmartSearchDialog: FunctionComponent<ViewSmartSearchDialogProps> = ({
  initialSmartSearchFilter,
  orgId,
  view,
  ...dialogProps
}) => {
  const { updateContentQuery } = useViewDataTableMutations(orgId, view.id);

  return (
    <SmartSearchDialog
      {...dialogProps}
      initialSmartSearchFilter={initialSmartSearchFilter}
      onSave={(query) => {
        updateContentQuery(query);
        dialogProps.onDialogClose();
      }}
      query={view.content_query}
    />
  );
};

export default ViewSmartSearchDialog;
