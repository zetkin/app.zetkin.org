import { FC } from 'react';

import ImportMessage from './ImportMessage';
import messageIds from 'features/import/l10n/messageIds';
import useFieldTitle from 'utils/hooks/useFieldTitle';
import { useMessages } from 'core/i18n';
import { useNumericRouteParams } from 'core/hooks';
import {
  ImportProblem,
  ImportProblemKind,
} from 'features/import/utils/problems/types';

type Props = {
  onCheck: (checked: boolean) => void;
  onClickBack: () => void;
  problem: ImportProblem;
};

const ImportMessageItem: FC<Props> = ({ onCheck, onClickBack, problem }) => {
  const messages = useMessages(messageIds);
  const { orgId } = useNumericRouteParams();
  const getFieldTitle = useFieldTitle(orgId);

  if (problem.kind == ImportProblemKind.INVALID_FORMAT) {
    return (
      <ImportMessage
        onCheck={onCheck}
        onClickBack={onClickBack}
        rowIndices={problem.indices}
        status="error"
        title={messages.preflight.messages.invalidFormat.title({
          field: getFieldTitle(problem.field),
        })}
      />
    );
  } else if (problem.kind == ImportProblemKind.MAJOR_CHANGE) {
    return (
      <ImportMessage
        description={messages.preflight.messages.majorChange.description()}
        onCheck={onCheck}
        onClickBack={onClickBack}
        status="warning"
        title={messages.preflight.messages.majorChange.title({
          amount: problem.amount,
          field: getFieldTitle(problem.field),
        })}
      />
    );
  } else if (problem.kind == ImportProblemKind.MISSING_ID_AND_NAME) {
    return (
      <ImportMessage
        description={messages.preflight.messages.missingIdAndName.description()}
        onCheck={onCheck}
        onClickBack={onClickBack}
        rowIndices={problem.indices}
        status="error"
        title={messages.preflight.messages.missingIdAndName.title()}
      />
    );
  } else if (problem.kind == ImportProblemKind.NO_IMPACT) {
    return (
      <ImportMessage
        description={messages.preflight.messages.noImpact.description()}
        onCheck={onCheck}
        onClickBack={onClickBack}
        status="error"
        title={messages.preflight.messages.noImpact.title()}
      />
    );
  } else if (problem.kind == ImportProblemKind.UNCONFIGURED_ID) {
    return (
      <ImportMessage
        description={messages.preflight.messages.unconfiguredId.description()}
        onCheck={onCheck}
        onClickBack={onClickBack}
        status="warning"
        title={messages.preflight.messages.unconfiguredId.title()}
      />
    );
  } else if (problem.kind == ImportProblemKind.UNCONFIGURED_ID_AND_NAME) {
    return (
      <ImportMessage
        description={messages.preflight.messages.unconfiguredIdAndName.description()}
        onCheck={onCheck}
        onClickBack={onClickBack}
        status="error"
        title={messages.preflight.messages.unconfiguredIdAndName.title()}
      />
    );
  } else if (problem.kind == ImportProblemKind.UNEXPECTED_ERROR) {
    return (
      <ImportMessage
        description={messages.preflight.messages.unexpectedError.description()}
        onCheck={onCheck}
        onClickBack={onClickBack}
        status="error"
        title={messages.preflight.messages.unexpectedError.title()}
      />
    );
  } else if (problem.kind == ImportProblemKind.UNKNOWN_PERSON) {
    return (
      <ImportMessage
        description={messages.preflight.messages.unknownPerson.description()}
        onCheck={onCheck}
        onClickBack={onClickBack}
        rowIndices={problem.indices}
        status="error"
        title={messages.preflight.messages.unknownPerson.title()}
      />
    );
  } else if (problem.kind == ImportProblemKind.UNKNOWN_ERROR) {
    return (
      <ImportMessage
        description={messages.preflight.messages.unknownError.description()}
        onCheck={onCheck}
        onClickBack={onClickBack}
        rowIndices={problem.indices}
        status="error"
        title={messages.preflight.messages.unknownError.title()}
      />
    );
  } else {
    // This should never happen
    return (
      <ImportMessage
        onClickBack={onClickBack}
        status="error"
        title={`Unimplemented problem ${problem.kind}`}
      />
    );
  }
};

export default ImportMessageItem;
