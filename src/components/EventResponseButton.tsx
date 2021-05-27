import Checkmark from '@spectrum-icons/workflow/Checkmark';
import { FormattedMessage as Msg } from 'react-intl';
import { Button, Flex } from '@adobe/react-spectrum';

import { ZetkinEvent } from '../types/zetkin';

interface EventResponseButtonProps {
    event: ZetkinEvent;
    onSignup?: (eventId: number, orgId: number) => void;
    onUndoSignup: (eventId: number, orgId: number) => void;
}

export default function EventResponseButton ({ event, onSignup, onUndoSignup } : EventResponseButtonProps) : JSX.Element {
    if (event.userBooked) {
        return (
            <Flex
                alignItems="center"
                data-testid="booked"
                marginTop="3px"
                minHeight="32px">
                <Checkmark aria-label="Inbokad" color="positive" />
                <Msg id="misc.eventResponseButton.booked" />
            </Flex>
        );
    }

    //TODO: Remove when getRespondEvents and eventResponses has been refactored.
    if (!onSignup) {
        return (
            <Button
                data-testid="event-response-button"
                marginTop="size-50"
                onPress={ () => onUndoSignup(event.id, event.organization.id) }
                variant="negative">
                <Msg id="misc.eventResponseButton.actions.undoSignup" />
            </Button>
        );
    }

    return (
        <>
            { event.userResponse ? (
                <Button
                    data-testid="event-response-button"
                    marginTop="size-50"
                    onPress={ () => onUndoSignup(event.id, event.organization.id) }
                    variant="negative"
                    width="100%">
                    <Msg id="misc.eventResponseButton.actions.undoSignup" />
                </Button>
            ) : (
                <Button
                    data-testid="event-response-button"
                    marginTop="size-50"
                    onPress={ () => onSignup(event.id, event.organization.id) }
                    variant="primary"
                    width="100%">
                    <Msg id="misc.eventResponseButton.actions.signup" />
                </Button>
            ) }
        </>
    );

}
