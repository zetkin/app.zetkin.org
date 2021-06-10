import { IntlProvider } from 'react-intl';
import { mount } from '@cypress/react';
import theme from '../theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { defaultTheme, Provider } from '@adobe/react-spectrum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export const mountWithProviders = (elem : any) : any => mount(
    <Provider theme={ defaultTheme }>
        <ThemeProvider theme={ theme }>
            <IntlProvider locale="en">
                { elem }
            </IntlProvider>
        </ThemeProvider>
    </Provider>,
);