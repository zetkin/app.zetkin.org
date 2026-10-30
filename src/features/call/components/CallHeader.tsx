import {
  AccessTimeFilled,
  ArrowBack,
  PowerSettingsNew,
  SkipNext,
  Stop,
  QrCode,
} from '@mui/icons-material';
import { FC, useState } from 'react';
import { Box } from '@mui/material';

import { LaneState, LaneStep, Report, UnfinishedCall } from '../types';
import ZUIOrgLogoAvatar from 'zui/components/ZUIOrgLogoAvatar';
import ZUIText from 'zui/components/ZUIText';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import ZUIPersonAvatar from 'zui/components/ZUIPersonAvatar';
import ZUIButton from 'zui/components/ZUIButton';
import { useAppDispatch } from 'core/hooks';
import { updateLaneStep } from '../store';
import useAllocateCall, { SerializedError } from '../hooks/useAllocateCall';
import useSubmitReport from '../hooks/useSubmitReport';
import useCallMutations from '../hooks/useCallMutations';
import { useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import notEmpty from 'utils/notEmpty';
import ZUILink from 'zui/components/ZUILink';
import useSetupReportStep from '../hooks/useSetupReportStep';
import ZUIIconButton from 'zui/components/ZUIIconButton';
import QRCodeImage from './QRCodeImage';
import ZUIModal from 'zui/components/ZUIModal';

type HeaderProps = {
  allocateCall: () => Promise<void | SerializedError>;
  assignment: ZetkinCallAssignment;
  call: UnfinishedCall | null;
  hasUnfinishedCalls: boolean;
  isAllocatingCall: boolean;
  lane: LaneState;
  onOpenCallLog: () => void;
  onSkipCall: () => void;
  onSubmitReport: () => Promise<void>;
  phoneNumbers: string[];
  queueError: SerializedError | null;
  quitCurrentCall: (callId: number) => void;
  report: Report;
  setupReportStep: () => void;
  submittingReport: boolean;
};

const MobileHeader: FC<HeaderProps> = ({
  allocateCall,
  assignment,
  call,
  onOpenCallLog,
  onSkipCall,
  onSubmitReport,
  phoneNumbers,
  quitCurrentCall,
  queueError,
  setupReportStep,
  report,
  lane,
  submittingReport,
  hasUnfinishedCalls,
  isAllocatingCall,
}) => {
  const dispatch = useAppDispatch();
  const messages = useMessages(messageIds);
  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.common.white,
          borderBottom: `1px solid ${theme.palette.dividers.main}`,
          height:
            lane.step === LaneStep.START || lane.step === LaneStep.SUMMARY
              ? '100px'
              : '80px',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
        })}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            gap: 1,
            left: 16,
            position: 'absolute',
            top:
              lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
                ? 16
                : -100,
            transition: '0.5s',
          }}
        >
          <ZUIOrgLogoAvatar orgId={assignment.organization.id} />
          <ZUIText>{assignment.organization.title}</ZUIText>
        </Box>
        <Box
          sx={{
            bottom:
              lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
                ? 16
                : 100,
            left: 16,
            position: 'absolute',
            transition: '0.5s',
          }}
        >
          <ZUIText
            variant={
              lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
                ? 'headingLg'
                : 'bodyMdRegular'
            }
          >
            {assignment.title}
          </ZUIText>
        </Box>
        <Box
          sx={{
            alignItems: 'center',
            bottom: 16,
            display: 'flex',
            gap: 1,
            left:
              lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
                ? '-100%'
                : 16,
            position: 'absolute',
            transition: 'left 0.5s',
          }}
        >
          {call?.target && (
            <>
              <ZUIPersonAvatar
                firstName={call.target.first_name}
                id={call.target.id}
                lastName={call.target.last_name}
              />
              <Box>
                <ZUIText variant="bodyMdSemiBold">{call.target.name}</ZUIText>
                <ZUIText
                  color="secondary"
                  sx={{ fontFamily: 'monospace' }}
                  variant="bodyMdSemiBold"
                >
                  {phoneNumbers.flatMap((phone, index) => {
                    return [
                      index > 0 ? '/' : null,
                      <ZUILink
                        key={phone}
                        href={`tel:${phone}`}
                        text={phone}
                      />,
                    ];
                  })}
                </ZUIText>
              </Box>
            </>
          )}
        </Box>
        <Box
          sx={{
            bottom: 16,
            display: 'flex',
            gap: 1,
            position: 'absolute',
            right: 16,
          }}
        >
          <ZUIIconButton
            icon={AccessTimeFilled}
            onClick={onOpenCallLog}
            variant="secondary"
          />
          {lane.step === LaneStep.START && (
            <ZUIIconButton
              href="/my/home"
              icon={PowerSettingsNew}
              variant="secondary"
            />
          )}
          {lane.step !== LaneStep.START && (
            <ZUIIconButton
              icon={Stop}
              onClick={() => {
                if (call) {
                  quitCurrentCall(call.id);
                } else {
                  dispatch(updateLaneStep(LaneStep.START));
                }
              }}
              variant="secondary"
            />
          )}
          {(lane.step === LaneStep.CALL || lane.step === LaneStep.REPORT) && (
            <ZUIIconButton
              icon={SkipNext}
              onClick={() => onSkipCall()}
              variant="secondary"
            />
          )}
        </Box>
      </Box>
      <Box
        sx={{
          bottom: 16,
          display: 'flex',
          gap: 1,
          justifyContent:
            lane.step === LaneStep.CALL || lane.step === LaneStep.REPORT
              ? 'space-between'
              : 'flex-end',
          position: 'absolute',
          right: 16,
          width: 'calc(100% - 32px)',
          zIndex: 16,
        }}
      >
        {lane.step === LaneStep.REPORT && (
          <ZUIButton
            label={messages.mobile.report.back()}
            onClick={() => {
              dispatch(updateLaneStep(LaneStep.CALL));
            }}
            startIcon={ArrowBack}
            variant="secondary"
          />
        )}
        {lane.step === LaneStep.CALL && call && !call.target.alt_phone && (
          <ZUIButton
            fullWidth
            href={`tel:${call.target.phone}`}
            label={messages.mobile.call.onlyOne({
              name: call?.target.name,
            })}
            variant="primary"
          />
        )}
        {lane.step === LaneStep.CALL &&
          call &&
          call.target.phone &&
          call.target.alt_phone && (
            <Box sx={{ display: 'flex', gap: 1, width: '85%' }}>
              <ZUIButton
                clampLines={3}
                fullWidth
                href={`tel:${call.target.alt_phone}`}
                label={messages.mobile.call.alt({
                  number: call?.target.alt_phone,
                })}
                variant="primary"
              />
              <ZUIButton
                clampLines={3}
                fullWidth
                href={`tel:${call.target.phone}`}
                label={messages.mobile.call.main({
                  number: call?.target.phone,
                })}
                variant="primary"
              />
            </Box>
          )}
        <ZUIButton
          disabled={
            !!queueError || (lane.step == LaneStep.REPORT && !report.completed)
          }
          isLoading={isAllocatingCall || submittingReport}
          label={messages.header.primaryButton[lane.step]()}
          onClick={async () => {
            if (lane.step == LaneStep.START) {
              await allocateCall();
            } else if (lane.step == LaneStep.CALL) {
              setupReportStep();
            } else if (lane.step == LaneStep.REPORT) {
              onSubmitReport();
            } else {
              //Lane step must be Summary
              await allocateCall();
            }
          }}
          variant={
            (lane.step == LaneStep.SUMMARY && hasUnfinishedCalls) ||
            lane.step == LaneStep.CALL
              ? 'secondary'
              : 'primary'
          }
        />
      </Box>
    </>
  );
};

const DesktopHeader: FC<Omit<HeaderProps, 'onOpenCallLog'>> = ({
  allocateCall,
  assignment,
  call,
  onSkipCall,
  onSubmitReport,
  phoneNumbers,
  quitCurrentCall,
  queueError,
  setupReportStep,
  report,
  lane,
  submittingReport,
  hasUnfinishedCalls,
  isAllocatingCall,
}) => {
  const dispatch = useAppDispatch();
  const messages = useMessages(messageIds);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const encodedName = encodeURIComponent(
    `${call?.target.first_name} ${call?.target.last_name}`
  );

  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.palette.common.white,
        borderBottom: `1px solid ${theme.palette.dividers.main}`,
        height: '100px',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      })}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 1,
          left: 16,
          position: 'absolute',
          top:
            lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
              ? 16
              : -50,
          transition: '0.5s',
        }}
      >
        <ZUIOrgLogoAvatar orgId={assignment.organization.id} />
        <ZUIText>{assignment.organization.title}</ZUIText>
      </Box>
      <Box
        sx={{
          bottom:
            lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
              ? 16
              : 60,
          left: 16,
          position: 'absolute',
          transition: '0.5s',
        }}
      >
        <ZUIText
          variant={
            lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
              ? 'headingLg'
              : 'bodyMdRegular'
          }
        >
          {assignment.title}
        </ZUIText>
      </Box>
      <Box
        sx={{
          alignItems: 'center',
          bottom: 16,
          display: 'flex',
          gap: 1,
          left:
            lane.step == LaneStep.START || lane.step == LaneStep.SUMMARY
              ? '-100%'
              : 16,
          position: 'absolute',
          transition: 'left 0.5s',
        }}
      >
        {call?.target && (
          <>
            <ZUIPersonAvatar
              firstName={call.target.first_name}
              id={call.target.id}
              lastName={call.target.last_name}
            />
            <ZUIText variant="headingLg">{call.target.name}</ZUIText>
            <ZUIText
              color="secondary"
              sx={{ fontFamily: 'monospace' }}
              variant="headingLg"
            >
              {phoneNumbers.flatMap((phone, index) => {
                return [
                  index > 0 ? '/' : null,
                  <ZUILink key={phone} href={`tel:${phone}`} text={phone} />,
                ];
              })}
            </ZUIText>
            <ZUIIconButton
              icon={QrCode}
              onClick={() => {
                setQrModalOpen(true);
              }}
            />
            <ZUIModal
              onClose={() => setQrModalOpen(false)}
              open={qrModalOpen}
              title={messages.header.qrModal.title()}
            >
              <QRCodeImage
                clickable
                url={`${location.origin}/call/companion?name=${encodedName}&numbers=${phoneNumbers.join(',')}`}
              />
            </ZUIModal>
          </>
        )}
      </Box>
      <Box
        sx={{
          bottom: 16,
          display: 'flex',
          gap: 1,
          position: 'absolute',
          right: 16,
        }}
      >
        {lane.step != LaneStep.START && lane.step != LaneStep.SUMMARY && (
          <ZUIButton
            label="Stop"
            onClick={() => {
              if (call) {
                quitCurrentCall(call.id);
              }
            }}
            variant="tertiary"
          />
        )}
        <ZUIButton
          endIcon={
            lane.step != LaneStep.START && lane.step != LaneStep.SUMMARY
              ? SkipNext
              : undefined
          }
          href={lane.step == LaneStep.START ? '/my/home' : undefined}
          label={messages.header.secondaryButton[lane.step]()}
          onClick={() => {
            if (lane.step != LaneStep.START && lane.step != LaneStep.SUMMARY) {
              onSkipCall();
            } else if (lane.step == LaneStep.SUMMARY) {
              dispatch(updateLaneStep(LaneStep.START));
            }
          }}
          variant="secondary"
        />
        <ZUIButton
          disabled={
            !!queueError || (lane.step == LaneStep.REPORT && !report.completed)
          }
          isLoading={isAllocatingCall || submittingReport}
          label={messages.header.primaryButton[lane.step]()}
          onClick={async () => {
            if (lane.step == LaneStep.START) {
              await allocateCall();
            } else if (lane.step == LaneStep.CALL) {
              setupReportStep();
            } else if (lane.step == LaneStep.REPORT) {
              await onSubmitReport();
            } else {
              //Lane step must be Summary
              await allocateCall();
            }
          }}
          variant={
            lane.step == LaneStep.SUMMARY && hasUnfinishedCalls
              ? 'secondary'
              : 'primary'
          }
        />
      </Box>
    </Box>
  );
};

type Props = {
  assignment: ZetkinCallAssignment;
  call: UnfinishedCall | null;
  hasUnfinishedCalls: boolean;
  isMobile: boolean;
  lane: LaneState;
  onOpenCallLog: () => void;
  onSkipCall: () => void;
  report: Report;
};

const CallHeader: FC<Props> = ({
  assignment,
  call,
  hasUnfinishedCalls,
  isMobile,
  lane,
  onOpenCallLog,
  onSkipCall,
  report,
}) => {
  const setupReportStep = useSetupReportStep(assignment.organization.id);
  const [submittingReport, setSubmittingReport] = useState(false);

  const { quitCurrentCall } = useCallMutations(assignment.organization.id);
  const {
    allocateCall,
    queueError,
    isLoading: isAllocatingCall,
  } = useAllocateCall(assignment.organization.id, assignment.id);
  const submitReport = useSubmitReport(assignment.organization.id);

  const phoneNumbers = [call?.target.phone, call?.target.alt_phone].filter(
    notEmpty
  );

  return isMobile ? (
    <MobileHeader
      allocateCall={allocateCall}
      assignment={assignment}
      call={call}
      hasUnfinishedCalls={hasUnfinishedCalls}
      isAllocatingCall={isAllocatingCall}
      lane={lane}
      onOpenCallLog={onOpenCallLog}
      onSkipCall={onSkipCall}
      onSubmitReport={async () => {
        if (!report || !call) {
          return;
        }
        setSubmittingReport(true);
        await submitReport(call.id, report, call.target.id);
        setSubmittingReport(false);
      }}
      phoneNumbers={phoneNumbers}
      queueError={queueError}
      quitCurrentCall={quitCurrentCall}
      report={report}
      setupReportStep={setupReportStep}
      submittingReport={submittingReport}
    />
  ) : (
    <DesktopHeader
      allocateCall={allocateCall}
      assignment={assignment}
      call={call}
      hasUnfinishedCalls={hasUnfinishedCalls}
      isAllocatingCall={isAllocatingCall}
      lane={lane}
      onSkipCall={onSkipCall}
      onSubmitReport={async () => {
        if (!report || !call) {
          return;
        }
        setSubmittingReport(true);
        await submitReport(call.id, report, call.target.id);
        setSubmittingReport(false);
      }}
      phoneNumbers={phoneNumbers}
      queueError={queueError}
      quitCurrentCall={quitCurrentCall}
      report={report}
      setupReportStep={setupReportStep}
      submittingReport={submittingReport}
    />
  );
};

export default CallHeader;
