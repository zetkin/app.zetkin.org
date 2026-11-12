import AllMembers from '../AllMembers';
import { FILTER_TYPE } from 'features/smartSearch/components/types';
import { ZetkinView } from 'utils/types/zetkin';

const CallBlocked: ZetkinView = {
  ...AllMembers,
  content_query: {
    filter_spec: [
      {
        config: {
          reason: 'organizer_action_needed',
        },
        type: FILTER_TYPE.CALL_BLOCKED,
      },
    ],
    id: 2,
  },
  id: 2,
  title: 'People who need organizer action',
};

export default CallBlocked;
