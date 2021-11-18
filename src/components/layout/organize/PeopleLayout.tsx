import { useRouter } from 'next/router';

import TabbedLayout from './TabbedLayout';


const PeopleLayout: React.FunctionComponent = ({ children }) => {
    const { orgId } = useRouter().query;

    return (
        <TabbedLayout
            baseHref={ `/organize/${orgId}/people` }
            defaultTab="/views"
            tabs={ [
                { href: `/views`, messageId: 'layout.organize.people.tabs.views' },
            ] }
            title="People">
            { children }
        </TabbedLayout>
    );
};

export default PeopleLayout;
