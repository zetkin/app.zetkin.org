'use client';

import { Box } from '@mui/material';
import { FC, useEffect, useRef, useState } from 'react';
import { SimpleUser, SimpleUserOptions } from 'sip.js/lib/platform/web';

import useMyCallAssignments from 'features/callAssignments/hooks/useMyCallAssignments';
import StepsHeader from '../components/headers/StepsHeader';
import StatsHeader from '../components/headers/StatsHeader';
import CallStats from '../components/CallStats';
import CallPrepare from '../components/CallPrepare';
import CallOngoing from '../components/CallOngoing';
import CallReport from '../components/CallReport';
import CallSummary from '../components/CallSummary';
import useCurrentCall from '../hooks/useCurrentCall';
import ReportHeader from '../components/ReportHeader';
import useUser from 'core/hooks/useUser';
import { VoipCallState } from '../types';

type Props = {
  callAssId: string;
  jwt: string;
};

export enum CallStep {
  STATS = 0,
  PREPARE = 1,
  ONGOING = 2,
  REPORT = 3,
  SUMMARY = 4,
}

const CallPage: FC<Props> = ({ callAssId, jwt }) => {
  const sipRef = useRef<SimpleUser | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ringbackRef = useRef<HTMLAudioElement | null>();
  const [callState, setCallState] = useState<VoipCallState>('idle');
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [activeStep, setActiveStep] = useState<CallStep>(CallStep.STATS);
  const assignments = useMyCallAssignments();
  const currentCall = useCurrentCall();
  const user = useUser();

  useEffect(() => {
    ringbackRef.current = new Audio('/ringback.ogg');
  }, []);

  useEffect(() => {
    setCallState('idle');
    setCallStartTime(null);
  }, [currentCall?.id]);

  useEffect(() => {
    const audioElem = audioRef.current;
    if (user && audioElem) {
      // TODO: Externalize these
      const server = 'wss://192.168.64.2:7443';
      const aor = 'sip:+19342470964@international.twilio';
      const authorizationUsername = user.id.toString();
      const authorizationPassword = '12345'; // TODO: Generate this

      // Configuration Options
      const options: SimpleUserOptions = {
        aor,
        media: {
          remote: {
            audio: audioElem,
          },
        },
        userAgentOptions: {
          authorizationPassword,
          authorizationUsername,
        },
      };

      // Construct a SimpleUser instance
      const simpleUser = new SimpleUser(server, options);
      simpleUser.connect();

      simpleUser.delegate = {
        onCallAnswered: () => {
          setCallStartTime(new Date());
          setCallState('connected');
          ringbackRef.current?.pause();
        },
        onCallHangup() {
          setCallState('hungup');
          ringbackRef.current?.pause();
        },
      };

      sipRef.current = simpleUser;
    } else {
      sipRef.current = null;
    }
  }, [audioRef.current]);

  const assignment = assignments.find(
    (assignment) => assignment.id === parseInt(callAssId)
  );

  if (!assignment || !user) {
    return null;
  }

  return (
    <Box>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption*/}
      <audio ref={audioRef}>
        {/* TODO: Replace with modal saying VoIP won't work */}
        <p>Your browser doesnt support HTML5 audio.</p>
      </audio>
      {activeStep == CallStep.STATS && (
        <>
          <StatsHeader
            assignment={assignment}
            onBack={() => setActiveStep(CallStep.STATS)}
            onPrepareCall={() => setActiveStep(CallStep.PREPARE)}
          />
          <CallStats
            assignment={assignment}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
          />
        </>
      )}
      {activeStep == CallStep.PREPARE && (
        <>
          <StepsHeader
            assignment={assignment}
            callStartTime={callStartTime}
            callState={callState}
            onBack={() => setActiveStep(CallStep.STATS)}
            onNextStep={async () => {
              const sipUser = sipRef.current;
              if (sipUser) {
                const destination = 'sip:+46704007858@external';

                if (!sipUser.isConnected) {
                  await sipUser.connect();
                }

                if (ringbackRef.current) {
                  ringbackRef.current.currentTime = 0;
                  ringbackRef.current.loop = true;
                  ringbackRef.current.play();
                }

                setCallState('dialling');
                sipUser.call(destination, {
                  extraHeaders: [`X-Zetkin-JWT: ${jwt}`],
                });
              }
              setActiveStep(CallStep.ONGOING);
            }}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
            step={CallStep.PREPARE}
          />

          <CallPrepare assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.ONGOING && (
        <>
          <StepsHeader
            assignment={assignment}
            callStartTime={callStartTime}
            callState={callState}
            onBack={() => setActiveStep(CallStep.STATS)}
            onNextStep={() => setActiveStep(CallStep.REPORT)}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
            step={CallStep.ONGOING}
          />

          <CallOngoing assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.REPORT && currentCall && (
        <>
          <ReportHeader
            assignment={assignment}
            callId={currentCall.id}
            onBack={() => setActiveStep(CallStep.ONGOING)}
            onForward={() => setActiveStep(CallStep.SUMMARY)}
          />
          <CallReport assignment={assignment} />
        </>
      )}
      {activeStep == CallStep.SUMMARY && (
        <>
          <StepsHeader
            assignment={assignment}
            onBack={() => setActiveStep(CallStep.STATS)}
            onNextStep={() => setActiveStep(CallStep.PREPARE)}
            onSwitchCall={() => setActiveStep(CallStep.PREPARE)}
            step={CallStep.SUMMARY}
          />
          <CallSummary />
        </>
      )}
    </Box>
  );
};

export default CallPage;
