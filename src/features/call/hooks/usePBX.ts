'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  Registerer,
  RegistererState,
  Session,
  SessionState,
  UserAgent,
} from 'sip.js';

import useUser from 'core/hooks/useUser';

// SIP.js types — only used as type annotations, not imported at runtime.
// The actual module is loaded dynamically inside useEffect / async functions
// to avoid evaluating it during SSR (it pulls in jsdom which is Node-only).

export type PBXStatus = 'idle' | 'connecting' | 'registered' | 'error';
export type CallStatus = 'idle' | 'calling' | 'connected';

export type PBXHandle = {
  /** Active voice-call state. */
  callStatus: CallStatus;
  /** Hang up the current call, if any. */
  hangup: () => void;
  /**
   * Dial a destination (raw phone number or SIP user).
   * The destination is used as the user part of sip:<dest>@<PBX_HOST>.
   * No-op when status != 'registered'.
   */
  invite: (destination: string) => Promise<void>;
  /** SIP registration status. */
  status: PBXStatus;
};

const PBX_HOST = process.env.NEXT_PUBLIC_PBX_HOST ?? 'localhost';
// Port 5066 is plain WebSocket (no TLS) — use ws:// not wss://.
// For production, switch to wss://${PBX_HOST}:7443 with a real cert.
const PBX_WS = `ws://${PBX_HOST}:5066`;

// FreeSWITCH directory returns this hardcoded password for all users.
// The real authorization check happens via JWT in the Config API.
const SIP_PASSWORD = '12345';

export default function usePBX(): PBXHandle {
  const user = useUser();
  const [status, setStatus] = useState<PBXStatus>('idle');
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');

  const uaRef = useRef<UserAgent | null>(null);
  const registererRef = useRef<Registerer | null>(null);
  const sessionRef = useRef<Session | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    async function start() {
      setStatus('connecting');

      // Fetch the Zetkin OAuth token from the session so we can pass
      // it as X-Zetkin-JWT to FreeSWITCH, which forwards it to the
      // Config API for authorization.
      let token: string;
      try {
        const res = await fetch('/api/pbx-token');
        if (!res.ok) {
          throw new Error(`pbx-token returned ${res.status}`);
        }
        const body = await res.json();
        token = body.token as string;
        // eslint-disable-next-line no-console
        console.log('[PBX] token fetched, connecting to', PBX_WS);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[PBX] failed to fetch token:', err);
        if (!cancelled) {
          setStatus('error');
        }
        return;
      }

      if (cancelled) {
        return;
      }

      // Dynamic import keeps SIP.js out of the SSR bundle entirely.
      const { Registerer, RegistererState, UserAgent } = await import('sip.js');

      if (cancelled) {
        return;
      }

      const userId = String(user!.id);
      const uri = UserAgent.makeURI(`sip:${userId}@${PBX_HOST}`);
      if (!uri) {
        setStatus('error');
        return;
      }

      const ua = new UserAgent({
        authorizationPassword: SIP_PASSWORD,
        authorizationUsername: userId,
        logLevel: 'warn',
        transportOptions: { server: PBX_WS },
        uri,
      });
      uaRef.current = ua;

      const registerer = new Registerer(ua, {
        // Pass the Zetkin token as a SIP header so FreeSWITCH can
        // forward it to the Config API directory endpoint.
        extraHeaders: [`X-Zetkin-JWT: ${token}`],
      });
      registererRef.current = registerer;

      registerer.stateChange.addListener((state: RegistererState) => {
        if (cancelled) {
          return;
        }

        if (state === RegistererState.Registered) {
          setStatus('registered');
        } else if (state === RegistererState.Unregistered) {
          setStatus('idle');
        } else if (state === RegistererState.Terminated) {
          setStatus('error');
        }
      });

      try {
        await ua.start();
        if (cancelled) {
          await ua.stop();
          return;
        }
        await registerer.register();
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[PBX] SIP connection/registration failed:', err);
        if (!cancelled) {
          setStatus('error');
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      sessionRef.current?.bye().catch(() => undefined);
      registererRef.current?.unregister().catch(() => undefined);
      uaRef.current?.stop().catch(() => undefined);
      sessionRef.current = null;
      registererRef.current = null;
      uaRef.current = null;
    };
  }, [user, user?.id]);

  async function invite(destination: string) {
    const ua = uaRef.current;
    if (!ua) {
      return;
    }

    const { Inviter, SessionState, UserAgent } = await import('sip.js');

    const targetUri = UserAgent.makeURI(`sip:${destination}@${PBX_HOST}`);
    if (!targetUri) {
      return;
    }

    const inviter = new Inviter(ua, targetUri, {
      sessionDescriptionHandlerOptions: {
        constraints: { audio: true, video: false },
      },
    });
    sessionRef.current = inviter;
    setCallStatus('calling');

    inviter.stateChange.addListener((state: SessionState) => {
      if (state === SessionState.Established) {
        setCallStatus('connected');
      } else if (state === SessionState.Terminated) {
        setCallStatus('idle');
        sessionRef.current = null;
      }
    });

    try {
      await inviter.invite();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[PBX] invite failed:', err);
      setCallStatus('idle');
      sessionRef.current = null;
    }
  }

  function hangup() {
    const session = sessionRef.current;
    if (!session) {
      return;
    }
    session.bye().catch(() => undefined);
    sessionRef.current = null;
    setCallStatus('idle');
  }

  return { callStatus, hangup, invite, status };
}
