module.exports = (on, config) => {
    require('@cypress/react/plugins/next')(on, config);

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
