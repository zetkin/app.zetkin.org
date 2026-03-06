import { PersonAdd } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  List,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';

import messageIds from 'features/events/l10n/messageIds';
import { EventSignupModelType } from '../models';
import { useMessages } from 'core/i18n';
import usePersonSearch from 'features/profile/hooks/usePersonSearch';
import ZUICard from 'zui/ZUICard';
import ZUIDialog from 'zui/ZUIDialog';
import ZUIPersonAvatar from 'zui/ZUIPersonAvatar';
import { ZetkinPerson } from 'utils/types/zetkin';
export const UnverifiedSignupLinkDialog: FC<{
  onClose: () => void;
  onCreatePerson: () => void;
  onSelectPerson: (person: ZetkinPerson) => void;
  open: boolean;
  orgId: number;
  signup: EventSignupModelType;
}> = ({ onClose, onCreatePerson, onSelectPerson, open, orgId, signup }) => {
  const messages = useMessages(messageIds);
  const { isLoading, results, setQuery } = usePersonSearch(orgId);
  const minQueryLength = 3;

  const initialQuery = signup.email ?? signup.phone ?? '';
  const [searchValue, setSearchValue] = useState(initialQuery);
  const hasQuery = searchValue.length > 0;
  const isQueryLongEnough = searchValue.length >= minQueryLength;
  const initialQueryIsLongEnough = initialQuery.length >= minQueryLength;

  useEffect(() => {
    if (open) {
      setSearchValue(initialQuery);
      setQuery(initialQueryIsLongEnough ? initialQuery : '');
    }
  }, [open, initialQuery, initialQueryIsLongEnough, setQuery]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setQuery(value);
  };

  return (
    <ZUIDialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title={messages.linkSignupDialog.title()}
    >
      <Box display="flex" flexDirection="column" gap={2}>
        <ZUICard header={`${signup.first_name} ${signup.last_name}`}>
          {signup.email && (
            <Typography color="textSecondary" variant="body2">
              {signup.email}
            </Typography>
          )}
          {signup.phone && (
            <Typography color="textSecondary" variant="body2">
              {signup.phone}
            </Typography>
          )}
        </ZUICard>
        <Typography color="textSecondary" variant="body2">
          {messages.linkSignupDialog.helperText()}
        </Typography>

        <Divider />

        <Box>
          <TextField
            fullWidth
            label={messages.linkSignupDialog.searchLabel()}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={messages.linkSignupDialog.searchPlaceholder()}
            size="small"
            value={searchValue}
          />
        </Box>

        <Box maxHeight={300} minHeight={150} overflow="auto">
          {isLoading && (
            <Box
              alignItems="center"
              display="flex"
              justifyContent="center"
              p={2}
            >
              <CircularProgress size={24} />
            </Box>
          )}

          {!isLoading && results.length === 0 && isQueryLongEnough && (
            <Typography color="textSecondary" p={2} textAlign="center">
              {messages.linkSignupDialog.noResults()}
            </Typography>
          )}

          {!isLoading && hasQuery && !isQueryLongEnough && (
            <Typography color="textSecondary" p={2} textAlign="center">
              {messages.linkSignupDialog.keepTyping()}
            </Typography>
          )}

          {!isLoading && results.length > 0 && isQueryLongEnough && (
            <List disablePadding>
              {results.map((person) => {
                return (
                  <ListItem
                    key={person.id}
                    disablePadding
                    secondaryAction={
                      <Button
                        onClick={() => onSelectPerson(person)}
                        size="small"
                        variant="outlined"
                      >
                        {messages.linkSignupDialog.bookButton()}
                      </Button>
                    }
                  >
                    <Box alignItems="center" display="flex" gap={1.5} py={1}>
                      <ZUIPersonAvatar
                        orgId={orgId}
                        personId={person.id}
                        size="sm"
                      />
                      <Box>
                        <Typography variant="body1">
                          <Box component="span">{person.first_name}</Box>{' '}
                          <Box component="span">{person.last_name}</Box>
                        </Typography>
                        {person.email && (
                          <Typography color="textSecondary" variant="body2">
                            {person.email}
                          </Typography>
                        )}
                        {person.phone && (
                          <Typography color="textSecondary" variant="body2">
                            {person.phone}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          )}
        </Box>

        <Divider />

        <Box display="flex" gap={1} justifyContent="space-between">
          <Button onClick={onClose} variant="text">
            {messages.linkSignupDialog.cancelButton()}
          </Button>
          <Button
            onClick={onCreatePerson}
            startIcon={<PersonAdd />}
            variant="outlined"
          >
            {messages.linkSignupDialog.createPersonButton()}
          </Button>
        </Box>
      </Box>
    </ZUIDialog>
  );
};
