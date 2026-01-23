import { Report, ZetkinCall } from 'features/call/types';

export default function calculateReportState(
  report: Report
): ZetkinCall['state'] {
  const wasReached = report.success;
  const couldTalk = report.targetCouldTalk;

  if (wasReached && couldTalk) {
    return 1;
  } else if (wasReached && !couldTalk && report.callBackAfter) {
    return 13;
  } else {
    //!wasReached
    if (report.failureReason === 'lineBusy') {
      return 12;
    } else if (report.failureReason === 'noPickup') {
      if (report.leftMessage) {
        return 15;
      } else {
        return 11;
      }
    } else if (
      report.failureReason === 'notAvailable' &&
      report.callBackAfter
    ) {
      return 14;
    } else {
      //report.wrongNumber
      return 21;
    }
  }
}
