import { Stack } from '@mui/material';
import { FC, ReactNode } from 'react';

import SuccessOrFailure from './steps/SuccessOrFailure';
import FailureReason from './steps/FailureReason';
import CouldTalk from './steps/CouldTalk';
import CallBack from './steps/CallBack';
import LeftMessage from './steps/LeftMessage';
import OrganizerAction from './steps/OrganizerAction';
import OrganizerLog from './steps/OrganizerLog';
import CallerLog from './steps/CallerLog';
import WrongNumber from './steps/WrongNumber';
import { ZetkinCallTarget } from 'features/call/types';
import Summary from './steps/Summary';
import messageIds from 'features/call/l10n/messageIds';
import { Msg } from 'core/i18n';
import ZUIDateTime from 'zui/ZUIDateTime';
import ZUIDate from 'zui/ZUIDate';

const Step = {
  callBack: 'callBack',
  callerLog: 'callerLog',
  couldTalk: 'couldTalk',
  failureReason: 'failureReason',
  leftMessage: 'leftMessage',
  orgAction: 'organizerAction',
  orgLog: 'organizerLog',
  successOrFailure: 'successOrFailure',
  summary: 'summary',
  wrongNumber: 'wrongNumber',
} as const;

export type ReportType = {
  callBackAfter: string | null;
  callerLog: string;
  disableCallerNotes: boolean;
  failureReason:
    | ('lineBusy' | 'noPickup' | 'wrongNumber' | 'notAvailable')
    | null;
  leftMessage: boolean;
  organizerActionNeeded: boolean;
  organizerLog: string;
  step: keyof typeof Step;
  success: boolean;
  targetCouldTalk: boolean;
  wrongNumber: ('altPhone' | 'phone' | 'both') | null;
};

type ReportStep = {
  name: ReportType['step'];
  renderQuestion: (
    report: ReportType,
    onReportUpdate: (updatedReport: ReportType) => void,
    target: ZetkinCallTarget
  ) => ReactNode;
  renderSummary: (
    report: ReportType,
    onReportUpdate: (updatedReport: ReportType) => void,
    target: ZetkinCallTarget
  ) => ReactNode;
  renderVariant: (
    report: ReportType,
    target?: ZetkinCallTarget
  ) => 'question' | 'summary' | null;
};

const reportSteps: ReportStep[] = [
  {
    name: 'successOrFailure',
    renderQuestion: (report, onReportUpdate, target) => (
      <SuccessOrFailure
        firstName={target.first_name}
        onReportUpdate={onReportUpdate}
        report={report}
      />
    ),
    renderSummary: (report, onReportUpdate, target) => (
      <Summary
        onEdit={() =>
          onReportUpdate({
            ...report,
            callBackAfter: null,
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
    renderVariant: (report) => {
      if (report.step == 'successOrFailure') {
        return 'question';
      } else {
        return 'summary';
      }
    },
  },
  {
    name: 'couldTalk',
    renderQuestion: (report, onReportUpdate, target) => (
      <CouldTalk
        firstName={target.first_name}
        onReportUpdate={onReportUpdate}
        report={report}
      />
    ),
    renderSummary: (report, onReportUpdate, target) => (
      <Summary
        onEdit={() =>
          onReportUpdate({
            ...report,
            callBackAfter: null,
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
    renderVariant: (report) => {
      if (!report.success) {
        return null;
      }

      return report.step == 'couldTalk' ? 'question' : 'summary';
    },
  },
  {
    name: 'failureReason',
    renderQuestion: (report, onReportUpdate, target) => {
      const phone = target?.phone;
      const altPhone = target?.alt_phone;

      return (
        <FailureReason
          nextStepIfWrongNumber={phone && altPhone ? 'wrongNumber' : 'orgLog'}
          onReportUpdate={onReportUpdate}
          report={report}
        />
      );
    },
    renderSummary: (report, onReportUpdate, target) => {
      if (report.failureReason) {
        return (
          <Summary
            onEdit={() =>
              onReportUpdate({
                ...report,
                callBackAfter: null,
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
    renderVariant: (report) => {
      if (report.success) {
        // Don't render this step at all if the call was successful.
        return null;
      }

      return report.step == 'failureReason' ? 'question' : 'summary';
    },
  },
  {
    name: 'leftMessage',
    renderQuestion: (report, onReportUpdate) => (
      <LeftMessage onReportUpdate={onReportUpdate} report={report} />
    ),
    renderSummary: (report, onReportUpdate) => (
      <Summary
        onEdit={() =>
          onReportUpdate({
            ...report,
            callBackAfter: null,
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
    renderVariant: (report) => {
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
  },

  {
    name: 'callBack',
    renderQuestion: (report, onReportUpdate) => (
      <CallBack onReportUpdate={onReportUpdate} report={report} />
    ),
    renderSummary: (report, onReportUpdate, target) => {
      if (!report.callBackAfter) {
        return null;
      }

      const isAnyTimeOfDay = report.callBackAfter.slice(-5) == '00:00';

      return (
        <Summary
          onEdit={() =>
            onReportUpdate({
              ...report,
              callerLog: '',
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
            isAnyTimeOfDay ? (
              <Msg
                id={messageIds.report.steps.callBack.summary.anyTime}
                values={{ date: <ZUIDate datetime={report.callBackAfter} /> }}
              />
            ) : (
              <Msg
                id={messageIds.report.steps.callBack.summary.afterSpecificTime}
                values={{
                  time: <ZUIDateTime datetime={report.callBackAfter} />,
                }}
              />
            )
          }
        />
      );
    },
    renderVariant: (report) => {
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
  },
  {
    name: 'wrongNumber',
    renderQuestion: (report, onReportUpdate, target) => {
      if (target && target.alt_phone && target.phone) {
        return (
          <WrongNumber
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
          onEdit={() =>
            onReportUpdate({
              ...report,
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
    renderVariant: (report, target) => {
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
  },
  {
    name: 'orgAction',
    renderQuestion: (report, onReportUpdate) => (
      <OrganizerAction onReportUpdate={onReportUpdate} report={report} />
    ),
    renderSummary: (report, onReportUpdate) => (
      <Summary
        onEdit={() =>
          onReportUpdate({
            ...report,
            leftMessage: false,
            organizerActionNeeded: false,
            step: 'orgAction',
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
    renderVariant: (report) => {
      return report.step == 'orgAction' ? 'question' : 'summary';
    },
  },
  {
    name: 'orgLog',
    renderQuestion: (report, onReportUpdate, target) => {
      return (
        <OrganizerLog
          onReportUpdate={onReportUpdate}
          report={report}
          target={target}
        />
      );
    },
    renderSummary: (report, onReportUpdate) => (
      <Summary
        onEdit={() =>
          onReportUpdate({
            ...report,
            step: 'orgLog',
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
    renderVariant: (report) => {
      if (!report.organizerActionNeeded) {
        return null;
      }

      return report.step == 'orgLog' ? 'question' : 'summary';
    },
  },
  {
    name: 'callerLog',
    renderQuestion: (report, onReportUpdate) => (
      <CallerLog onReportUpdate={onReportUpdate} report={report} />
    ),
    renderSummary: (report, onReportUpdate) => (
      <Summary
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
    renderVariant: (report) => {
      if (report.disableCallerNotes) {
        //Don't render if assignment does not allow caller notes
        return null;
      }

      return report.step == 'callerLog' ? 'question' : 'summary';
    },
  },
];

type ReportProps = {
  onReportUpdate: (updatedReport: ReportType) => void;
  report: ReportType;
  target: ZetkinCallTarget;
};

const Report: FC<ReportProps> = ({ onReportUpdate, report, target }) => {
  const steps = [];
  const currentStep =
    report.step == 'summary'
      ? 'summary'
      : reportSteps.find((step) => step.name == report.step);

  let currentStepIndex: number = 0;
  if (currentStep) {
    if (currentStep == 'summary') {
      currentStepIndex = reportSteps.length;
    } else {
      currentStepIndex = reportSteps.indexOf(currentStep);
    }
  }

  for (let i = 0; i <= currentStepIndex; i++) {
    if (i == reportSteps.length) {
      //We've finished, do nothing.
    } else {
      const step = reportSteps[i];

      const renderVariant = step.renderVariant(report, target);

      if (renderVariant == 'summary') {
        steps.push(step.renderSummary);
      }

      if (renderVariant == 'question') {
        steps.push(step.renderQuestion);
      }
    }
  }

  return (
    <Stack>
      {steps.map((render) => render(report, onReportUpdate, target))}
    </Stack>
  );
};

export default Report;
