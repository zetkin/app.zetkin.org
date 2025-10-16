import calculateReportState from '../Report/utils/calculateReportState';
import { Report } from 'features/call/types';

export default function callSummarySentence(name: string, report: Report) {
  const reportState = calculateReportState(report);

  const messageByStatusCode: Record<number, string> = {
    1: `You talked to ${name}`,
    11: `${name} did not pick up, you did not leve a message.`,
    12: 'The line was busy',
    13: `You reached ${name}, but we have to call them back.`,
    14: `We will call ${name} back.`,
    15: `${name} did not pick up, you left a message on their answering machine.`,
    21: `We had the wrong number for ${name}`,
  };

  return messageByStatusCode[reportState];
}
