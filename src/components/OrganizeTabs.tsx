import { useIntl } from 'react-intl';
import { Content, View } from '@adobe/react-spectrum';
import { FunctionComponent, ReactText } from 'react';
import { Item, Tabs } from '@react-spectrum/tabs';

interface OrganizeTabsProps {
    currentTab?: string;
    onSelectTab: (key : ReactText) => void;
}
const OrganizeTabs: FunctionComponent<OrganizeTabsProps> = ({ children, currentTab, onSelectTab }) => {
    const intl = useIntl();

    return (
        <View flexGrow={ 1 } padding="0 1rem" width="100%">
            <Tabs aria-label="Campaign Menu"
                onSelectionChange={ onSelectTab }
                selectedKey={ currentTab }>
                <Item key="summary" title={ intl.formatMessage({
                    id: 'layout.organize.campaigns.summary',
                }) }>
                    <Content>{ children }</Content>
                </Item>
                <Item key="calendar" title={ intl.formatMessage({
                    id: 'layout.organize.campaigns.calendar',
                }) }>
                    <View flexGrow={ 1 } maxHeight="90vh">
                        { children }
                    </View>
                </Item>
                <Item key="insights" title={ intl.formatMessage({
                    id: 'layout.organize.campaigns.insights',
                }) }>
                    <Content>{ children }</Content>
                </Item>
            </Tabs>
        </View>
    );
};

export default OrganizeTabs;