import mockAssignedTask from 'test-utils/mocks/mockAssignedTask';
import { render } from 'test-utils';
import singletonRouter from 'next/router';
import TaskStatusSubtitle from './TaskStatusSubtitle';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

describe('TaskStatusSubtitle', () => {
    it('shows correct task status.', () => {
        const task = mockAssignedTask();

        singletonRouter.query = {
            orgId: '1',
        };

        const { getByText } = render(<TaskStatusSubtitle task={ task } />);
        const statusSubtitle = getByText('misc.tasks.taskAssigneesList.completedStates.notCompleted');
        expect(statusSubtitle).not.toBeNull();
    });
});
