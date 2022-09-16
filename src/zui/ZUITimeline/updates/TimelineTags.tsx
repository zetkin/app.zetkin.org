import { FormattedMessage } from 'react-intl';

import TagsList from 'features/tags/components/TagManager/components/TagsList';
import UpdateContainer from './elements/UpdateContainer';
import { ZetkinUpdateTags } from 'zui/ZUITimeline/types';
import ZUIPersonLink from 'zui/ZUIPersonLink';

interface TimelineTagsProps {
  update: ZetkinUpdateTags;
}

const TimelineTags: React.FC<TimelineTagsProps> = ({ update }) => {
  const headerMessage = update.type.endsWith('addtags')
    ? 'misc.updates.any.addtags'
    : 'misc.updates.any.removetags';

  return (
    <UpdateContainer
      headerContent={
        <FormattedMessage
          id={headerMessage}
          values={{
            actor: <ZUIPersonLink person={update.actor} />,
            count: update.details.tags.length,
          }}
        />
      }
      update={update}
    >
      <TagsList isGrouped={false} tags={update.details.tags} />
    </UpdateContainer>
  );
};

export default TimelineTags;
