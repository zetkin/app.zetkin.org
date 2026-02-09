import { ReactNode } from 'react';

import SuccessOrFailure from './steps/SuccessOrFailure';
import FailureReason from './steps/FailureReason';
import CouldTalk from './steps/CouldTalk';
import CallBack from './steps/CallBack';
import LeftMessage from './steps/LeftMessage';
import OrganizerAction from './steps/OrganizerAction';
import OrganizerLog from './steps/OrganizerLog';
import CallerLog from './steps/CallerLog';
import WrongNumber from './steps/WrongNumber';
import { Report, Step, ZetkinCallTarget } from 'features/call/types';
import Summary from './steps/Summary';
import messageIds from 'features/call/l10n/messageIds';
import { Msg } from 'core/i18n';
import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIDate from 'zui/ZUIDate';

type ReportStep = {
  getRenderVariant: (
    report: Report,
    target?: ZetkinCallTarget,
    disableCallerNotes?: boolean
  ) => 'question' | 'summary' | null;
  name: Step;
  renderQuestion: (
    report: Report,
    onReportUpdate: (updatedReport: Report) => void,
    target: ZetkinCallTarget,
    disableCallerNotes: boolean,
    callLogIsOpen: boolean
  ) => ReactNode;
  renderSummary: (
    report: Report,
    onReportUpdate: (updatedReport: Report) => void,
    target: ZetkinCallTarget
  ) => ReactNode;
};

export const reportSteps: ReportStep[] = [
  {
    getRenderVariant: (report) => {
      if (report.step == 'successOrFailure') {
        return 'question';
      } else {
        return 'summary';
      }
    },
    name: 'successOrFailure',
    renderQuestion: (
      report,
      onReportUpdate,
      target,
      disableCallerNotes,
      callLogIsOpen
    ) => (
      <SuccessOrFailure
        key="successOrFailure"
        callLogIsOpen={callLogIsOpen}
        firstName={target.first_name}
        onReportUpdate={onReportUpdate}
        report={report}
      />
    ),
    renderSummary: (report, onReportUpdate, target) => (
      <Summary
        key="successOrFailureSummary"
        onEdit={() =>
          onReportUpdate({
            ...report,
            callBackAfter: null,
            completed: false,
            failureReason: null,
            leftMessage: false,
            organizerActionNeeded: false,
            step: 'successOrFailure',
            success: false,
            targetCouldTalk: false,
            wrongNumber: null,
          })
        }
        state={report.success ? 'success' : 'failure'}
        subtitle={
          <Msg
            id={
              messageIds.report.steps.successOrFailure.summary[
                report.success ? 'success' : 'failure'
              ].subtitle
            }
            values={{ firstName: target.first_name }}
          />
        }
        title={
          <Msg
            id={
              messageIds.report.steps.successOrFailure.summary[
                report.success ? 'success' : 'failure'
              ].title
            }
            values={{ firstName: target.first_name }}
          />
        }
      />
    ),
  },
  {
    getRenderVariant: (report) => {
      if (!report.success) {
        return null;
      }

      return report.step == 'couldTalk' ? 'question' : 'summary';
    },
    name: 'couldTalk',
    renderQuestion: (
      report,
      onReportUpdate,
      target,
      disableCallerNotes,
      callLogIsOpen
    ) => (
      <CouldTalk
        key="couldTalk"
        callLogIsOpen={callLogIsOpen}
        firstName={target.first_name}
        onReportUpdate={onReportUpdate}
        report={report}
      />
    ),
    renderSummary: (report, onReportUpdate, target) => (
      <Summary
        key="couldTalkSummary"
        onEdit={() =>
          onReportUpdate({
            ...report,
            callBackAfter: null,
            completed: false,
            failureReason: null,
            leftMessage: false,
            organizerActionNeeded: false,
            step: 'couldTalk',
            targetCouldTalk: false,
            wrongNumber: null,
          })
        }
        state={report.targetCouldTalk ? 'success' : 'failure'}
        subtitle={
          <Msg
            id={
              messageIds.report.steps.couldTalk.summary[
                report.targetCouldTalk ? 'couldTalk' : 'couldNotTalk'
              ].subtitle
            }
          />
        }
        title={
          <Msg
            id={
              messageIds.report.steps.couldTalk.summary[
                report.targetCouldTalk ? 'couldTalk' : 'couldNotTalk'
              ].title
            }
            values={{ firstName: target.first_name }}
          />
        }
      />
    ),
  },
  {
    getRenderVariant: (report) => {
      if (report.success) {
        // Don't render this step at all if the call was successful.
        return null;
      }

      return report.step == 'failureReason' ? 'question' : 'summary';
    },
    name: 'failureReason',
    renderQuestion: (
      report,
      onReportUpdate,
      target,
      disableCallerNotes,
      callLogIsOpen
    ) => {
      const phone = target?.phone;
      const altPhone = target?.alt_phone;

      return (
        <FailureReason
          key="failureReason"
          callLogIsOpen={callLogIsOpen}
          nextStepIfWrongNumber={
            phone && altPhone ? 'wrongNumber' : 'organizerLog'
          }
          onReportUpdate={onReportUpdate}
          report={report}
        />
      );
    },
    renderSummary: (report, onReportUpdate, target) => {
      if (report.failureReason) {
        return (
          <Summary
            key="failureReasonSummary"
            onEdit={() =>
              onReportUpdate({
                ...report,
                callBackAfter: null,
                completed: false,
                failureReason: null,
                leftMessage: false,
                step: 'failureReason',
                wrongNumber: null,
              })
            }
            state="failure"
            title={
              <Msg
                id={
                  messageIds.report.steps.failureReason.summary[
                    report.failureReason
                  ]
                }
                values={{ firstName: target.first_name }}
              />
            }
          />
        );
      } else {
        return null;
      }
    },
  },
  {
    getRenderVariant: (report) => {
      if (report.success) {
        // Don't render this step at all if the call was successful.
        return null;
      } else if (report.failureReason != 'noPickup') {
        // Also don't render this step if the failed call was because of
        // any other reason than the target not picking up.
        return null;
      }

      return report.step == 'leftMessage' ? 'question' : 'summary';
    },
    name: 'leftMessage',
    renderQuestion: (
      report,
      onReportUpdate,
      target,
      disableCallerNotes,
      callLogIsOpen
    ) => (
      <LeftMessage
        key="leftMessage"
        callLogIsOpen={callLogIsOpen}
        onReportUpdate={onReportUpdate}
        report={report}
      />
    ),
    renderSummary: (report, onReportUpdate) => (
      <Summary
        key="leftMessageSummary"
        onEdit={() =>
          onReportUpdate({
            ...report,
            callBackAfter: null,
            completed: false,
            leftMessage: false,
            organizerActionNeeded: false,
            step: 'leftMessage',
            wrongNumber: null,
          })
        }
        state={report.leftMessage ? 'success' : 'failure'}
        subtitle={
          report.leftMessage ? (
            <Msg
              id={
                messageIds.report.steps.leftMessage.summary.leftMessage.subtitle
              }
            />
          ) : undefined
        }
        title={
          <Msg
            id={
              report.leftMessage
                ? messageIds.report.steps.leftMessage.summary.leftMessage.title
                : messageIds.report.steps.leftMessage.summary.didNotLeaveMessage
            }
          />
        }
      />
    ),
  },

  {
    getRenderVariant: (report) => {
      if (report.success && report.targetCouldTalk) {
        // Don't render this step for successfull calls where
        // the target had time to talk right now.
        return null;
      } else if (!report.success && report.failureReason != 'notAvailable') {
        // Don't render this step for failed calls unless the
        // reason was that caller is not available
        return null;
      }

      return report.step == 'callBack' ? 'question' : 'summary';
    },
    name: 'callBack',
    renderQuestion: (
      report,
      onReportUpdate,
      targe,
      disableCallerNotes,
      callLogIsOpen
    ) => (
      <CallBack
        key="callBack"
        callLogIsOpen={callLogIsOpen}
        onReportUpdate={onReportUpdate}
        report={report}
      />
    ),
    renderSummary: (report, onReportUpdate, target) => {
      if (!report.callBackAfter) {
        return null;
      }

      const isAnyTimeOfDay = report.callBackAfter.slice(-5) == '00:00';

      return (
        <Summary
          key="callBackSummary"
          onEdit={() =>
            onReportUpdate({
              ...report,
              callerLog: '',
              completed: false,
              organizerActionNeeded: false,
              organizerLog: '',
              step: 'callBack',
              wrongNumber: null,
            })
          }
          state="success"
          subtitle={
            <Msg
              id={messageIds.report.steps.callBack.summary.subtitle}
              values={{ firstName: target.first_name }}
            />
          }
          title={
            <Msg
              id={messageIds.report.steps.callBack.summary.anyTime}
              values={{
                date: isAnyTimeOfDay ? (
                  <ZUIDate datetime={report.callBackAfter} />
                ) : (
                  <ZUIDateTime datetime={report.callBackAfter} />
                ),
              }}
            />
          }
        />
      );
    },
  },
  {
    getRenderVariant: (report, target) => {
      const phone = target?.phone;
      const altPhone = target?.alt_phone;

      if (report.success) {
        // Don't render this step at all if the call was successful.
        return null;
      } else if (report.failureReason != 'wrongNumber') {
        // Don't render this if failure was anything but wrong number.
        return null;
      } else {
        if (phone && altPhone) {
          return report.step == 'wrongNumber' ? 'question' : 'summary';
        } else {
          // Don't render this when there is only one number
          return null;
        }
      }
    },
    name: 'wrongNumber',
    renderQuestion: (
      report,
      onReportUpdate,
      target,
      disableCallerNotes,
      callLogIsOpen
    ) => {
      if (target && target.alt_phone && target.phone) {
        return (
          <WrongNumber
            key="wrongNumber"
            callLogIsOpen={callLogIsOpen}
            onReportUpdate={onReportUpdate}
            phoneAndAltPhone={{
              altPhone: target.alt_phone,
              phone: target.phone,
            }}
            report={report}
          />
        );
      } else {
        return null;
      }
    },
    renderSummary: (report, onReportUpdate, target) => {
      const wrongNumber = report.wrongNumber;

      if (!wrongNumber) {
        return null;
      }

      const altPhone = target.alt_phone || '';
      const phone = target.phone || '';

      const bothAreWrong = wrongNumber == 'both' && altPhone && phone;

      return (
        <Summary
          key="wrongNumberSummary"
          onEdit={() =>
            onReportUpdate({
              ...report,
              completed: false,
              organizerActionNeeded: false,
              step: 'wrongNumber',
              wrongNumber: null,
            })
          }
          state="failure"
          title={
            bothAreWrong ? (
              <Msg
                id={messageIds.report.steps.wrongNumber.summary.phoneBoth}
                values={{ altPhone, phone }}
              />
            ) : (
              <Msg
                id={messageIds.report.steps.wrongNumber.summary.phoneSingle}
                values={{
                  phone: report.wrongNumber == 'altPhone' ? altPhone : phone,
                }}
              />
            )
          }
        />
      );
    },
  },
  {
    getRenderVariant: (report) => {
      return report.step == 'organizerAction' ? 'question' : 'summary';
    },
    name: 'organizerAction',
    renderQuestion: (
      report,
      onReportUpdate,
      target,
      disableCallerNotes,
      callLogIsOpen
    ) => (
      <OrganizerAction
        key="organizerAction"
        callLogIsOpen={callLogIsOpen}
        disableCallerNotes={disableCallerNotes}
        onReportUpdate={onReportUpdate}
        report={report}
      />
    ),
    renderSummary: (report, onReportUpdate) => (
      <Summary
        key="organizerActionSummary"
        onEdit={() =>
          onReportUpdate({
            ...report,
            completed: false,
            leftMessage: false,
            organizerActionNeeded: false,
            step: 'organizerAction',
          })
        }
        state={report.organizerActionNeeded ? 'success' : 'failure'}
        subtitle={
          report.organizerActionNeeded ? (
            <Msg
              id={
                messageIds.report.steps.organizerAction.summary.orgActionNeeded
                  .subtitle
              }
            />
          ) : undefined
        }
        title={
          <Msg
            id={
              report.organizerActionNeeded
                ? messageIds.report.steps.organizerAction.summary
                    .orgActionNeeded.title
                : messageIds.report.steps.organizerAction.summary
                    .orgActionNotNeeded
            }
          />
        }
      />
    ),
  },
  {
    getRenderVariant: (report) => {
      if (!report.organizerActionNeeded) {
        return null;
      }

      return report.step == 'organizerLog' ? 'question' : 'summary';
    },
    name: 'organizerLog',
    renderQuestion: (
      report,
      onReportUpdate,
      target,
      disableCallerNotes,
      callLogIsOpen
    ) => {
      return (
        <OrganizerLog
          key="organizerLog"
          callLogIsOpen={callLogIsOpen}
          disableCallerNotes={disableCallerNotes}
          onReportUpdate={onReportUpdate}
          report={report}
          target={target}
        />
      );
    },
    renderSummary: (report, onReportUpdate) => (
      <Summary
        key="organizerLogSummary"
        onEdit={() =>
          onReportUpdate({
            ...report,
            step: 'organizerLog',
          })
        }
        state={report.organizerLog ? 'success' : 'failure'}
        subtitle={
          report.organizerLog ? (
            <Msg
              id={
                messageIds.report.steps.organizerLog.summary.withMessage
                  .subtitle
              }
              values={{ message: report.organizerLog }}
            />
          ) : undefined
        }
        title={
          <Msg
            id={
              report.organizerLog
                ? messageIds.report.steps.organizerLog.summary.withMessage.title
                : messageIds.report.steps.organizerLog.summary.withoutMessage
            }
          />
        }
      />
    ),
  },
  {
    getRenderVariant: (report, target, disableCallerNotes) => {
      if (disableCallerNotes) {
        //Don't render if assignment does not allow caller notes
        return null;
      }

      return report.step == 'callerLog' ? 'question' : 'summary';
    },
    name: 'callerLog',
    renderQuestion: (
      report,
      onReportUpdate,
      target,
      disableCallerNotes,
      callLogIsOpen
    ) => (
      <CallerLog
        key="callerLog"
        callLogIsOpen={callLogIsOpen}
        onReportUpdate={onReportUpdate}
        report={report}
      />
    ),
    renderSummary: (report, onReportUpdate) => (
      <Summary
        key="callerLogSummary"
        onEdit={() =>
          onReportUpdate({
            ...report,
            step: 'callerLog',
          })
        }
        state={report.callerLog ? 'success' : 'failure'}
        subtitle={
          report.callerLog ? (
            <Msg
              id={messageIds.report.steps.callerLog.summary.withNote.subtitle}
              values={{ note: report.callerLog }}
            />
          ) : undefined
        }
        title={
          <Msg
            id={
              report.callerLog
                ? messageIds.report.steps.callerLog.summary.withNote.title
                : messageIds.report.steps.callerLog.summary.withoutNote
            }
          />
        }
      />
    ),
  },
];
