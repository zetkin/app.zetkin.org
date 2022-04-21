import { muiTheme } from 'storybook-addon-material-ui';
import { RouterContext } from 'next/dist/shared/lib/router-context'; // next 11.1
import theme from '../src/theme';

export const decorators = [muiTheme([theme])];

export const parameters = {
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};
