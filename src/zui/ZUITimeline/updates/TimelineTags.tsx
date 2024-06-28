import TagsList from 'features/tags/components/TagManager/components/TagsList';
import UpdateContainer from './elements/UpdateContainer';
import { ZetkinUpdateTags } from 'zui/ZUITimeline/types';
import ZUIPersonLink from 'zui/ZUIPersonLink';
import { Msg } from 'core/i18n';
import messageIds from '../l10n/messageIds';

interface TimelineTagsProps {
  update: ZetkinUpdateTags;
}

const TimelineTags: React.FC<TimelineTagsProps> = ({ update }) => {
  const headerMessage = update.type.endsWith('addtags')
    ? messageIds.updates.any.addtags
    : messageIds.updates.any.removetags;

  return (
    <UpdateContainer
      headerContent={
        <Msg
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
