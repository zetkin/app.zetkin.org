import { Stack } from '@mui/material';
import { FC, useEffect, useState } from 'react';

import ImportMessage from './ImportMessage';
import ImportMessageItem from './ImportMessageItem';
import { ImportProblem } from 'features/import/utils/problems/types';
import { levelForProblem } from 'features/import/utils/problems';

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
