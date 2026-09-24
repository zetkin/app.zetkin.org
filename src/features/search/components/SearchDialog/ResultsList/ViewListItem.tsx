import { InsertDriveFileOutlined } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinView } from 'utils/types/zetkin';

const ViewListItem: React.FunctionComponent<{ view: ZetkinView }> = ({
  view,
}) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  // The group header says these are lists, so only the folder is context

  return (
    <Link href={`/organize/${orgId}/people/lists/${view.id}`}>
      <ListItem data-testid="SearchDialog-resultsListItem">
        <ListItemButton>
          <ListItemAvatar>
            <Avatar>
              <InsertDriveFileOutlined />
            </Avatar>
          </ListItemAvatar>
          <ResultsListItemText
            primary={view.title}
            secondary={view.folder?.title}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default ViewListItem;
