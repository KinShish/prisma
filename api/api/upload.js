exports.plugin = {
    name:'upload',
    version:'0.0.1',
    register: async (server)=>{
        server.route({
            method: 'POST',
            path: '/upload',
            config: {
                async handler(req) {
                    return "Есть"
                },
                description: 'Просмотр объявления',
                tags: ['api']
            }
        });
    }
};