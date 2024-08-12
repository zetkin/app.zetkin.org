import { InsertDriveFileOutlined } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinView } from 'utils/types/zetkin';
import messageIds from '../../../l10n/messageIds';
import { useMessages } from 'core/i18n';

const ViewListItem: React.FunctionComponent<{ view: ZetkinView }> = ({
  view,
}) => {
  const messages = useMessages(messageIds);
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  const elements = [messages.results.people()];
  if (view.folder) {
    elements.push(view.folder.title);
  }
  elements.push(messages.results.view());

  return (
    <Link
      href={`/organize/${orgId}/people/views/${view.id}`}
      legacyBehavior
      passHref
    >
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
