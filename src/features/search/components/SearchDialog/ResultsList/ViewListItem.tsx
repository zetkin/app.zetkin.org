import { InsertDriveFileOutlined } from '@mui/icons-material';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinView } from 'utils/types/zetkin';

const ViewListItem: React.FunctionComponent<{ view: ZetkinView }> = ({
  view,
}) => {
  const intl = useIntl();
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };

  const elements = [
    intl.formatMessage({ id: 'misc.search.results.view.people' }),
  ];
  if (view.folder) {
    elements.push(view.folder.title);
  }
  elements.push(intl.formatMessage({ id: 'misc.search.results.view.view' }));

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
