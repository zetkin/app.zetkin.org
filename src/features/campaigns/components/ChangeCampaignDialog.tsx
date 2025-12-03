import { Architecture, Close, Search } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  TextField,
  useMediaQuery,
} from '@mui/material';
import { useState } from 'react';

import oldTheme from 'theme';
import { useMessages } from 'core/i18n';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import { useNumericRouteParams } from '../../../core/hooks';
import messageIds from '../../../features/campaigns/l10n/messageIds';

type ChangeCampaignDialogProps = {
  errorMessage: string;
  onCampaignSelected: (campaignId: number) => Promise<void>;
  onClose: () => void;
  open: boolean;
  title: string;
};

/**
 * `ChangeCampaignDialog` is a React functional component that renders a dialog
 * for selecting and switching to a different campaign. It provides a search
 * functionality to filter campaigns and allows the user to select a campaign
 * from the filtered list.
 *
 * ## Props:
 * - `errorMessage` (string): Message to be displayed when an error occurs.
 * - `onCampaignSelected` (function): Callback function triggered when a new campaign is selected.
 *    It receives the selected campaign ID as an argument and returns a Promise.
 * - `onClose` (function): Callback function to close the dialog.
 * - `open` (boolean): Controls whether the dialog is open or closed.
 * - `title` string containing the title of this component
 *
 * ## Usage:
 * ```tsx
 * <ChangeCampaignDialog
 *  errorMessage={messages.callAssignmentChangeCampaignDialog.error()}
 *  onCampaignSelected={handleOnCampaignSelected}
 *  onClose={() => setIsMoveDialogOpen(false)}
 *  open={isMoveDialogOpen}
 *  title={messages.callAssignmentChangeCampaignDialog.dialogTitle()}
 * />
 * ```
 */
const ChangeCampaignDialog: React.FunctionComponent<
  ChangeCampaignDialogProps
> = ({ title, errorMessage, open, onCampaignSelected, onClose }) => {
  const { orgId, campId } = useNumericRouteParams();

  const [error, setError] = useState(false);
  const messages = useMessages(messageIds);

  const fullScreen = useMediaQuery(oldTheme.breakpoints.down('md'));

  const [campaignFilter, setCampaignFilter] = useState('');
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(0);

  const { data: campaigns } = useCampaigns(orgId);
  campaigns?.reverse();

  const filteredCampaigns = campaigns
    ?.filter((campaign) =>
      campaign.title.toLowerCase().includes(campaignFilter)
    )
    .filter((campaign) => campaign.id != campId);

  const onSearchChange = (value: string) => {
    setCampaignFilter(value);
  };

  const handleMove = async (campaignId: number) => {
    setIsLoadingCampaign(campaignId);

    try {
      await onCampaignSelected(campaignId);
      handleClose();
    } catch (error) {
      setIsLoadingCampaign(0);
      setError(true);
    }
  };

  const handleClose = () => {
    setIsLoadingCampaign(0);
    setCampaignFilter('');
    onClose();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={() => {
        onClose();
      }}
      open={open}
    >
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '85vh',
        }}
      >
        <Box display="flex" justifyContent="space-between">
          <DialogTitle sx={{ paddingLeft: 2 }} variant="h5">
            {title}
          </DialogTitle>

          <IconButton onClick={handleClose}>
            <Close
              color="secondary"
              sx={{
                cursor: 'pointer',
              }}
            />
          </IconButton>
        </Box>

        <Box display="flex" flexDirection="column" rowGap={1}>
          <TextField
            fullWidth
            id="ChangeCampaignDialog-inputField"
            InputProps={{
              startAdornment: <Search color="secondary" />,
            }}
            onChange={(ev) => onSearchChange(ev.target.value)}
            value={campaignFilter}
            variant="outlined"
          />

          {error && <Alert severity="error">{errorMessage}</Alert>}

          <Box
            sx={{
              overflowY: 'scroll',
            }}
          >
            <List>
              {filteredCampaigns?.map((campaign) => {
                return (
                  <ListItem
                    key={`ChangeCampaignDialog-campaignItem-${campaign.id}`}
                  >
                    <Box
                      alignItems="center"
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box alignItems="center" display="flex" marginRight={2}>
                        <Box marginRight={2}>
                          <Architecture color="secondary" />
                        </Box>
                        {campaign.title}
                      </Box>
                      <Box alignItems="center" display="flex">
                        {!isLoadingCampaign && (
                          <Button
                            onClick={() => handleMove(campaign.id)}
                            variant="outlined"
                          >
                            {messages.changeCampaignDialog.moveButtonLabel()}
                          </Button>
                        )}
                        {isLoadingCampaign === campaign.id && (
                          <CircularProgress color="secondary" size={30} />
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export default ChangeCampaignDialog;
