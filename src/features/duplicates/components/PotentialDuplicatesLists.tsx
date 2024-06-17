import { FC } from 'react';
import { Box, Divider, Typography } from '@mui/material';

import MergeCandidateList from './MergeCandidateList';
import messageIds from '../l10n/messageIds';
import { useMessages } from 'core/i18n';
import { ZetkinPerson } from 'utils/types/zetkin';

interface PotentialDuplicatesListsProps {
  onDeselect: (person: ZetkinPerson) => void;
  onSelect: (person: ZetkinPerson) => void;
  peopleNotToMerge: ZetkinPerson[];
  peopleToMerge: ZetkinPerson[];
}

const PotentialDuplicatesLists: FC<PotentialDuplicatesListsProps> = ({
  onDeselect,
  onSelect,
  peopleNotToMerge,
  peopleToMerge,
}) => {
  const messages = useMessages(messageIds);

  return (
    <>
      <Typography variant="h6">{messages.modal.peopleToMerge()}</Typography>
      <MergeCandidateList
        buttonLabel={messages.modal.notDuplicateButton()}
        onButtonClick={onDeselect}
        rows={peopleToMerge}
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
