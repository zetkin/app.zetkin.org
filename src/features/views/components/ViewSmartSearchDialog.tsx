import { FunctionComponent } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import defaultFetch from 'utils/fetching/defaultFetch';
import { ZetkinQuery } from 'features/smartSearch/components/types';
import { ZetkinView } from 'features/views/components/types';
import SmartSearchDialog, {
  SmartSearchDialogProps,
} from 'features/smartSearch/components/SmartSearchDialog';

interface ViewSmartSearchDialogProps {
  onDialogClose: SmartSearchDialogProps['onDialogClose'];
  orgId: string | number;
  view: ZetkinView;
}

const ViewSmartSearchDialog: FunctionComponent<ViewSmartSearchDialogProps> = ({
  orgId,
  view,
  ...dialogProps
}) => {
  const queryClient = useQueryClient();

  // TODO: Create mutation using new factory pattern
  const updateQueryMutation = useMutation(
    async (query: Partial<ZetkinQuery>) => {
      await defaultFetch(
        `/orgs/${orgId}/people/views/${view.id}/content_query`,
        {
          body: JSON.stringify(query),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'PATCH',
        }
      );
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries(['view', view.id.toString(), 'rows']);
        queryClient.invalidateQueries(['view', view.id.toString()]);
      },
    }
  );

  return (
    <SmartSearchDialog
      {...dialogProps}
      onSave={(query) => {
        updateQueryMutation.mutate(query);
        dialogProps.onDialogClose();
      }}
      query={view.content_query}
    />
  );
};

export default ViewSmartSearchDialog;
