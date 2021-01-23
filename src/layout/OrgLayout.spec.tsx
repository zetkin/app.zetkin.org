import { FunctionComponent } from 'react';
import { mount } from '@cypress/react';
import { QueryClient, QueryClientProvider } from 'react-query';

import OrgLayout from './OrgLayout';

import * as nextRouter from 'next/router';

const MockEnv : FunctionComponent = (props) => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(['org', '1'], {
        data: {
            id: 1,
            title: 'My org',
        },
    });

    return (
        <QueryClientProvider client={ queryClient }>
            { props.children }
        </QueryClientProvider>
    );
};

describe('OrgLayout', () => {
    beforeEach(() => {
        cy.stub(nextRouter, 'useRouter', () => ({
            prefetch: () => Promise.resolve({}),
            route: '/',
        }));

        cy.intercept({
            method: 'GET',
            url: /\/api\/orgs\/1$/,
        }, {
            data: {
                id: 1,
                title: 'My org',
            },
        });
    });

    it('renders children', () => {
        mount(
            <MockEnv>
                <OrgLayout orgId="1">
                    <h1>Hello, World!</h1>
                </OrgLayout>
            </MockEnv>
        );

        cy.contains('Hello, World!');
    });

    it('renders org title', () => {
        mount(
            <MockEnv>
                <OrgLayout orgId="1">
                    <h1>Hello, World!</h1>
                </OrgLayout>
            </MockEnv>
        );

        cy.contains('My org');
    });

    it('renders org logo', () => {
        mount(
            <MockEnv>
                <OrgLayout orgId="1">
                    <h1>Hello, World!</h1>
                </OrgLayout>
            </MockEnv>
        );

        cy.get('[data-test=org-logo]').should('have.attr', 'src', '/api/orgs/1/avatar');
    });
});
