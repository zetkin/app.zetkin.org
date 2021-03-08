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

    return config;
}
