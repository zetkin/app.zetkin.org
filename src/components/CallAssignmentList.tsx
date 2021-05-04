import { FormattedMessage as Msg } from 'react-intl';
import { Flex, Text, View } from '@adobe/react-spectrum';

import { ZetkinCallAssignment, ZetkinMembership } from '../types/zetkin';

interface CallAssignmentListProps {
    callAssignments: ZetkinCallAssignment[] | undefined;
    memberships: ZetkinMembership[] | undefined;
}

export default function CallAssignmentList ({ callAssignments, memberships } : CallAssignmentListProps) : JSX.Element {

    if (!callAssignments || callAssignments.length === 0) {
        return (
            <Text data-testid="no-assignments-placeholder">
                <Msg id="misc.callAssignmentList.placeholder"/>
            </Text>
        );
    }

    return (
        <>
            { callAssignments.map((call) => {
                let orgTitle;
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                for (const obj of memberships!) {
                    if (obj.organization.id === call.organization_id) {
                        orgTitle = obj.organization.title;
                    }
                }
                return (
                    <Flex key={ call.id } data-testid="call-assignment" direction="column" margin="size-200">
                        <View data-testid="call-title">
                            { call.title }
                        </View>
                        <View data-testid="call-org">{ orgTitle }</View>
                    </Flex>
                );
            }) }
        </>
    );
}

