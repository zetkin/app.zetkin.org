import { grey } from '@material-ui/core/colors';
import { useIntl } from 'react-intl';
import { Box,  makeStyles, Tab, Tabs } from '@material-ui/core';
import { ChangeEvent, useState } from 'react';
import { FunctionComponent, ReactText } from 'react';

interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string | undefined;
}

interface OrganizeCampaignTabsProps {
    currentTab?: string;
    onSelectTab: (key : ReactText) => void;
}

function TabPanel(props:TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            aria-labelledby={ index }
            hidden={ value !== index }
            id={ `tabpanel-${index}` }
            role="tabpanel"
            { ...other }>
            { value === index && (
                <Box>
                    { children }
                </Box>
            ) }
        </div>
    );
}

const useStyles = makeStyles(() => ({
    root: {
        backgroundColor: grey[100],
        flexGrow: 1,
    },
}));

const OrganizeCampaignTabs: FunctionComponent<OrganizeCampaignTabsProps> = ({ children, currentTab, onSelectTab }) => {
    const intl = useIntl();
    const classes = useStyles();
    const [value, setValue] = useState(currentTab);

    const handleChange = (event: ChangeEvent<unknown>, newValue: string) => {
        setValue(newValue);
        onSelectTab(newValue);
    };

    return (
        <div className={ classes.root }>
            <Tabs aria-label="campaign tabs" indicatorColor="primary" onChange={ handleChange } textColor="primary" value={ value }>
                <Tab label={ intl.formatMessage({
                    id: 'layout.organize.campaigns.summary',
                }) } value="summary"
                />
                <Tab label={ intl.formatMessage({
                    id: 'layout.organize.campaigns.calendar',
                }) } value="calendar"
                />
                <Tab label={ intl.formatMessage({
                    id: 'layout.organize.campaigns.insights',
                }) } value="insights"
                />
            </Tabs>
            <TabPanel index="summary" value={ value }>
                { children }
            </TabPanel>
            <TabPanel index="calendar" value={ value }>
                { children }
            </TabPanel>
            <TabPanel index="insights" value={ value }>
                { children }
            </TabPanel>
        </div>
    );
};

export default OrganizeCampaignTabs;