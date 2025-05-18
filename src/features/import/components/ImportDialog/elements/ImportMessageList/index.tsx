import { Stack } from '@mui/material';
import { getCountries } from 'libphonenumber-js';
import { FC, useEffect, useState } from 'react';

import ImportMessage from './ImportMessage';
import ImportMessageItem from './ImportMessageItem';
import {
  ImportFieldProblem,
  ImportProblem,
  ImportProblemKind,
} from 'features/import/utils/problems/types';
import { levelForProblem } from 'features/import/utils/problems';
import { store } from 'core/store';

type Props = {
  defaultDescription?: string;
  defaultTitle?: string;
  onAllChecked: (allChecked: boolean) => void;
  onClickBack: () => void;
  problems: ImportProblem[];
};

const ImportMessageList: FC<Props> = ({
  defaultDescription,
  defaultTitle,
  onAllChecked,
  onClickBack,
  problems,
}) => {
  const [numChecked, setNumChecked] = useState(0);

  useEffect(() => {
    const warningCount = problems.filter(
      (problem) => levelForProblem(problem) == 'warning'
    ).length;

    onAllChecked(numChecked == warningCount);
  }, [numChecked]);

  const formatProblemIndex = problems.findIndex(
    (problem) => problem.kind == ImportProblemKind.INVALID_FORMAT
  );
  if (formatProblemIndex != -1) {
    const problem = problems[formatProblemIndex] as ImportFieldProblem;
    if (
      problem.field == 'phone' &&
      getCountries().findIndex(
        (iso) => store.getState().organizations.orgData.data?.country == iso
      ) == -1
    ) {
      problems.push({
        code: store.getState().organizations.orgData.data?.country ?? '',
        kind: ImportProblemKind.INVALID_ORG_COUNTRY,
      });
    }
  }

  return (
    <Stack spacing={2}>
      {!problems.length && defaultTitle && (
        <ImportMessage
          description={defaultDescription}
          status="info"
          title={defaultTitle}
        />
      )}
      {problems.map((problem, index) => (
        <ImportMessageItem
          key={index}
          onCheck={(checked) => {
            setNumChecked(numChecked + (checked ? 1 : -1));
          }}
          onClickBack={onClickBack}
          problem={problem}
        />
      ))}
    </Stack>
  );
};

export default ImportMessageList;
