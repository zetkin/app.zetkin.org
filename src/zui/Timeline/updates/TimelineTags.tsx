import { FormattedMessage } from 'react-intl';

import TagsList from 'features/tags/components/TagManager/components/TagsList';
import UpdateContainer from './elements/UpdateContainer';
import ZetkinPersonLink from 'components/ZetkinPersonLink';
import { ZetkinUpdateTags } from 'zui/Timeline/updates/types';

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
            actor: <ZetkinPersonLink person={update.actor} />,
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
