const {uploadFiles,configUpload}=require('../schem/upload');
const classifier=require("../classifier/index")
const fs = require('fs');
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
                    const files=await options.func.loadFile(req, data.files.length>0?data.files:[data.files]);
                    const end=await classifier.start(files.array_name)
                    /*files.array_name.forEach(f=>{
                        fs.unlinkSync('./upload/'+f)
                    })*/
                    return end
                },
                payload: {
                    output: 'stream',
                    parse: true,
                    allow: 'multipart/form-data',
                    maxBytes: 1024 * 1024 * 200,
                    multipart: true,
                    timeout:36000000
                },
                tags: ['api'],
                validate: {
                    payload: uploadFiles
                }
            }
        });
        server.route({
            method: 'GET',
            path: '/upload',
            config: {
                async handler(req) {
                    return fs.readFileSync('./classifier/classifierConfig.json')
                },
                tags: ['api']
            }
        });
        server.route({
            method: 'PUT',
            path: '/upload',
            config: {
                async handler(req) {
                    const json=req.payload.json;
                    fs.writeFileSync('./classifier/classifierConfig.json',json)
                    return true
                },
                tags: ['api'],
                validate: {
                    payload: configUpload
                }
            }
        });
    }
};