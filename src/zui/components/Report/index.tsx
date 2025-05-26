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
    target?: ZetkinCallTarget
  ) => ReactNode;
  renderSummary: (
    report: ReportType,
    onReportUpdate: (updatedReport: ReportType) => void
  ) => ReactNode;
  renderVariant: (
    report: ReportType,
    phoneAndAltPhone?: Pick<ZetkinCallTarget, 'phone' | 'alt_phone'>
  ) => 'question' | 'summary' | null;
};

const reportSteps: ReportStep[] = [
  {
    name: 'successOrFailure',
    renderQuestion: (report, onReportUpdate) => (
      <SuccessOrFailure onReportUpdate={onReportUpdate} report={report} />
    ),
    renderSummary: (report, onReportUpdate) => (
      <Summary
        onClick={() =>
          onReportUpdate({
            ...report,
            callBackAfter: null,
            callerLog: '',
            failureReason: null,
            leftMessage: false,
            organizerActionNeeded: false,
            organizerLog: '',
            step: 'successOrFailure',
            success: false,
            targetCouldTalk: false,
            wrongNumber: null,
          })
        }
        title={report.success ? 'Was reached' : 'Did not reach'}
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
    renderQuestion: (report, onReportUpdate) => (
      <CouldTalk onReportUpdate={onReportUpdate} report={report} />
    ),
    renderSummary: (report, onReportUpdate) => (
      <Summary
        onClick={() =>
          onReportUpdate({
            ...report,
            callBackAfter: null,
            callerLog: '',
            failureReason: null,
            leftMessage: false,
            organizerActionNeeded: false,
            organizerLog: '',
            step: 'couldTalk',
            targetCouldTalk: false,
            wrongNumber: null,
          })
        }
        title={
          report.targetCouldTalk ? 'They could talk' : 'They could not talk'
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
    renderSummary: (report, onReportUpdate) => {
      if (report.failureReason) {
        const failureReasons = {
          lineBusy: 'The line was busy',
          noPickup: 'They did not pick up',
          notAvailable: 'They were not available to talk, we need to call back',
          wrongNumber: 'The number was wrong',
        };

        return (
          <Summary
            onClick={() =>
              onReportUpdate({
                ...report,
                callBackAfter: null,
                callerLog: '',
                failureReason: null,
                leftMessage: false,
                organizerActionNeeded: false,
                organizerLog: '',
                step: 'failureReason',
                wrongNumber: null,
              })
            }
            title={failureReasons[report.failureReason]}
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
        onClick={() =>
          onReportUpdate({
            ...report,
            callBackAfter: null,
            callerLog: '',
            leftMessage: false,
            organizerActionNeeded: false,
            organizerLog: '',
            step: 'leftMessage',
            wrongNumber: null,
          })
        }
        title={
          report.leftMessage
            ? 'Left message on answering machine'
            : 'Did not leave message'
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
    renderSummary: (report, onReportUpdate) => (
      <Summary
        onClick={() =>
          onReportUpdate({
            ...report,
            callBackAfter: null,
            callerLog: '',
            organizerActionNeeded: false,
            organizerLog: '',
            step: 'callBack',
            wrongNumber: null,
          })
        }
        title={`Call back after ${report.callBackAfter}`}
      />
    ),
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
    renderSummary: (report, onReportUpdate) => (
      <Summary
        onClick={() =>
          onReportUpdate({
            ...report,
            callBackAfter: null,
            callerLog: '',
            organizerActionNeeded: false,
            organizerLog: '',
            step: 'wrongNumber',
            wrongNumber: null,
          })
        }
        title="We had the wrong number"
      />
    ),
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
        onClick={() =>
          onReportUpdate({
            ...report,
            callerLog: '',
            leftMessage: false,
            organizerActionNeeded: false,
            organizerLog: '',
            step: 'orgAction',
          })
        }
        title={
          report.organizerActionNeeded
            ? 'You want an organizer to take a look at this call'
            : 'No action is neccessary'
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
      const wrongNumber = report.wrongNumber;
      const phone = target?.phone;
      const altPhone = target?.alt_phone;

      const wrongNumberMessages = {
        altPhone: `Alt phone is wrong: ${altPhone}`,
        both: `Both phone numbers are wrong, ${phone} and ${altPhone}`,
        phone: `Phone is wrong ${phone}`,
      } as const;

      return (
        <OrganizerLog
          initialMessage={
            wrongNumber ? wrongNumberMessages[wrongNumber] : undefined
          }
          onReportUpdate={onReportUpdate}
          report={report}
        />
      );
    },
    renderSummary: (report, onReportUpdate) => (
      <Summary
        onClick={() =>
          onReportUpdate({
            ...report,
            callerLog: '',
            leftMessage: false,
            organizerLog: '',
            step: 'orgLog',
          })
        }
        title={
          report.organizerLog
            ? 'You left a message to official'
            : 'You did not leave a message to official'
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
        onClick={() =>
          onReportUpdate({
            ...report,
            callerLog: '',
            leftMessage: false,
            step: 'callerLog',
          })
        }
        title={
          report.callerLog
            ? 'You left a message to future callers'
            : 'You did not leave a message to future callers'
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
    <Stack gap="1rem">
      {steps.map((render) => render(report, onReportUpdate, target))}
    </Stack>
  );
};

export default Report;
