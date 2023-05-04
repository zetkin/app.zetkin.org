import FilterListIcon from '@mui/icons-material/FilterList';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';

import PaneHeader from 'utils/panes/PaneHeader';
import messageIds from 'features/calendar/l10n/messageIds';
import { Msg, useMessages } from 'core/i18n';
import AllAndNoneToggle from './AllAndNoneToggle';

const EventFilterPane = () => {
  const messages = useMessages(messageIds);
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log(name);
  };
  return (
    <>
      <PaneHeader title={messages.eventFilter.filter()} />
      <Button variant="outlined" size="small" color="warning">
        <Msg id={messageIds.eventFilter.reset} />
      </Button>
      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterListIcon />
              </InputAdornment>
            ),
          }}
          placeholder={messages.eventFilter.type()}
        />
        <Box sx={{ mt: 2 }} display="flex" flexDirection="column">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body1" color="secondary">
              <Msg id={messageIds.eventFilter.onAction.title} />
            </Typography>
            <AllAndNoneToggle />
          </Box>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox name="person" onChange={(e) => handleCheck(e)} />
              }
              label="Label"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="notifications"
                  onChange={(e) => handleCheck(e)}
                />
              }
              label="Required"
            />
            <FormControlLabel control={<Checkbox />} label="Disabled" />
          </FormGroup>
        </Box>
      </Box>
    </>
  );
};

export default EventFilterPane;
