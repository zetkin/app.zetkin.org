import { Box } from '@mui/material';
import { FunctionComponent, useRef } from 'react';

import { useMessages } from 'core/i18n';
import useViewDataModel from 'features/views/hooks/useViewDataModel';
import { ZetkinPerson } from 'utils/types/zetkin';
import { MUIOnlyPersonSelect as ZUIPersonSelect } from 'zui/ZUIPersonSelect';

import messageIds from 'features/views/l10n/messageIds';

export interface ViewDataTableFooterProps {
  onRowAdd: (person: ZetkinPerson) => void;
}

const ViewDataTableFooter: FunctionComponent<ViewDataTableFooterProps> = ({
  onRowAdd,
}) => {
  const messages = useMessages(messageIds);
  const selectInputRef = useRef<HTMLInputElement>();

  const model = useViewDataModel();
  const rows = model.getRows().data || [];

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
        variant="outlined"
      />
    </Box>
  );
};

export default ViewDataTableFooter;
