import { Box } from '@material-ui/core';
import { FunctionComponent } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import EditTextinPlace from 'components/EditTextInPlace';
import getView from 'fetching/views/getView';
import patchView from 'fetching/views/patchView';
import TabbedLayout from './TabbedLayout';
import ViewJumpMenu from 'components/views/ViewJumpMenu';
import ZetkinQuery from 'components/ZetkinQuery';
import { ZetkinView } from 'types/views';


const SingleViewLayout: FunctionComponent = ({ children }) => {
    const intl = useIntl();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { orgId, viewId } = router.query;
    const viewQuery = useQuery(['view', viewId ], getView(orgId as string, viewId as string));

    const patchViewMutation = useMutation(patchView(orgId as string, viewId as string));

    const updateTitle = async (view: ZetkinView, newTitle: string) => {
        try {
            await patchViewMutation.mutateAsync({ title: newTitle }, {
                onSettled: () => queryClient.invalidateQueries(['view' ]),
            });
            return true;
        }
        catch (error) {
            return false;
        }
    };

    const title = (
        <ZetkinQuery queries={{ viewQuery }}>
            { ({ queries: { viewQuery } }) => {
                const view = viewQuery.data;
                return (
                    <Box>
                        <EditTextinPlace clearIfMatchText={ intl.formatMessage({ id: 'misc.views.newViewFields.title' }) }
                            label="title"
                            onSubmit={ (newTitle: string) => updateTitle(view, newTitle) }
                            text={ view?.title }
                        />
                        <ViewJumpMenu/>
                    </Box>
                );
            } }
        </ZetkinQuery>

    );

    return (
        <TabbedLayout
            baseHref={ `/organize/${orgId}/people/views/${viewId}` }
            defaultTab="/"
            fixedHeight={ true }
            tabs={ [
                { href: `/`, messageId: 'layout.organize.view.tabs.view' },
            ] }
            title={ title }>
            { children }
        </TabbedLayout>
    );
};

export default SingleViewLayout;
