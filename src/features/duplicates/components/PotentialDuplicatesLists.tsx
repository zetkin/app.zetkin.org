import { FC } from 'react';
import { Box, Typography } from '@mui/material';

import messageIds from '../l10n/messageIds';
import ModalList from './ModalList';
import { useMessages } from 'core/i18n';
import { ZetkinPerson } from 'utils/types/zetkin';

interface PotentialDuplicatesListsProps {
  onDeselect: (person: ZetkinPerson) => void;
  onSelect: (person: ZetkinPerson) => void;
  peopleNoToMerge: ZetkinPerson[];
  peopleToMerge: ZetkinPerson[];
}

const PotentialDuplicatesLists: FC<PotentialDuplicatesListsProps> = ({
  onDeselect,
  onSelect,
  peopleNoToMerge,
  peopleToMerge,
}) => {
  const messages = useMessages(messageIds);

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        marginLeft={2}
        marginRight={2}
        overflow="hidden"
      >
        <Typography marginBottom={2} variant="h6">
          {messages.modal.peopleToMerge()}
        </Typography>
        <ModalList
          buttonLabel={messages.modal.notDuplicateButton()}
          onButtonClick={onDeselect}
          rows={peopleToMerge}
        />
      </Box>
      {peopleNoToMerge.length > 0 && (
        <Box
          display="flex"
          flexDirection="column"
          overflow="hidden"
          padding={2}
        >
          <Typography variant="h6">
            {messages.modal.peopleNotBeingMerged()}
          </Typography>
          <ModalList
            buttonLabel={messages.modal.isDuplicateButton()}
            onButtonClick={onSelect}
            rows={peopleNoToMerge}
          />
        </Box>
      )}
    </>
  );
};

export default PotentialDuplicatesLists;
