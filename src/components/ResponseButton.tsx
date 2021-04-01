import { Button } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';
import { UseMutationResult } from 'react-query';

import { ZetkinEventResponse, ZetkinEventSignup } from '../types/zetkin';

interface ResponseButtonProps {
    eventId: number;
    orgId: number;
    eventResponses: ZetkinEventResponse[] | undefined;
    mutationAdd: UseMutationResult<ZetkinEventResponse, unknown, ZetkinEventSignup, unknown>;
    mutationRemove: UseMutationResult<void, unknown, ZetkinEventSignup, unknown>;
}

const ResponseButton = (
    { eventId, orgId, eventResponses, mutationAdd, mutationRemove }
    : ResponseButtonProps) : JSX.Element => {

    const addResponse = (eventId : number, orgId : number) => {
        mutationAdd.mutate({ eventId, orgId });
    };

    const removeResponse = (eventId : number, orgId : number) => {
        mutationRemove.mutate({ eventId, orgId });
    };

    const active = eventResponses?.find(response => response.action_id === eventId);

    if (active) {
        return (
            <Button
                data-test="undo-sign-up-button"
                marginTop="size-50"
                onPress={ () => removeResponse(eventId, orgId) }
                variant="cta">
                <Msg id="misc.eventList.undoSignup"/>
            </Button>
        );
    }
    return (
        <Button
            data-test="sign-up-button"
            marginTop="size-50"
            onPress={ () => addResponse(eventId, orgId) }
            variant="cta">
            <Msg id="misc.eventList.signup"/>
        </Button>
    );
};

export default ResponseButton;