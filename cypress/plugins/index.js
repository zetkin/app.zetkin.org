const webpackPreprocessor = require('@cypress/webpack-preprocessor');

module.exports = (on, config) => {
    require('@cypress/react/plugins/next')(on, config);

    on('file:preprocessor', webpackPreprocessor({
        webpackOptions: {
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: {
                            loader: 'ts-loader',
                            options: {
                                configFile: 'tsconfig.cypress.json',
                            }
                        },
                        exclude: /node_modules/,
                    },
                    {
                        test: /\.css$/,
                        use: [{
                            loader: 'css-loader',
                        }]
                    },
                ],
            },
            resolve: {
                extensions: [ '.css', '.js', '.ts', '.tsx' ],
            }
        }
    }));

    on('before:browser:launch', (browser = {}, options) => {
        if (browser.name === 'firefox') {
            options.args.push('--devtools');
        }
        else if (browser.name === 'chrome') {
            options.args.push('--auto-open-devtools-for-tabs');
        }

        return options;
    });
    return config;
}
