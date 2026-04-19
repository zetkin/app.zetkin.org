import { ZetkinTask } from 'utils/types/zetkin';
import { TASK_TYPE, VisitLinkConfig } from 'features/tasks/components/types';
import KPD from '../../..';
import ReferendumSignatureCollection from '..';

/**
 * ZetkinTask
 *
 * - Visit Link Task
 * - No publish date, no expires and no deadline
 */
const VisitReferendumWebsite: ZetkinTask<VisitLinkConfig> = {
  campaign: {
    id: ReferendumSignatureCollection.id,
    title: ReferendumSignatureCollection.title,
  },
  config: {
    url: 'https://meingrundeinkommen.de',
  },
  cover_file: null,
  id: 2,
  instructions: `
    Visit this website to learn more about the referendum
    `,
  organization: KPD,
  reassign_interval: null,
  reassign_limit: null,
  target: {
    filter_spec: [],
    id: 2,
  },
  time_estimate: null,
  title: 'Learn more about the referrendum',
  type: TASK_TYPE.VISIT_LINK,
};

export default VisitReferendumWebsite;
