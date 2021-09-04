const {uploadFiles}=require('../schem/upload');
exports.plugin = {
    name:'upload',
    version:'0.0.1',
    register: async (server,options)=>{
        server.route({
            method: 'POST',
            path: '/upload',
            config: {
                async handler(req) {
                    const data = req.payload;
                    return await options.func.loadImg(req, data.files);
                },
                payload: {
                    output: 'stream',
                    parse: true,
                    allow: 'multipart/form-data',
                    maxBytes: 1024 * 1024 * 200,
                    multipart: true
                },
                tags: ['api'],
                validate: {
                    payload: uploadFiles
                }
            }
        });
    }
};