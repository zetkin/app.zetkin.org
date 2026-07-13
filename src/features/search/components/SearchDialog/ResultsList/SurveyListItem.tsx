import { AssignmentOutlined } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';

import getSurveyUrl from 'features/surveys/utils/getSurveyUrl';
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
    <Link href={getSurveyUrl(survey, parseInt(orgId))}>
      <ListItem data-testid="SearchDialog-resultsListItem">
        <ListItemButton>
          <ListItemAvatar>
            <Avatar>
              <AssignmentOutlined />
            </Avatar>
          </ListItemAvatar>
          <ResultsListItemText
            primary={survey.title}
            secondary={<Msg id={messageIds.results.survey} />}
          />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};

export default SurveyListItem;
