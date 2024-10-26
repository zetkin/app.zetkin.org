import { FC, useState } from 'react';

import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import ManualMergingModal from 'features/duplicates/components/ManualMergingModal';
import { ZetkinPerson } from 'utils/types/zetkin';

type Props = {
  person: ZetkinPerson;
};

const PersonActionButtons: FC<Props> = ({ person }) => {
  const messages = useMessages(messageIds);
  const [merging, setMerging] = useState(false);

  return (
    <>
      <ZUIEllipsisMenu
        items={[
          {
            label: messages.ellipsisMenu.merge(),
            onSelect() {
              setMerging(true);
            },
          },
        ]}
      />
      <ManualMergingModal
        initialPersons={[person]}
        onClose={() => {
          setMerging(false);
        }}
        open={merging}
      />
    </>
  );
};

export default PersonActionButtons;
