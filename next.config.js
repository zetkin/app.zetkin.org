module.exports = {
    async redirects() {
        return [
            {
                source: '/:prevPath*/calendar/events',
                destination: '/:prevPath*/calendar', 
                permanent: false,
            },
            {
                source: '/:prevPath*/calendar/tasks',
                destination: '/:prevPath*/calendar', 
                permanent: false,
            },
        ]
    },
};
