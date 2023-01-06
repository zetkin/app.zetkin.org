import { Checkbox } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import nProgress from 'nprogress';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { FunctionComponent, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import putViewColumnCell from 'features/views/fetching/putViewColumnCell';
import { VIEW_DATA_TABLE_ERROR } from '../constants';
import ZUISnackbarContext from 'zui/ZUISnackbarContext';

interface LocalBoolViewCellProps {
  params: GridRenderCellParams;
}

const LocalBoolViewCell: FunctionComponent<LocalBoolViewCellProps> = ({
  params,
}) => {
  const intl = useIntl();
  const { showSnackbar } = useContext(ZUISnackbarContext);
  const { orgId, viewId } = useRouter().query;
  const queryClient = useQueryClient();

  const showError = (error: VIEW_DATA_TABLE_ERROR) => {
    showSnackbar(
      'error',
      intl.formatMessage({ id: `misc.views.dataTableErrors.${error}` })
    );
  };

  const columnId = params.field.split('col_')[1];
  const cellValue: boolean = params?.row && params.row[params.field];

  const updateCellMutation = useMutation(
    putViewColumnCell(orgId as string, viewId as string, params.id),
    {
      onError: () => {
        showError(VIEW_DATA_TABLE_ERROR.MODIFY_COLUMN);
        nProgress.done();
      },
      onSettled: () => {
        nProgress.done();
        queryClient.invalidateQueries(['view', viewId]);
      },
    }
  );
  return (
    <Checkbox
      checked={cellValue}
      onChange={(ev, checked) => {
        nProgress.start();
        updateCellMutation.mutate({ id: parseInt(columnId), value: checked });
      }}
    />
  );
};

export default LocalBoolViewCell;
