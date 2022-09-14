import { Box } from '@material-ui/core';
import { FunctionComponent, useRef } from 'react';

import getViewRows from 'features/views/fetching/getViewRows';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { ZetkinPerson } from 'utils/types/zetkin';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';

export interface ViewDataTableFooterProps {
  onRowAdd: (person: ZetkinPerson) => void;
  viewId: string;
}

const ViewDataTableFooter: FunctionComponent<ViewDataTableFooterProps> = ({
  onRowAdd,
  viewId,
}) => {
  const { orgId } = useRouter().query;
  const intl = useIntl();
  const selectInputRef = useRef<HTMLInputElement>();

  const rowsQuery = useQuery(
    ['view', viewId, 'rows'],
    getViewRows(orgId as string, viewId)
  );
  const rows = rowsQuery.data || [];

  return (
    <Box p={1}>
      <ZUIPersonSelect
        getOptionDisabled={(option) => rows.some((row) => row.id == option.id)}
        getOptionExtraLabel={(option) => {
          return rows.some((row) => row.id == option.id)
            ? intl.formatMessage({
                id: 'misc.views.footer.alreadyInView',
              })
            : '';
        }}
        inputRef={selectInputRef}
        name="person"
        onChange={(person) => {
          onRowAdd(person);

          // Blur and re-focus input to reset, so that user can type again to
          // add another person, without taking their hands off the keyboard.
          selectInputRef?.current?.blur();
          selectInputRef?.current?.focus();
        }}
        placeholder={intl.formatMessage({
          id: 'misc.views.footer.addPlaceholder',
        })}
        selectedPerson={null}
        variant="outlined"
      />
    </Box>
  );
};

export default ViewDataTableFooter;
