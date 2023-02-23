import { InsertDriveFileOutlined } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinView } from 'utils/types/zetkin';

import messages from '../../../messages';
import { useMessages } from 'core/i18n';

const ViewListItem: React.FunctionComponent<{ view: ZetkinView }> = ({
  view,
}) => {
  const msg = useMessages(messages);
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  const elements = [msg.results.people()];
  if (view.folder) {
    elements.push(view.folder.title);
  }
  elements.push(msg.results.view());

  return (
    <Link href={`/organize/${orgId}/people/views/${view.id}`} passHref>
      <ListItem button component="a" data-testid="SearchDialog-resultsListItem">
        <ListItemAvatar>
          <Avatar>
            <InsertDriveFileOutlined />
          </Avatar>
        </ListItemAvatar>
        <ResultsListItemText
          primary={view.title}
          secondary={elements.join(' / ')}
        />
      </ListItem>
    </Link>
  );
};

export default ViewListItem;
