import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import { FC, HTMLAttributes, useState } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
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
  const [value, setValue] = useState<string>('');

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
    onClose: () => {
      setValue('');
    },
  });

  let searchResults = autoComplete.groupedOptions as ZetkinPerson[];

  return (
    <>
      <IconButton
        onClick={(ev) => setBtnAnchor(ev.target as Element)}
        sx={{ fontSize: '1rem' }}
      >
        <PersonAddIcon sx={{ mr: 1 }} />
        <Msg id={messageIds.addPerson.addButton} />
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
            width: '40vh',
            maxWidth: '400px',
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
            onChange={(e) => setValue(e.target.value)}
            inputProps={autoComplete.getInputProps()}
            placeholder={messages.addPerson.search()}
            sx={{ paddingLeft: '10px', mb: value ? 2 : 0 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),

              endAdornment: value && (
                <IconButton>
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />

          <List
            {...autoComplete.getListboxProps()}
            subheader={
              <ListSubheader sx={{ position: 'relative' }}>
                {autoComplete.inputValue &&
                  searchResults.length === 0 &&
                  autoComplete.inputValue.length < 3 &&
                  autoComplete.inputValue.length > 0 &&
                  messages.addPerson.keepTyping()}
                {autoComplete.inputValue.length >= 3 &&
                  !personSelect.autoCompleteProps.isLoading &&
                  searchResults.length === 0 &&
                  messages.addPerson.noResult()}
              </ListSubheader>
            }
            sx={{ px: 3 }}
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
    <ListItem {...itemProps} disablePadding sx={{ py: 0.8 }}>
      <Box
        sx={{
          cursor: 'pointer',
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
        }}
      >
        <ZUIAvatar orgId={orgId} personId={person.id} size="md" />
        <Typography component="span">
          {`${person.first_name} ${person.last_name}`}
        </Typography>
      </Box>
    </ListItem>
  );
};

export default AddPersonButton;
