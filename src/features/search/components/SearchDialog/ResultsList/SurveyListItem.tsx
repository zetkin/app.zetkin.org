import { AssignmentOutlined } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, ListItem, ListItemAvatar } from '@mui/material';

import ResultsListItemText from './ResultsListItemText';
import { ZetkinSurvey } from 'utils/types/zetkin';

import messageIds from '../../../l10n/messageIds';
import { Msg } from 'core/i18n';

const SurveyListItem: React.FunctionComponent<{
  survey: ZetkinSurvey;
}> = ({ survey }) => {
  const router = useRouter();
  const { orgId } = router.query as { orgId: string };
  return (
    <Link
      key={survey.id}
      href={`/organize/${orgId}/projects/${
        survey.campaign?.id ?? 'standalone'
      }/surveys/${survey.id}`}
      passHref
    >
      <ListItem button component="a" data-testid="SearchDialog-resultsListItem">
        <ListItemAvatar>
          <Avatar>
            <AssignmentOutlined />
          </Avatar>
        </ListItemAvatar>
        <ResultsListItemText
          primary={survey.title}
          secondary={<Msg id={messageIds.results.survey} />}
        />
      </ListItem>
    </Link>
  );
};

export default SurveyListItem;
