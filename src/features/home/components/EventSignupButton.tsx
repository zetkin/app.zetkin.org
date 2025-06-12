import { Fade } from '@mui/material';

import { Msg, useMessages } from 'core/i18n';
import messageIds from '../l10n/messageIds';
import useEventActions from '../hooks/useEventActions';
import { ZetkinEventWithStatus } from '../types';
import ZUIText from 'zui/components/ZUIText';
import ZUIButton from 'zui/components/ZUIButton';
import ZUISignUpChip from 'zui/components/ZUISignUpChip';

export const EventSignupButton = ({
  event,
  onClickSignUp,
}: {
  event: ZetkinEventWithStatus;
  onClickSignUp?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}): JSX.Element => {
  const messages = useMessages(messageIds);
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

  const buttonLabel = requiresConnect
    ? messages.activityList.actions.connectAndSignUp()
    : messages.activityList.actions.signUp();

  return (
    <>
      <ZUIButton
        key="action"
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
