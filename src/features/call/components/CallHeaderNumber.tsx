import {
  MouseEvent as ReactMouseEvent,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { ZetkinCall } from 'features/call/types';
import { ZetkinCallAssignment } from 'utils/types/zetkin';
import { useEnv } from 'core/hooks';
import ZUILink from 'zui/components/ZUILink';
import ZUIText from 'zui/components/ZUIText';

export const CallHeaderNumber = ({
  assignment,
  call,
  phone,
}: {
  assignment: ZetkinCallAssignment;
  call: ZetkinCall;
  phone: string;
}) => {
  const env = useEnv();
  const voipIframeRef = useRef<HTMLIFrameElement>(null);

  const voipUrl = useMemo(() => {
    if (!env.vars.VOIP_EMBED_URL || !call) {
      return null;
    }

    return (
      env.vars.VOIP_EMBED_URL +
      '#' +
      new URLSearchParams({
        assignment: assignment.id.toString(),
        caller: call.caller.id.toString(),
        org: assignment.organization.id.toString(),
        tel: phone,
      }).toString()
    );
  }, [assignment, call, env.vars]);

  const onClick = useCallback(
    (ev: ReactMouseEvent<HTMLAnchorElement>) => {
      if (!voipUrl || !voipIframeRef.current) {
        return;
      }

      ev.preventDefault();
      voipIframeRef.current.src = voipUrl + '&call=1';
    },
    [voipUrl]
  );

  return (
    <>
      <ZUIText
        color="secondary"
        sx={{ fontFamily: 'monospace', transform: 'translateY(2px)' }}
        variant="headingLg"
      >
        <ZUILink
          href={voipUrl ? '' : `tel:${phone}`}
          onClick={onClick}
          text={phone}
        />
      </ZUIText>
      {voipUrl && (
        <iframe
          ref={voipIframeRef}
          allow="microphone"
          src={voipUrl}
          style={{
            border: '0',
            height: '27px',
            width: '120px',
          }}
          title="Voip call button"
        />
      )}
    </>
  );
};
