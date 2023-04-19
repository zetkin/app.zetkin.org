import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { FC, HTMLAttributes, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListSubheader,
  Paper,
  Popover,
  TextField,
  Typography,
  useAutocomplete,
} from '@mui/material';

import messageIds from '../l10n/messageIds';
import ZUIPersonGridEditCell from 'zui/ZUIPersonGridEditCell';
import { Msg, useMessages } from 'core/i18n';
// import PersonListItem from 'features/search/components/SearchDialog/ResultsList/PersonListItem';
import { usePersonSelect } from 'zui/ZUIPersonSelect';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIAvatar from 'zui/ZUIAvatar';

const AddPersonButton = () => {
  const [btnAnchor, setBtnAnchor] = useState<Element | null>(null);
  const messages = useMessages(messageIds);

  const updateBlah = () => {
    console.log('update');
  };

  const personSelect = usePersonSelect({
    initialValue: '',
    onChange: () => {
      updateBlah();
    },
    selectedPerson: null,
  });
  const autoComplete = useAutocomplete({
    ...personSelect.autoCompleteProps,
    disabled: false,
  });

  let searchResults = autoComplete.groupedOptions as ZetkinPerson[];

  return (
    <>
      <IconButton
        onClick={(ev) => setBtnAnchor(ev.target as Element)}
        sx={{ fontSize: '1rem' }}
      >
        <PersonAddIcon sx={{ mr: 1 }} />
        <Msg id={messageIds.addPerson} />
      </IconButton>
      <Popover
        elevation={1}
        anchorEl={btnAnchor}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        onClose={() => setBtnAnchor(null)}
        open={!!btnAnchor}
        PaperProps={{
          style: {
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '40vh',
            // width: '30ch',
          },
        }}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
      >
        <Box mt={1} p={2}>
          <TextField
            autoFocus
            fullWidth
            inputProps={autoComplete.getInputProps()}
            placeholder={'search'}
            sx={{ paddingLeft: '10px' }}
          />
          <List
            {...autoComplete.getListboxProps()}
            subheader={
              <ListSubheader sx={{ position: 'relative' }}></ListSubheader>
            }
          >
            {personSelect.autoCompleteProps.isLoading && (
              <CircularProgress sx={{ display: 'block', margin: 'auto' }} />
            )}

            {searchResults.map((option, index) => {
              const optProps = autoComplete.getOptionProps({
                index,
                option,
              });
              return (
                <PersonListItem
                  key={option.id}
                  orgId={1}
                  person={option}
                  itemProps={optProps}
                />
              );
            })}
          </List>
        </Box>
      </Popover>
    </>
  );
};

const PersonListItem: FC<{
  itemProps: HTMLAttributes<HTMLLIElement>;
  orgId: number;
  person: ZetkinPerson;
}> = ({ itemProps, orgId, person }) => {
  return (
    <ListItem
      {...itemProps}
      disablePadding
      sx={{ paddingBottom: 0.5, paddingTop: 0.5 }}
    >
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
        }}
      >
        <ZUIAvatar orgId={orgId} personId={person.id} size="sm" />
        <Typography component="span">
          {`${person.first_name} ${person.last_name}`}
        </Typography>
      </Box>
    </ListItem>
  );
};

export default AddPersonButton;
