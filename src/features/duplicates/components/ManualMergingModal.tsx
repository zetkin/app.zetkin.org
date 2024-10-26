import { FC } from 'react';
import React from 'react';

import MergeModal from './MergeModal';
import { ZetkinPerson } from 'utils/types/zetkin';
import useMergePersons from '../hooks/useMergePersons';
import { useNumericRouteParams } from 'core/hooks';

interface Props {
  initialPersons: ZetkinPerson[];
  onClose: () => void;
  open: boolean;
}

const ManualMergingModal: FC<Props> = ({ initialPersons, open, onClose }) => {
  const { orgId } = useNumericRouteParams();
  const mergePersons = useMergePersons(orgId);

  return (
    <MergeModal
      initiallyShowManualSearch
      onClose={onClose}
      onMerge={(personIds, overrides) => {
        mergePersons(personIds, overrides);
        onClose();
      }}
      open={open}
      persons={initialPersons}
    />
  );
};

export default ManualMergingModal;
