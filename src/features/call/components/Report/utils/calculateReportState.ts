import { CallState, FinishedCall, Report } from 'features/call/types';

export default function calculateReportState(
  report: Report
): FinishedCall['state'] {
  const wasReached = report.success;
  const couldTalk = report.targetCouldTalk;

  if (wasReached && couldTalk) {
    return CallState.SUCCESSFUL;
  } else if (wasReached && !couldTalk && report.callBackAfter) {
    return CallState.CALL_BACK;
  } else {
    if (report.failureReason == 'lineBusy') {
      return CallState.LINE_BUSY;
    } else if (report.failureReason == 'noPickup') {
      if (report.leftMessage) {
        return CallState.LEFT_MESSAGE;
      } else {
        return CallState.NO_PICKUP;
      }
    } else if (report.failureReason == 'notAvailable' && report.callBackAfter) {
      return CallState.NOT_AVAILABLE;
    } else {
      return CallState.WRONG_NUMBER;
    }
  }
}
