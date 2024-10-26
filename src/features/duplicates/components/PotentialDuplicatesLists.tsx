import { FC, useState } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import MergeCandidateList from './MergeCandidateList';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinPerson } from 'utils/types/zetkin';
import ZUIEllipsisMenu from 'zui/ZUIEllipsisMenu';
import { MUIOnlyPersonSelect } from 'zui/ZUIPersonSelect';

interface PotentialDuplicatesListsProps {
  initiallyShowManualSearch: boolean;
  onDeselect: (person: ZetkinPerson) => void;
  onSelect: (person: ZetkinPerson) => void;
  peopleNotToMerge: ZetkinPerson[];
  peopleToMerge: ZetkinPerson[];
}

const PotentialDuplicatesLists: FC<PotentialDuplicatesListsProps> = ({
  initiallyShowManualSearch,
  onDeselect,
  onSelect,
  peopleNotToMerge,
  peopleToMerge,
}) => {
  const messages = useMessages(messageIds);
  const [addingManually, setAddingManually] = useState(
    initiallyShowManualSearch
  );

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6">{messages.modal.peopleToMerge()}</Typography>
        <ZUIEllipsisMenu
          items={[
            {
              label: addingManually
                ? messages.modal.lists.hideManual()
                : messages.modal.lists.showManual(),
              onSelect() {
                setAddingManually(!addingManually);
              },
            },
          ]}
        />
      </Box>
      {addingManually && (
        <Box my={1}>
          <MUIOnlyPersonSelect
            onChange={function (person: ZetkinPerson): void {
              onSelect(person);
            }}
            placeholder={messages.modal.findCandidateManually()}
            selectedPerson={null}
          />
        </Box>
      )}
      <MergeCandidateList
        buttonLabel={messages.modal.notDuplicateButton()}
        onButtonClick={onDeselect}
        rows={peopleToMerge}
        showActionButton={peopleNotToMerge.length + peopleToMerge.length > 2}
      />
      {peopleToMerge.length > 0 && <Divider />}
      {peopleNotToMerge.length > 0 && (
        <Box
          display="flex"
          flexDirection="column"
          overflow="hidden"
          paddingTop={4}
        >
          <Typography variant="h6">
            {messages.modal.peopleNotBeingMerged()}
          </Typography>
          <MergeCandidateList
            buttonLabel={messages.modal.isDuplicateButton()}
            onButtonClick={onSelect}
            rows={peopleNotToMerge}
          />
          <Divider />
        </Box>
      )}
    </>
  );
};

export default PotentialDuplicatesLists;
