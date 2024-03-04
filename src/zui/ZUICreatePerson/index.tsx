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
import messageIds from 'zui/l10n/messageIds';
import { TagManagerSection } from 'features/tags/components/TagManager';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useNumericRouteParams } from 'core/hooks';
import { ZetkinTag } from 'utils/types/zetkin';
import { Msg, useMessages } from 'core/i18n';

interface ZUICreatePersonProps {
  onClose: () => void;
  open: boolean;
}
type GenderKeyType = 'f' | 'm' | 'o' | 'unknown';

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
  const [personInfo, setPersonInfo] = useState<{ first_name: string }>({
    first_name: '',
  });

  return (
    <Dialog fullScreen={fullScreen} fullWidth onClose={onClose} open={open}>
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
                  setPersonInfo((prev) => ({
                    ...prev,
                    first_name: e.target.value,
                  }))
                }
                required
                variant="outlined"
              />
            </Box>
            <Box width="50%">
              <TextField
                fullWidth
                label={globalMessages.personFields.last_name()}
                required
              />
            </Box>
          </Box>
          <TextField label={globalMessages.personFields.email()} />
          <TextField label={globalMessages.personFields.phone()} />
          {showAll && (
            <Box display="flex" flexDirection="column" gap={2}>
              <TextField label={globalMessages.personFields.alt_phone()} />
              <FormControl fullWidth>
                <InputLabel>
                  <Msg id={globalMessageIds.personFields.gender} />
                </InputLabel>
                <Select label={globalMessages.personFields.gender()}>
                  {genderKeys.map((genderKey) => (
                    <MenuItem key={genderKey} value={genderKey}>
                      {messages.createPerson.genders[genderKey]()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label={globalMessages.personFields.street_address()} />
              <TextField label={globalMessages.personFields.co_address()} />
              <Box>
                <TextField
                  label={globalMessages.personFields.zip_code()}
                  sx={{ pr: 2, width: '30%' }}
                />

                <TextField
                  label={globalMessages.personFields.city()}
                  sx={{ width: '70%' }}
                />
              </Box>
              <TextField label={globalMessages.personFields.country()} />
              <TextField label={globalMessages.personFields.ext_id()} />
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
              onClick={() => setShowAll(!showAll)}
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
              }}
              sx={{ mr: 2 }}
              variant="text"
            >
              <Msg id={messageIds.createPerson.cancel} />
            </Button>
            <Button variant="contained">
              <Msg id={messageIds.createPerson.createBtn} />
            </Button>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ZUICreatePerson;
