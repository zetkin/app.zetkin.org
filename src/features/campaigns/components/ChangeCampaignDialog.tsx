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
import { makeStyles } from '@mui/styles';
import { useState } from 'react';

import oldTheme from 'theme';
import { Msg, PlainMessage, useMessages } from 'core/i18n';
import useCampaigns from 'features/campaigns/hooks/useCampaigns';
import { useNumericRouteParams } from '../../../core/hooks';

type ChangeCampaignMessageIds = {
  dialogTitle: PlainMessage;
  error: PlainMessage;
  moveButtonLabel: PlainMessage;
};

type ChangeCampaignDialogProps = {
  changeCampaignMessageIds: ChangeCampaignMessageIds;
  close: () => void;
  isOpen: boolean;
  onCampaignSelected: (campaignId: number) => Promise<void>;
};

const useStyles = makeStyles(() => ({
  list: {
    listStyle: 'none',
  },
  listItem: {},
}));

/**
 * `ChangeCampaignDialog` is a React functional component that renders a dialog
 * for selecting and switching to a different campaign. It provides a search
 * functionality to filter campaigns and allows the user to select a campaign
 * from the filtered list.
 *
 * ## Props:
 * - `changeCampaignMessageIds` (ChangeCampaignMessageIds): Object containing message IDs for localization
 * - `isOpen` (boolean): Controls whether the dialog is open or closed.
 * - `onCampaignSelected` (function): Callback function triggered when a new campaign is selected.
 *    It receives the selected campaign ID as an argument and returns a Promise.
 * - `close` (function): Callback function to close the dialog.
 *
 * ## Usage:
 * ```tsx
 * <ChangeCampaignDialog
 *   changeCampaignMessageIds={{
 *     dialogTitle: 'changeCampaign.dialogTitle',
 *     error: 'changeCampaign.error',
 *     moveButtonLabel: 'changeCampaign.moveButtonLabel',
 *   }}
 *   isOpen={isDialogOpen}
 *   onCampaignSelected={handleCampaignSelection}
 *   close={handleCloseDialog}
 * />
 * ```
 */
const ChangeCampaignDialog: React.FunctionComponent<
  ChangeCampaignDialogProps
> = ({ changeCampaignMessageIds, isOpen, onCampaignSelected, close }) => {
  const { orgId, campId } = useNumericRouteParams();
  const classes = useStyles();
  const changeCampaignMessages = useMessages(changeCampaignMessageIds);

  const [error, setError] = useState(false);

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
    close();
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={'sm'}
      onClose={() => {
        close();
      }}
      open={isOpen}
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
            {changeCampaignMessages.dialogTitle()}
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

          {error && (
            <Alert severity="error">
              <Msg id={changeCampaignMessageIds.error} />
            </Alert>
          )}

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
                    className={classes.listItem}
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
                            {changeCampaignMessages.moveButtonLabel()}
                          </Button>
                        )}
                        {isLoadingCampaign === campaign.id && (
                          <CircularProgress color="secondary" />
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
