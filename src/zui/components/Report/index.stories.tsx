import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Report, { ReportType } from './index';

const meta: Meta<typeof Report> = {
  component: Report,
  title: 'Components/Report',
};
export default meta;

type Story = StoryObj<typeof Report>;

const initialReport: ReportType = {
  callBackAfter: null,
  callerLog: '',
  disableCallerNotes: false,
  failureReason: null,
  leftMessage: false,
  organizerActionNeeded: false,
  organizerLog: '',
  step: 'successOrFailure',
  success: false,
  targetCouldTalk: false,
  wrongNumber: null,
};

export const Basic: Story = {
  args: { report: initialReport },
  render: function Render() {
    const [report, setReport] = useState<ReportType>(initialReport);

    return (
      <Report
        onReportUpdate={(updatedReport) => setReport(updatedReport)}
        report={report}
        target={{ alt_phone: '02349234', phone: '29384298347' }}
      />
    );
  },
};
