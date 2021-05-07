import { Flex, View } from '@adobe/react-spectrum';

import { ZetkinCallAssignment } from '../types/zetkin';

interface CallAssignmentListProps {
    callAssignments: ZetkinCallAssignment[] | undefined;
}

export default function CallAssignmentList ({ callAssignments } : CallAssignmentListProps) : JSX.Element | null {

    if (!callAssignments || callAssignments.length === 0) {
        return null;
    }

    return (
        <>
            { callAssignments.map((ass) => {
                return (
                    <Flex key={ ass.id } data-testid="call-assignment" direction="column" margin="size-200">
                        <View data-testid="call-assignment-title">
                            { ass.title }
                        </View>
                        <View data-testid="call-assignment-org">{ ass.organization.title }</View>
                    </Flex>
                );
            }) }
        </>
    );
}
