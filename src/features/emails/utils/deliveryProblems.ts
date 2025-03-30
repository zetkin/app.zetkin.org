import { DeliveryProblem, EmailContent } from '../types';
import { ZetkinEmail } from 'utils/types/zetkin';
import editorBlockProblems from 'zui/ZUIEditor/utils/editorBlockProblems';

export default function deliveryProblems(
  email: ZetkinEmail
): DeliveryProblem[] {
  const problems: DeliveryProblem[] = [];

  if (!email.content) {
    problems.push(DeliveryProblem.EMPTY);
  } else {
    const parsedContent: EmailContent = JSON.parse(email.content);

    if (parsedContent.blocks.length === 0) {
      problems.push(DeliveryProblem.EMPTY);
    }

    const hasProblems = parsedContent.blocks.some(
      (block) => !!editorBlockProblems(block).length
    );

    if (hasProblems) {
      problems.push(DeliveryProblem.CONTENT_ERROR);
    }
  }

  if (!email.subject) {
    problems.push(DeliveryProblem.NO_SUBJECT);
  }

  if (email.target.filter_spec.length === 0) {
    problems.push(DeliveryProblem.NOT_TARGETED);
  }

  if (!email.locked) {
    problems.push(DeliveryProblem.TARGETS_NOT_LOCKED);
  }

  return problems;
}
