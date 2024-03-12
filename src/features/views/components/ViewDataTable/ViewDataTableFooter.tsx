import { Box } from '@mui/material';
import { FunctionComponent, useRef } from 'react';

import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import useView from 'features/views/hooks/useView';
import useViewGrid from 'features/views/hooks/useViewGrid';
import { ZetkinPerson } from 'utils/types/zetkin';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';

import messageIds from 'features/views/l10n/messageIds';
import zuiMessageIds from 'zui/l10n/messageIds';

export interface ViewDataTableFooterProps {
  onRowAdd: (person: ZetkinPerson) => void;
}

const ViewDataTableFooter: FunctionComponent<ViewDataTableFooterProps> = ({
  onRowAdd,
}) => {
  const messages = useMessages(messageIds);
  const zuiMessages = useMessages(zuiMessageIds);

  const selectInputRef = useRef<HTMLInputElement>();

  const { orgId, viewId } = useNumericRouteParams();
  const { rowsFuture } = useViewGrid(orgId, viewId);
  const rows = rowsFuture.data || [];
  const viewTitle = useView(orgId, viewId).data?.title || '';

  return (
    <Box p={1}>
      <ZUIPersonSelect
        getOptionDisabled={(option) => rows.some((row) => row.id == option.id)}
        getOptionExtraLabel={(option) => {
          return rows.some((row) => row.id == option.id)
            ? messages.footer.alreadyInView()
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
        placeholder={messages.footer.addPlaceholder()}
        selectedPerson={null}
        submitLabel={zuiMessages.createPerson.submitLabel.add()}
        title={zuiMessages.createPerson.title.addTo({
          value: viewTitle,
        })}
        variant="outlined"
      />
    </Box>
  );
};

export default ViewDataTableFooter;
