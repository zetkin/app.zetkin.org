import { Fade } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useEventActions from '../hooks/useEventActions';
import { ZetkinEventWithStatus } from '../types';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ZUISignUpChip from 'zui/components/ZUISignUpChip';
import useUser from 'core/hooks/useUser';

export const EventSignupButton = ({
  event,
  fullWidth,
  onClickSignUp,
}: {
  event: ZetkinEventWithStatus;
  fullWidth?: boolean;
  onClickSignUp?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}): JSX.Element => {
  const messages = useMessages(messageIds);
  const user = useUser();
  const { requiresConnect, signUp, undoSignup } = useEventActions(
    event.organization.id,
    event.id
  );

  if (event.status == 'booked') {
    return (
      <ZUIText key="booked" variant="bodySmRegular">
        <Msg
          id={messageIds.activityList.eventStatus.booked}
          values={{ org: event.organization.title }}
        />
      </ZUIText>
    );
  }
  if (event.status == 'signedUp') {
    return (
      <>
        <ZUIButton
          key="action"
          fullWidth={fullWidth}
          label={messages.activityList.actions.undoSignup()}
          onClick={() => undoSignup()}
          size="large"
          variant="secondary"
        />
        <Fade key="signedUp" appear in style={{ transitionDelay: '0.3s' }}>
          <span>
            <ZUISignUpChip status="signedUp" />
          </span>
        </Fade>
      </>
    );
  }

  if (!user) {
    if (onClickSignUp) {
      return (
        <ZUIButton
          fullWidth={fullWidth}
          label={messages.activityList.actions.signUp()}
          onClick={(ev) => {
            onClickSignUp(ev);
          }}
          size="large"
          variant="primary"
        />
      );
    }

    return (
      <ZUIButton
        fullWidth={fullWidth}
        href={`/login?redirect=${encodeURIComponent(
          `/o/${event.organization.id}/events/${event.id}`
        )}`}
        label={messages.activityList.actions.loginToSignUp()}
        size="large"
        variant="primary"
      />
    );
  }

  const buttonLabel = requiresConnect
    ? messages.activityList.actions.connectAndSignUp()
    : messages.activityList.actions.signUp();

  return (
    <>
      <ZUIButton
        key="action"
        fullWidth={fullWidth}
        label={buttonLabel}
        onClick={(ev) => {
          if (onClickSignUp) {
            onClickSignUp(ev);
          }

          if (!ev.isDefaultPrevented()) {
            signUp();
          }
        }}
        size="large"
        variant="primary"
      />
      {event.num_participants_available < event.num_participants_required && (
        <ZUISignUpChip status="needed" />
      )}
    </>
  );
};
