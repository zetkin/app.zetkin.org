import { ExpandMore } from '@mui/icons-material';
import {
  Box,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import messageIds from '../../../l10n/messageIds';
import { Msg } from 'core/i18n';

/**
 * The last row of the results list: how many results there are, and a way to
 * see more of them.
 *
 * The API caps each data type at 20 hits and never says how many it left
 * behind, so a capped count is shown as a floor ("20+ results") rather than
 * as a total the user could take literally.
 */
const ShowMoreItem: React.FunctionComponent<{
  capped: boolean;
  onShowMore: () => void;
  /** How many the next click reveals */
  step: number;
  total: number;
}> = ({ capped, onShowMore, step, total }) => {
  const count = (
    <Typography color="secondary" variant="body2">
      {capped ? (
        <Msg id={messageIds.resultCount.capped} values={{ count: total }} />
      ) : (
        <Msg id={messageIds.resultCount.exact} values={{ count: total }} />
      )}
    </Typography>
  );

  if (step === 0) {
    return (
      <ListItem data-testid="SearchDialog-resultCount">
        <ListItemText disableTypography>{count}</ListItemText>
      </ListItem>
    );
  }

  return (
    <ListItem data-testid="SearchDialog-resultCount" disablePadding>
      <ListItemButton
        data-testid="SearchDialog-showMore"
        onClick={onShowMore}
        sx={{ justifyContent: 'space-between' }}
      >
        {count}
        <Box alignItems="center" display="flex" gap={0.5}>
          <Typography color="primary" variant="body2">
            <Msg
              id={messageIds.resultCount.showMore}
              values={{ count: step }}
            />
          </Typography>
          <ExpandMore color="primary" fontSize="small" />
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export default ShowMoreItem;
