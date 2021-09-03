const Hapi = require('@hapi/hapi');
const hapiAuthJWT = require('hapi-auth-jwt2');
const ip = require("ip");
const logger=(pool,id_manager,id_company,type,description,url,params)=>{
    console.log(id_manager,id_company,type,description,url)
}

const init = async (configs) => {
    const host = ip.address() || configs.server.host;
    const port = process.env.PORT || configs.server.port;
    const server = new Hapi.Server({
        debug: { request: ['error'] },
        host,
        port,
        routes: {
            timeout: {
                server: 60000 * 60
            },
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with','x-custom-header']
            }
        }
    });
    for(const plugin of configs.server.plugins){
        await require('./plugin/'+plugin).register(server,configs);
    }
    for(const module of configs.server.modules){
        await server.register({plugin:require('./api/'+module),options:{configs:configs.modules,func:require('./function')}});
    }
    server.ext({
        type: 'onRequest',
        method: async function (request, h) {
            request.server.config = Object.assign({}, );
            request.server.logger = logger;
            console.log(request.path)
            return h.continue;
        }
    });
    return server;
};
module.exports={init};