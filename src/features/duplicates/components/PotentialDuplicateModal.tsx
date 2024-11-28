import { FC } from 'react';
import React from 'react';

import { PotentialDuplicate } from '../store';
import useDuplicatesMutations from '../hooks/useDuplicatesMutations';
import { useNumericRouteParams } from 'core/hooks';
import MergeModal from './MergeModal';

interface Props {
  onClose: () => void;
  open: boolean;
  potentialDuplicate: PotentialDuplicate;
}

const PotentialDuplicateModal: FC<Props> = ({
  potentialDuplicate,
  open,
  onClose,
}) => {
  const { orgId } = useNumericRouteParams();
  const { mergeDuplicate } = useDuplicatesMutations(orgId);

  return (
    <MergeModal
      onClose={onClose}
      onMerge={(personIds, overrides) => {
        mergeDuplicate(potentialDuplicate.id, personIds, overrides);
      }}
      open={open}
      persons={potentialDuplicate.duplicates}
    />
  );
};

export default PotentialDuplicateModal;
