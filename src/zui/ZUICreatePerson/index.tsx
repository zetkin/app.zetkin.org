import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { FC, useState } from 'react';

import globalMessageIds from 'core/i18n/globalMessageIds';
import isEmail from 'validator/lib/isEmail';
import messageIds from 'zui/l10n/messageIds';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import useDebounce from 'utils/hooks/useDebounce';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinTag } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

interface ZUICreatePersonProps {
  onClose: () => void;
  open: boolean;
}
type GenderKeyType = 'f' | 'm' | 'o' | 'unknown';

interface ZetkinCreatePerson {
  alt_phone: string | null;
  zip_code: string | null;
  last_name: string;
  city: string | null;
  first_name: string;
  gender: 'f' | 'm' | 'o' | null;
  street_address: string | null;
  co_address: string | null;
  ext_id: string | null;
  email: string | null;
  country: string | null;
  phone: string | null;
}

const ZUICreatePerson: FC<ZUICreatePersonProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const { orgId } = useNumericRouteParams();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const globalMessages = useMessages(globalMessageIds);
  const messages = useMessages(messageIds);
  const customFields = useCustomFields(orgId).data ?? [];
  const genderKeys = Object.keys(
    messageIds.createPerson.genders
  ) as GenderKeyType[];

  const [showAll, setShowAll] = useState(false);
  // const [showAllWithEnter, setShowAllWithEnter] = useState(false);

  const initialValue = {
    alt_phone: null,
    city: null,
    country: null,
    co_address: null,
    email: null,
    ext_id: null,
    first_name: '',
    gender: null,
    last_name: '',
    phone: null,
    street_address: null,
    zip_code: null,
  };
  const [personalInfo, setPersonalInfo] =
    useState<ZetkinCreatePerson>(initialValue);
  const invalidEmail = !isEmail(personalInfo.email || '');

  const debouncedFinishedTyping = useDebounce(
    async (key: string, value: string | null) => {
      setPersonalInfo((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    300
  );
  console.log(personalInfo, ' ??');
  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      onClose={() => {
        onClose();
        setShowAll(false);
        // setShowAllWithEnter(false);
        setPersonalInfo(initialValue);
      }}
      open={open}
    >
      <Box padding={5}>
        <Typography mb={2} variant="h5">
          <Msg id={messageIds.createPerson.title} />
        </Typography>
        <Box
          display="flex"
          flex={1}
          flexDirection="column"
          gap={2}
          sx={{ height: showAll ? '600px' : '', overflowY: 'auto' }}
        >
          <Box display="flex" mt={1}>
            <Box mr={2} width="50%">
              <TextField
                fullWidth
                label={globalMessages.personFields.first_name()}
                onChange={(e) =>
                  debouncedFinishedTyping('first_name', e.target.value)
                }
                required
                variant="outlined"
              />
            </Box>
            <Box width="50%">
              <TextField
                fullWidth
                label={globalMessages.personFields.last_name()}
                onChange={(e) =>
                  debouncedFinishedTyping('last_name', e.target.value)
                }
                required
              />
            </Box>
          </Box>
          <TextField
            error={invalidEmail && personalInfo.email !== ''}
            helperText={
              invalidEmail &&
              personalInfo.email !== '' && (
                <Msg
                  id={messageIds.createPerson.validationWarning}
                  values={{ field: globalMessages.personFields.email() }}
                />
              )
            }
            label={globalMessages.personFields.email()}
            onChange={(e) => debouncedFinishedTyping('email', e.target.value)}
          />
          <TextField
            label={globalMessages.personFields.phone()}
            onChange={(e) => debouncedFinishedTyping('phone', e.target.value)}
          />
          {showAll && (
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                // autoFocus={showAllWithEnter} ??
                label={globalMessages.personFields.alt_phone()}
                onChange={(e) =>
                  debouncedFinishedTyping('alt_phone', e.target.value)
                }
              />
              <FormControl fullWidth>
                <InputLabel>
                  <Msg id={globalMessageIds.personFields.gender} />
                </InputLabel>
                <Select
                  defaultValue=""
                  label={globalMessages.personFields.gender()}
                  onChange={(e) =>
                    debouncedFinishedTyping(
                      'gender',
                      e.target.value === 'unknown' ? null : e.target.value
                    )
                  }
                >
                  {genderKeys.map((genderKey) => (
                    <MenuItem key={genderKey} value={genderKey}>
                      {messages.createPerson.genders[genderKey]()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label={globalMessages.personFields.street_address()}
                onChange={(e) =>
                  debouncedFinishedTyping('street_address', e.target.value)
                }
              />
              <TextField
                label={globalMessages.personFields.co_address()}
                onChange={(e) =>
                  debouncedFinishedTyping('co_address', e.target.value)
                }
              />
              <Box>
                <TextField
                  label={globalMessages.personFields.zip_code()}
                  onChange={(e) =>
                    debouncedFinishedTyping('zip_code', e.target.value)
                  }
                  sx={{ pr: 2, width: '30%' }}
                />

                <TextField
                  label={globalMessages.personFields.city()}
                  onChange={(e) =>
                    debouncedFinishedTyping('city', e.target.value)
                  }
                  sx={{ width: '70%' }}
                />
              </Box>
              <TextField
                label={globalMessages.personFields.country()}
                onChange={(e) =>
                  debouncedFinishedTyping('country', e.target.value)
                }
              />
              <TextField
                label={globalMessages.personFields.ext_id()}
                onChange={(e) =>
                  debouncedFinishedTyping('ext_id', e.target.value)
                }
              />
            </Box>
          )}
          {showAll &&
            customFields.map((field) => {
              if (field.type === 'date') {
                return (
                  <DatePicker
                    format="DD-MM-YYYY"
                    label={field.title}
                    sx={{ marginBottom: 2 }}
                  />
                );
              } else {
                return <TextField label={field.title} />;
              }
            })}
          <Box display="flex" justifyContent="flex-end">
            <Button
              onClick={() => {
                // if (showAll) {
                // setShowAllWithEnter(false);
                // }
                setShowAll(!showAll);
              }}
              // onKeyDown={(e) => {
              // if (e.key === 'Enter') {
              //   setShowAllWithEnter(true);
              // }
              // }}
              startIcon={showAll ? <ExpandLess /> : <ExpandMore />}
            >
              <Msg
                id={
                  showAll
                    ? messageIds.createPerson.lessFields
                    : messageIds.createPerson.allFields
                }
              />
            </Button>
          </Box>
        </Box>
        <TagManagerSection
          assignedTags={[] as ZetkinTag[]}
          onAssignTag={(tag) => {}}
          onUnassignTag={(tag) => {}}
        />
        <Divider />
        <Box
          alignItems="center"
          display="flex"
          justifyContent="space-between"
          mt={2}
        >
          <Box display="flex" flexDirection="column">
            <Typography>Message:</Typography>
            <Typography>Blah blah</Typography>
          </Box>
          <Box>
            <Button
              onClick={() => {
                onClose();
                setShowAll(false);
                // setShowAllWithEnter(false);
                setPersonalInfo(initialValue);
              }}
              sx={{ mr: 2 }}
              variant="text"
            >
              <Msg id={messageIds.createPerson.cancel} />
            </Button>
            <Button
              disabled={!personalInfo.first_name || !personalInfo.last_name}
              variant="contained"
            >
              <Msg id={messageIds.createPerson.createBtn} />
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ZUICreatePerson;
