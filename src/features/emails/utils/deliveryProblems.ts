import blockProblems from '../components/EmailEditor/EmailSettings/utils/blockProblems';
import { DeliveryProblem, EmailContent } from '../types';
import { ZetkinEmail } from 'utils/types/zetkin';
import zetkinBlocksToEditorjsBlocks from './zetkinBlocksToEditorjsBlocks';

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
    const convertedBlocks = zetkinBlocksToEditorjsBlocks(parsedContent.blocks);

    const hasProblems = convertedBlocks.some(
      (block) => !!blockProblems(block).length
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
