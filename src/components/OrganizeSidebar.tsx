import Calendar from '@spectrum-icons/workflow/Calendar';
import Home from '@spectrum-icons/workflow/Home';
import Inbox from '@spectrum-icons/workflow/Inbox';
import MapView from '@spectrum-icons/workflow/MapView';
import NextLink from 'next/link';
import PeopleGroup from '@spectrum-icons/workflow/PeopleGroup';
import User from '@spectrum-icons/workflow/User';
import { useRouter } from 'next/router';
import {
    Button, Flex,
} from '@adobe/react-spectrum';


interface OrganizeSidebarProps {
    orgId: string;
}

const OrganizeSidebar = ({ orgId  } : OrganizeSidebarProps) : JSX.Element =>{
    const router = useRouter();
    const key = router.pathname.split('[orgId]')[1];

    return (
        <Flex direction="column" height="100%" justifyContent="space-between">
            <Flex direction="column">
                <NextLink href={ `/organize/${orgId}` }>
                    <Button data-test="home-button" isDisabled={ key === '' } margin="size-100" variant="primary" width="size-00">
                        <Home aria-label="Home" />
                    </Button>
                </NextLink>
                <NextLink href={ `/organize/${orgId}/people` }>
                    <Button data-test="people-button" isDisabled={ key.startsWith('/people') } margin="size-100" variant="primary">
                        <PeopleGroup aria-label="People" />
                    </Button>
                </NextLink>
                <NextLink href={ `/organize/${orgId}/areas` }>
                    <Button data-test="area-button" isDisabled={ key.startsWith('/area') } margin="size-100" variant="primary">
                        <MapView aria-label="Areas" />
                    </Button>
                </NextLink>
                <NextLink href={ `/organize/${orgId}/campaigns/calendar` }>
                    <Button data-test="calendar-button" isDisabled={ key.startsWith('/campaigns') } margin="size-100" variant="primary">
                        <Calendar aria-label="Calendar" />
                    </Button>
                </NextLink>
            </Flex>
            <Flex direction="column">
                <Button data-test="inbox-button" margin="size-100" variant="secondary">
                    <Inbox aria-label="Inbox" />
                </Button>
                <Button data-test="user-button" margin="size-100" variant="secondary">
                    <User aria-label="User" />
                </Button>
            </Flex>
        </Flex>
    );
};

export default OrganizeSidebar;
